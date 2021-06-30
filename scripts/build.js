#!/usr/bin/env node
import esbuild from './shared/esbuild-run.js';
import postcss from './shared/postcss-run.js';
import generate from './shared/generate-run.js';

import config from '../src/config.js';

import fs from 'fs-extra';

import { R } from './shared/rootdir.js';
import { join } from 'path';

import {
  copySync as copy,
  copyContentsSync as copyContents,
} from './shared/cp-r.js';

const DEBUG = process.argv.includes('--debug')
  || process.argv.includes('--verbose')
  || process.argv.includes('-v');


// Branding
const brand = config.WAASABI_BRAND ?? 'brand';

// Passthrough-copy
// Sites build from .prebuild, all sources are copied into this
// folder before a rebuild
const prebuild = R('.prebuild');

copy(R('assets'), prebuild);
copy(R('src'), prebuild);
copy(R('favicon.ico'), prebuild);

// Extra assets
if (config.BUILD_COPY) {
  for (const [src, dst] of Object.entries(config.BUILD_COPY)) {
    copy(R(src), R('.prebuild', dst));
  }
}

// If a brand directory exists overwrite assets in .prebuild with
// the overrides from ./brand and generate final build artifacts
// using the content of this directory
if (brand && fs.existsSync('./'+brand)) {
  copyContents(R(brand), prebuild);
}

const dist = R(config.BUILD_DIR);
const distPrefix = R(join(config.BUILD_DIR, config.PREFIX));

// Copy static assets
copy(R('.prebuild','favicon.ico'), dist);
copy(R('.prebuild','assets'), distPrefix);

// (Re)build JavaScript
esbuild({
  debug: DEBUG,
  root: R('.prebuild')
});

// (Re)build CSS
await postcss({
  debug: DEBUG,
  root: R('.prebuild')
});

// (Re)generate static pages
await generate({
  debug: DEBUG,
  root: R('.prebuild')
});
