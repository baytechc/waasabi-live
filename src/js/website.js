// Things that auto-init
import './auth.js';

import './button-events.js';

//import './experiences.js';

import '../pages/home.js';

if (process.env.WAASABI_CHAT_ENABLED) {
  import('./matrix.js');
}

import('./live.js');
import('./streaming.js');
import('./webmonetization.js');
import('./immersive.js');
