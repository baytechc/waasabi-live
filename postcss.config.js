import pNested from 'postcss-nested';
import pAutoprefixer from 'autoprefixer';
import pNano from 'cssnano';

import globby from 'globby';

import cfg from './website.config.js';


const paths = new Set();
[
  // Fonts
  globby.sync('public/assets/fonts/**/*.css'),

  // Base CSS
  //globby.sync('src/css/*.css'),
globby.sync('src/css/{typography,forms}.css'),

  // Page-specific CSS
  globby.sync('src/css/components/*.css'),
  globby.sync('src/css/pages/*.css'),

  // Style overrides
  globby.sync('src/css/overrides/*.css'),
globby.sync('src/css/{layout,theme}.css'),

  // Branding CSS
  globby.sync((cfg.WAASABI_BRAND||'brand')+'/src/css/**/*.css'),
].forEach(glob => glob.forEach(p => paths.add(p)));

export default (ctx) => ({
  map: ctx.options.map,
  plugins: [
    pNested,
    pAutoprefixer,
    pNano({
      preset: 'default',
    }),
  ],

  //TODO: check for the canonical postcss.config.js properties
  generate: {
    header: '',
    from: Array.from(paths),
    outdir: '_site/',
    // If no outfile don't concat into single file
    outfile: '_site/style.css',
  }
});
