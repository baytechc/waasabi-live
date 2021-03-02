import dotenv from 'dotenv';
dotenv.config();

import esbuild from 'esbuild';

import cfg from './website.config.js';

const DEBUG = (process.env.DEBUG == '*');

export function run() {
  const MINIFY = true && !(
    process.env.ESBUILD_NOMINIFY || process.env.DEVELOP || DEBUG);

  console.log(`[esbuild] Rebuilding JavaScript...`);

  if (!MINIFY) console.log(`[esbuild] Generating unminified bundle...`);

  try {
    esbuild.buildSync({
      entryPoints: ['src/js/website.js'],
      bundle: true,
      minify: MINIFY,
      sourcemap: true,
      target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
      outfile: '_site/website.js',
      define: defines(),
    });
  }
  catch (e) {
    console.error(e);
  }
}

function defines() {
    const redefs = {};

    redefs['process.env.NODE_ENV'] = '"production"';

    for (let [k,v] of Object.entries(cfg)) {
      redefs[`process.env.${k}`] = k in process.env ? process.env[k] : JSON.stringify(v);
    }

    if (DEBUG) console.log('redefs:', redefs);

    return redefs;
}


export default {
  run
};

run();