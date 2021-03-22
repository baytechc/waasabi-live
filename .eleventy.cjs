require('dotenv').config();
//import dotenv from 'dotenv';
//dotenv.config();

//const esbuild = require('./.esbuild.js');
//import esbuild from './.esbuild.js';

// Plugins
const pluginPostCSS = require('eleventy-plugin-sourcemapped-postcss');
//import pluginPostCSS from 'eleventy-plugin-sourcemapped-postcss';

const fs = require('fs-extra');

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
  eleventyConfig.addWatchTarget('./index.11ty.js');
  eleventyConfig.addWatchTarget('./postcss.config.js');

  // If a brand directory exists copy all of ./public into ./.prebuild,
  // then overwrite assets with the overrides from ./brand and use
  // this prebuild directory to generate assets from then on.
  // WARNING: this breaks watch/autoreload, only use in production
  if (fs.existsSync('./brand')) {
    fs.copySync('./public', './.prebuild');
    fs.copySync('./brand', './.prebuild');

    eleventyConfig.addPassthroughCopy({ '.prebuild': '.' });

  // Copy/watch only original sources
  } else {
    eleventyConfig.addWatchTarget('./public/');
    eleventyConfig.addPassthroughCopy({ 'public': '.' },)
  }

  // Pass-through copy videojs dist
  eleventyConfig.addPassthroughCopy(
    { 'node_modules/video.js/dist/*.min.css': './assets/videojs' }
  );

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
