import DBG from 'debug';
const debug = DBG('generate');

import fs from 'fs';

import generate from './h.js';

import { R, rel } from './rootdir.js';
import config from '../../src/config.js';



export default async function run(opts = {}) {
  // Enable debugging
  if (opts.debug) DBG.enable('generate,generate:*');

  // TODO: glob these out
  const partFiles = [
    // src/includes/head
    [
      'src/includes',
      'head'
    ],
  ];
  const pageFiles = [
    // src/index.md
    [
      'src',
      'index'
    ],
  ];
    

  debug('Translating %d page parts...', partFiles.length);

  for (const [ src, file ] of partFiles) {
    generate(opts.root||'', R(opts.root, src), file);
  }

  debug('Generating static pages...');

  for (const [ src, file ] of pageFiles) {
    // Generate JS template
    const { outFile, sourceType } = generate(opts.root||'', R(opts.root, src), file);

    // If result is a full html page not a part, generate the output document
    //TODO: source data
    if (sourceType == 'html') {
      const data = {};
      const pageGen = await import(outFile);
      const page = pageGen.default(data);

      // TODO: allow target folders
      const staticPage = R(config.BUILD_DIR, file+'.html');
      fs.writeFileSync(staticPage, page);
      debug('  %s - CREATED', rel(staticPage));
    }
  }
}
