//import html from '@popeindustries/lit-html-server/index.mjs';
import { html } from 'lit-html';

import { replayButtonHandler } from '../replay.js';
import { chatButtonHandler as chatBtn } from '../chat.js';

const replays = { open: replayButtonHandler }

export default html`

<h2>Welcome!</h2>

<p>
  You will be able to watch the live stream right here, the stream will start automatically at the scheduled time.<br>

</p><p>
  Re-watch recordings of previous streams anytime, by clicking the "Replays" button:
  
  <br><button class="sbc" @click=${replays.open}>Replays</button>
</p><br>

<p>
  You can ask questions and chat with folks on our Matrix channel:

  <br><button class="sbc" @click=${()=>{window.open('https://matrix.to/')}}>Chat</button>

  <br><input type="checkbox" id="showchat" checked>&nbsp;<label for="showchat">Show chat messages</label>
</p>

`;
