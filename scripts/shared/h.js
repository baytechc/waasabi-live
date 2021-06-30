import DBG from 'debug';
const debug = DBG('generate:h-js');

import fs from 'fs-extra';
import { join, dirname, basename, resolve } from 'path';

import marked from 'esmarked';
import format from 'html-prettify';

import relative from './relative.js';
import { rel } from './rootdir.js';


const importDirs = {
  includes: {
    path: 'src/includes',
  }
};


export default function generate(ROOT, SRC, IN) {
  const IN_FILE = join(SRC, IN)+'.md';
  const IN_HTML = join(SRC, IN)+'.html';

  const OUT_FILE = join(SRC, IN)+'.h.js';
  const OUT_DIR = dirname(OUT_FILE);

  // Markdown source is parsed into HTML first
  let src;
  try {
    src = fs.readFileSync(IN_FILE).toString();

    debug('Translating: %s', rel(IN_FILE));

    // Remove leading whitespace
    src = src.replace(/(^\s+|\n\ +|\s+$)/g, '\n');

    // Markdown to HTML
    src = format(fixUrlVars(marked(src, { walkTokens: markdownTokens })));
  }
  catch(e) {
    // Only fail on other than "FILE NOT FOUND"-errors
    if (e.code !== 'ENOENT') {
      console.error(e);
      process?.exit(1);
    }

    // Try loading html instead
    src = format(expandVars(fs.readFileSync(IN_HTML).toString()));

    debug('Translating: %s', rel(IN_HTML));
  }

  const sourceType = src.includes('<html') ? 'html' : 'htmlFragment';

  const lib = `import { ${sourceType}Sync as html } from 'lit-ntml';`;
  const config = `import config from '${relative(OUT_DIR, join(ROOT, 'src', 'config.js'))}';`;

  // TODO: generalize
  const includePath = resolve(ROOT, importDirs.includes.path);
  const includes = fs.readdirSync(includePath);
  const imports = generateImports(OUT_FILE, includePath, includes);
  // TODO: only add the imports that are actually referenced?

  const file = [ lib, config, imports ].join('\n') + '\n'
    + 'export default data => html`' + src + '`;';

  fs.writeFileSync(OUT_FILE, file);
  debug('  %s - %s CREATED', rel(OUT_FILE), sourceType);
  return { outFile: OUT_FILE, sourceType };
}

// Allows for expanding contents of markdown tokens during parsing by marked
function markdownTokens(t) {
  const { type } = t;
  if (type == 'text' || type == 'image' || type == 'html') {
    t.text = expandVars(t.text);
  }
  if (type == 'link' || type == 'image') {
    t.href = expandVars(t.href);
  }
}

function expandVars(s) {
  // Expand variable short forms
  // $FOOBAR and ${FOOBAR} -> ${config.FOOBAR}
  s = s.replace(/\$\{?([A-Z0-9_]+)\}?/g, '${config.$1}');

  // Instrument include()-ed fragments with data pass-through
  s = s.replace(/\$\{?(includes.\w+)\}?/g, '${$1(data)}');

  return s;
}

function fixUrlVars(s) {
  return s.replace(/\$%7B([^%]+)%7D/g, '${$1}');
}

function generateImports(source, path, files) {
  const sourcedir = dirname(source);
  const sourcefile = basename(source);

  // Only deal with .h.js files, remove self
  const filtered = files.filter(f => f.endsWith('.h.js')).filter(f => !f.endsWith(sourcefile));
  // Remove extension to get the import identifier
  const sources = filtered.map(fn => fn.substring(0,fn.length-5));
  // Do we even have any remaining includes after filtering?
  debug('  %d files, %d imports: %o', files.length, sources.length, sources);
  if (!sources.length) return '';
 
  const imports = sources.map(
    f => `import _includes_${f} from '${relative(sourcedir, join(path, f+".h.js"))}'`
  ).join('\n');
  
  // Generate a dictionary of imports
  //TODO: generate a dictionary module that does this via re-exports in the target directory
  const dict = sources.map(f => `  ${f}: _includes_${f},`).join('\n');
 
  return imports +'\n\n'
    +`const includes = {` + '\n'
    +dict +'\n'
  +`};`+'\n';
}

