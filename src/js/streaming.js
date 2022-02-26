const WAASABI_BACKEND = process.env.WAASABI_BACKEND;

import { onSignal } from './live.js';

// TODO: move these to init() via dynamic import()
// allow enabling/disabling via config
import * as streamHls from './stream-hls.js';
import * as streamPeertube from './stream-peertube.js';

import * as activeContent from './active-content.js';


const STREAM_TYPES = {
  hls: streamHls,
  peertube: streamPeertube,
}

// turns hyphenated-things into camelcaseThings
const camel = s => s.replace(/-\w/g, (m)=>m.substr(1).toUpperCase());

async function init() {
  await activeContent.set({
    type: 'idle',
  });

  // Listen to livestream events
  onSignal(sig => handleEvent(sig.data));

  // Bootstrap live stream
  const signals = await fetch(`${WAASABI_BACKEND}/event-manager/client/livestream`).then(r => r.json());

  if (signals?.length > 0) {
    for (const sig of signals) {
      await handleEvent(sig.data);
    }
  }
}

function handleEvent(data) {
  const { type, event } = data;
  console.log('handleEvent:', data);
  if (type == 'livestream') {
    const streamType = data.livestream.type ?? 'hls';

    if (streamType in STREAM_TYPES) {
      const backend = STREAM_TYPES[streamType];
      const streamEvent = camel(event);

      if (streamEvent in backend) {
        return backend[streamEvent](data);
      }
    }
  }

  return false;
}



init();
