const EXPERIENCES_ENABLED = false;
const EXPERIENCES = [
  {
    name: 'MPS',
    title: 'MPS - MultiPlayer Snake by Stefan Schindler',
    url: 'https://mps.estada.ch/play',
    icon: 'https://mps.estada.ch/static/favicon.svg'
  },
  {
    name: 'Embark Studios',
    title: 'Learn more about Embark Studios!',
    url: '/ex/embark/index.html',
    icon: 'https://backend.rustfest.global/uploads/embark_66839df9a9.png'
  },
  {
    name: 'Parity',
    title: 'Parity - a staunch supporter of RustFest since Day One!',
    url: '/ex/parity/index.html',
    icon: 'https://backend.rustfest.global/uploads/logo_parity_light_ff594c2c02.png'
  },
  {
    name: 'Web Monetization',
    title: 'Learn how to support our speakers & performers with Web Monetization!',
    url: 'https://rustfest.global/information/about-web-monetization/',
    icon: 'https://webmonetization.org/img/wm-icon.svg'
  },
  {
    name: 'Captions',
    title: 'All English talks are live-captioned, click to open the captions!',
    url: 'https://rediger.net/rfg-caption',
    icon: '/assets/hoh.png'
  },
  {
    name: 'Sketchnotes',
    title: 'Live sketchnoting at RustFest Global by Malweene & Carlo Gilmar!',
    url: '/ex/sketchnotes/index.html',
    icon: '/assets/sketch.png'
  }
];

const EX_TRIGGER_SELECTOR = '.experience__triggers';

import { html, render } from 'lit-html';

import { showEmbed, clearContents } from './sidebar.js';



function init() {
  let exs = EXPERIENCES;

  const triggers = document.querySelector(EX_TRIGGER_SELECTOR);
  if (!triggers) {
    return console.log('Failed to initialize Experiences');
  }

  // Customize which experiences are enabled
  if (EXPERIENCES_ENABLED) {
    // Can be a string (comma-separated list of numbers)
    exs = EXPERIENCES_ENABLED.split(',').map(i => EXPERIENCES[i-1]);
  }

  // Render the experience triggers
  render(exs.map( (p, idx) => tExperienceTriggerBtn(p, idx)), triggers);

  // Initialize click handlers
  triggers.addEventListener('click', e => {
    let el = e.target;
    if (el.tagName !== 'BUTTON') return;

    // Show experience assigned to this button
    let src = el.dataset.ex;
    if (!src) {
      clearContents();
      return;
    }

    //
    document.documentElement.dataset.exnow=el.dataset.idx;

    // Toggle content on/off
    showEmbed(src);
  });
}

const tExperienceTriggerBtn = (p, idx) => html`
<button data-ex="${p.url}" data-idx="${idx}" class="experience__triggers__b">
<img src="${p.icon}"
  alt="${p.name}"
  title="${p.title}">
<span>${p.name}</span>
</button>
`;


init();

