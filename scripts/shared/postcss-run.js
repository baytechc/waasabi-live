import dotenv from 'dotenv';
dotenv.config();

import DBG from 'debug';
const debug = DBG('postcss');

import fs from 'fs-extra';
import { join, dirname, basename, resolve, relative } from 'path';

import postcss from 'postcss';
import sourcemapConcat from 'concat-with-sourcemaps';

import ROOT, { rel } from './rootdir.js';

import config from '../../src/config.js';
import postcssConfiguration from '../../postcss.config.js';

import { inspect } from 'util';
function ins(v) { return inspect(v, { depth: null, colors: true }) }


let postcssConfig = postcssConfiguration();

let DEBUG = process.env.DEBUG;

// Convenience function for resolving relative references to the config directory
// This will keep absolute paths intact
function cd(path) {
  return resolve(ROOT, path);
}

function mkProcessOpts(src, root) {
  return ({
    map: {
      // Disable inline source maps to ensure .map is populated
      inline: false,
      // Turn off annotations (not needed since we're concating)
      annotation: false
    },
    from: src,
    to: resolve(postcssConfig.generate.outdir, relative(root, src))
  });
}

async function transform(processor, src, root) {
  let pOpts = mkProcessOpts(src, root);
  let sourceCss = await fs.readFile(pOpts.from);

  // Transform source
  let result = await processor.process(sourceCss, pOpts);

  // Only write resulting files, do not concatenate (no outfile specified)
  if (!postcssConfig.generate.outfile) {
    // Make sure output dir exists
    await fs.ensureDir(dirname(pOpts.to));

    await fs.writeFile(pOpts.to, result.css);
    debug('CSS output: %o', pOpts.to);

    if (result.map) {
      await fs.writeFile(`${pOpts.to}.map`, concatenated.map);
      debug('Mapfile output: %o', `${pOpts.to}.map`);
    }
  }

  debug('Processed:', ins(relative(ROOT, pOpts.from)));

  // Return full processing results for further processing
  return result;
}

async function concat(results, outfile, opts = {}) {
  let out = new sourcemapConcat(true, outfile, '\n');

  // Add a header (optional)
  if (opts.header) out.add(null, opts.header);

  debug('Concatenating files...');
  for (const { opts, css, map } of results) {
    // NOTE: for some inputs stripping the entire file path
    // might not be desirable
    // TODO: make this optional/configurable?
    const filename = basename(opts.from);

    // Original source filename (with full path)
    // TODO: this isn't strictly neccessary - maybe make it optional?
    out.add(null, `/* ${opts.from} */`);

    out.add(filename, css.toString(), map.toString());
  }

  // Link generated source map
  out.add(null, `/*# sourceMappingURL=${basename(outfile)}.map */`);

  const concatenated = {
    css: out.content,  // note: is a buffer
    map: out.sourceMap // note: is a string
  }

  // Make sure output dir exists
  await fs.ensureDir(dirname(outfile));

  // Transform source and write resulting CSS
  await fs.writeFile(cd(outfile), concatenated.css);
  debug('CSS (concat) output: %o', relative(ROOT, cd(outfile)));

  await fs.writeFile(cd(`${outfile}.map`), concatenated.map);
  debug(' Mapfile output: %o', relative(ROOT, cd(outfile+'.map')));

  return concatenated;
}


export async function configuration() {
  return postcssConfig;
}

export default async function run(opts = {}) {
  // Allow debug logging
  if (opts.debug) DBG.enable('postcss,postcss:*');

  // Allow source folder override (for building from .prebuild)
  const rootDir = opts.root ?? ROOT;
  process.cwd(rootDir);
  debug('Using root directory:', rootDir);
    
  // Create a processor by using the plugins from the config file
  debug('Initializing PostCSS...');
  postcssConfig = postcssConfiguration({ options: { root: opts.root }});
  const processor = postcss(postcssConfig.plugins);

  // Process source files
  debug('Transforming source files:');
  let results = [];
  for (const sourceFile of postcssConfig.generate.from) {
      results.push(await transform(processor, sourceFile, rootDir));
  }

  // Concatenate all sources into a single source-mapped outfile
  let concatresult = await concat(results, postcssConfig.generate.outfile, {
    header: postcssConfig.generate.header,
  });

  debug('Updated CSS build');
}
