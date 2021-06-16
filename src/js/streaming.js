import './video-player.js';

import { onSignal } from './live.js';
import * as activeContent from './active-content.js'

const WAASABI_BACKEND = process.env.WAASABI_BACKEND;

const HANDLED_EVENTS = {
  'livestream.live-now': ({data}) => playStream(data.livestream.playback_id),
  'livestream.replay-available': () => stopStream(),
};

async function init() {
  // Wait for JS to load & execute
  await window.videoJsReady;
  //videojs.log.level('all');

  // Initialize stream from API data
  await initStream();
  
  // Listen to livestream events
  onSignal(sig => sig.event in HANDLED_EVENTS ? HANDLED_EVENTS[sig.event](sig) : null);
}

async function initStream() {
  const signals = await fetch(`${WAASABI_BACKEND}/event-manager/client/livestream`).then(r => r.json());

  if (!signals) return;
  const sig = signals[0];

  // No stream is live currently
  if (!sig || sig.event == 'livestream.ended') {
    await activeContent.set('livestream.idle');
    return;
  }


  // There is an ongoing livestream, show it!
  if (sig.event == 'livestream.live-now') {
    await playStream(sig.data.livestream.playback_id);
  }
}

async function playStream(playback_id) {
  const streamUrl = `https://stream.mux.com/${playback_id}.m3u8`;

  await activeContent.set('livestream.live', { streamUrl });
}

function stopStream() {
  const player = videojs('livestream');

  try {
    player.on(player.el(), 'ended', (e) => {
      console.log('Livestream ended.');
      activeContent.set('livestream.idle');
    });

    //player.reset();
    //player.poster();
    //TODO: on player buffer underrun => idle (try to keep the unmuted player around)
  }
  catch(e) {
    console.log(e);
  }
}



init();
