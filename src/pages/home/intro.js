import { html } from 'lit-html';

import { replaysButtonHandler } from '../replays.js';
import { chatButtonHandler } from '../chat/chat.js';

const replays = { open: replaysButtonHandler };
const chat = { open: chatButtonHandler };

export default html`

<h2>Welcome!</h2>

<p>
  You will be able to watch the live stream right here, the stream will start automatically at the scheduled time.<br>

  <br>
  <button class="sbc" @click="">Livestream</button>
  <button class="sbc" @click="">Schedule</button>

</p><p>
  Re-watch recordings of previous streams anytime, by clicking the "Replays" button:
  
  <br><button class="sbc" @click=${replays.open}>Replays</button>
</p><br>

<p>
  You can ask questions and chat with folks on our Matrix channel:

  <br><button class="sbc" @click=${chat.open}>Chat</button>

  <br><input type="checkbox" id="showchat" checked>&nbsp;<label for="showchat">Show chat messages</label>
</p>

`;
