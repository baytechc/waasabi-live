require('dotenv').config();
//import dotenv from 'dotenv';
//dotenv.config();

//const esbuild = require('./.esbuild.js');
//import esbuild from './.esbuild.js';

// Plugins
const pluginPostCSS = require('eleventy-plugin-sourcemapped-postcss');
//import pluginPostCSS from 'eleventy-plugin-sourcemapped-postcss';

// TODO: Watch targets
const watchTargets = [
  //...
];

module.exports = function(eleventyConfig) {
//export default function(eleventyConfig) {
  eleventyConfig.setDataDeepMerge(true);

  // Plugins
  [
    pluginPostCSS,
  ].forEach(plugin => eleventyConfig.addPlugin(plugin));

  // Build JS on first run
  import('./.esbuild.js').then(esbuild => esbuild.run());

  // Automatic JS rebuild
  eleventyConfig.on('beforeWatch', async () => {
    if (process.env.DEBUG) console.log(`[esbuild] --watch fired, rebuilding JavaScript.`);
    const esbuild = await import('./.esbuild.js');
    return esbuild.run();
  });
  eleventyConfig.addWatchTarget('./_include/');
  eleventyConfig.addWatchTarget('./src/');
  eleventyConfig.addWatchTarget('./public/');
  eleventyConfig.addWatchTarget('./brand/');
  eleventyConfig.addWatchTarget('./index.11ty.js');
  eleventyConfig.addWatchTarget('./postcss.config.js');

  // Pass-through copy
  [
    //{ 'public': '.' },

    // Brand content overwrites default public/assets content
    { 'brand': '.' },

    { 'node_modules/video.js/dist/*.min.css': './assets/videojs' },
  ].forEach(path => eleventyConfig.addPassthroughCopy(path));

  return {
    dir: {
      includes: '_includes',
      layouts: '_layouts'
    },

    templateFormats: [
      '11ty.js',
      'html',
    ],
  };
}
