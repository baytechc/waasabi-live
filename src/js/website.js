// Things that auto-init
import './auth.js';

import './button-events.js';

//import './experiences.js';

import '../pages/home.js';

if (process.env.WAASABI_CHAT_ENABLED) {
  import('./chat.js');
}

//import('./live.js'); not needed?
import('./streaming.js');
/* TODO:
import('./webmonetization.js');
import('./immersive.js');
*/
