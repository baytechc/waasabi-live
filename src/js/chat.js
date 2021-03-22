import { onChatMessage } from './live.js';


async function init() {
  console.log('Waiting for new chat messages...');

  // Listen to livestream events
  onChatMessage(sig => console.log(sig));
}

init();
