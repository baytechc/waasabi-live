import DBG from 'debug';
const debug = DBG('postcss-config');

import pNested from 'postcss-nested';
import pAutoprefixer from 'autoprefixer';
import pNano from 'cssnano';
import pUrl from 'postcss-url';

import globby from 'globby';

import { join, resolve } from 'path';

import config from './src/config.js';

function sources(root) {
  const sources =   [
    // Fonts
    'assets/fonts/**/*.css',
    // Video.JS
    'assets/videojs/**/*.css',

    // Base CSS
    //'src/css/*.css',
    'src/css/{typography,forms}.css',

    // Page-specific CSS
    'src/css/components/*.css',
    'src/css/pages/*.css',

    // Style overrides
    'src/css/overrides/*.css',
    'src/css/{layout,theme}.css',
  ];

  const paths = new Set();
  for (const src of sources) {
    const matches = globby.sync(resolve(root||'', src));
    matches.forEach(p => paths.add(p));
    debug('  %s - %d files', src, matches.length);
  }

  return paths;
}

export default (ctx) => ({
  map: ctx?.options.map,
  plugins: [
    pNested,
    pAutoprefixer,
    // TODO: inline files under a given size limit?
    // https://github.com/postcss/postcss-url#maxsize
    pUrl({
      //asset { url, originUrl, pathname, absolutePath, relativePath, search, hash }
      url: ({url}) => (url[0] === '/'
        ? config.PREFIX+url
        : url
    )}),
    pNano({
      preset: 'default',
    }),
  ],

  //TODO: check for the canonical postcss.config.js properties
  generate: {
    header: '',
    from: Array.from(sources(ctx?.options.root)),
    outdir: join(config.BUILD_DIR, config.PREFIX),
    // If no outfile don't concat into single file
    outfile: join(config.BUILD_DIR, config.PREFIX, 'style.css'),
  },
});
