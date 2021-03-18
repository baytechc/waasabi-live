import './video-player.js';

import { html, render } from 'lit-html';
import listen from './live.js';

const WAASABI_BACKEND = process.env.WAASABI_BACKEND;

const HANDLED_EVENTS = {
  'livestream.live-now': ({data}) => playStream(data.livestream.playback_id),
  'livestream.replay-available': () => stopStream(),
};

async function init() {
  // Add video to document
  const frag = document.createDocumentFragment();
  render(tVideoTag(), frag);
  document.querySelector('main > .active_content').replaceWith(frag);

  // Wait for JS to load & execute
  await window.videoJsReady;

  // Initialize stream from API data
  await initStream();
  
  // Listen to livestream events
  listen(sig => sig.event in HANDLED_EVENTS ? HANDLED_EVENTS[sig.event](sig) : null);
}

async function initStream() {
  const signals = await fetch(`${WAASABI_BACKEND}/event-manager/client/livestream`).then(r => r.json());

  if (!signals) return;
  const sig = signals[0];

  // No stream is live currently
  if (!sig || sig.event == 'livestream.ended') return;

  // There is an ongoing livestream, show it!
  if (sig.event == 'livestream.live-now') {
    playStream(sig.data.livestream.playback_id);
  }
}

function playStream(playback_id) {
  const player = videojs('livestream');
  const stream = `https://stream.mux.com/${playback_id}.m3u8`;

  try {
    player.src(stream);
    player.play();
  }
  catch(e) {
    console.log(e);
    alert('The stream is live but you need to press play!');
  }
}

function stopStream() {
  const player = videojs('livestream');

  try {
    player.reset();
    player.poster('/assets/rustfest_comingsoon.svg');
  }
  catch(e) {
    console.log(e);
    alert('The stream is live but you need to press play!');
  }
}

const tVideoTag = (p) => html`<video
  id="livestream"
  class="streambox__video active_content video-js vjs-waasabi"
  data-setup='{"liveui":"true"}'
  poster="/assets/video-holder.jpg"
  preload="auto"
  controls
  muted
>
<p class="vjs-no-js">
  To view this video please enable JavaScript, and consider upgrading to a
  web browser that
  <a href="https://videojs.com/html5-video-support/" target="_blank"
    >supports HTML5 video</a
  >
</p>
</video>`;


init();
