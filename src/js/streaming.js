const WAASABI_BACKEND = process.env.WAASABI_BACKEND;

import { onSignal } from './live.js';

// TODO: move these to init() via dynamic import()
// allow enabling/disabling via config
import * as streamHls from './stream-hls.js';
import * as streamPeertube from './stream-peertube.js';

import * as activeContent from './active-content.js';

import { status, JWT } from './auth.js'

const STREAM_TYPES = {
  hls: streamHls,
  peertube: streamPeertube,
}

// turns hyphenated-things into camelcaseThings
const camel = s => s.replace(/-\w/g, (m)=>m.substr(1).toUpperCase());

async function init() {
  // await activeContent.set({
  //   type: 'idle',
  // });

  // Listen to livestream events
  onSignal(sig => handleEvent(
    typeof sig.data === 'object' ? sig.data : JSON.parse(sig.data)
  ))

  // Bootstrap live stream
  const bootstrap = async (lastid = 0) => fetch(
    `${WAASABI_BACKEND}/content/livestream`+(lastid>0?'?lastid='+lastid:''), {
      method: 'get',
      headers: {
        'Authorization': 'Bearer '+JWT()
      }
    }
  ).then(r => r.json());

  const signals = (await bootstrap()) || []
  for (const sig of signals) {
    await handleEvent(sig.data)
  }

  // Poll the backend in case the websocket is borked
  let lastid = Math.max(signals?.map(s => s.id))
  const poll = async () => {
    const pollsig = (await bootstrap(lastid)) || []
    for (const sig of pollsig) {
      await handleEvent(sig.data)
    }
  
    lastid = Math.max(pollsig?.map(s => s.id))
    setTimeout(poll, 5000+Math.random()*5000)
  }
  poll()
}

function handleEvent(data) {
  const { type, event } = data;
  //console.log('handleEvent:', data);

  if (type === 'livestream') {
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
