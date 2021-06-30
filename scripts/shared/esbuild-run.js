import dotenv from 'dotenv';
dotenv.config();

import DBG from 'debug';
const debug = DBG('esbuild');

import esbuild from 'esbuild';

import config from '../../src/config.js';

import { join } from 'path';
import { R, rel } from './rootdir.js';

import { inspect } from 'util';
function ins(v) { return inspect(v, { depth: null, colors: true }) }


export default function run(opts = {}) {
  if (opts.debug) DBG.enable('esbuild,esbuild:*');

  // Minification is enabled by default, but turned off in debug mode,
  // when the nominify option or ESBUILD_NOMINIFY is present or in
  // DEVELOP mode (devserver)
  const MINIFY = true && !(
    opts.debug || opts.nominify || process.env.ESBUILD_NOMINIFY || process.env.DEVELOP);

  debug('Rebuilding JavaScript...');

  if (!MINIFY) debug('Generating unminified bundle...');

  const buildConfig = {
    entryPoints: [
      opts.root ? join(opts.root, 'src/js/website.js') : R('src/js/website.js')
    ],
    bundle: true,
    minify: MINIFY,
    sourcemap: true,
    target: ['es2018'],
    outfile: R(join(config.BUILD_DIR, config.PREFIX, 'website.js')),
    define: defines(opts),
  }

  debug('Entry points: %o', buildConfig.entryPoints);

  try {
    esbuild.buildSync(buildConfig);
  }
  catch (e) {
    console.error(e);
  }

  debug('  %s - CREATED', rel(buildConfig.outfile));
}

function defines(opts = {}) {
  let redefs = opts.redefs ?? {};
    redefs['process.env.NODE_ENV'] = '"production"';

    // Expose the PREFIX and all WAASABI_* variables from config.js to JavaScript
    const configEntries = Object.entries(config).map(([k,v]) => [ k.startsWith('WAASABI_') ? k : 'W_'+k, v ]);

    debug('Defined source replacements:');
    for (let [k,v] of configEntries) {
      redefs[`process.env.${k}`] = k in process.env ? process.env[k] : JSON.stringify(v);
      debug('  %s => %s', k, ins(v));
    }

    return redefs;
}
