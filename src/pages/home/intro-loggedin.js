import { html } from 'lit-html';

import { replaysButtonHandler } from '../replays.js';
import { chatButtonHandler } from '../chat/chat.js';

import { status as loggedin } from '../../js/auth.js';

const replays = { open: replaysButtonHandler };
const chat = { open: chatButtonHandler };

function openSchedule(day = 1) {
  window.open(`https://eurorust.eu/schedule/day/${day}/`)
}

console.log('Logged in:', loggedin())

export default html`

<h2>Welcome to the EuroRust 2023 Live Stream</h2>

<p>
  You will be able to watch the live stream right here,
  the stream will start automatically at the scheduled time.
  <br>
  <button class="sbc" @click="${openSchedule.bind(null,1)}">Day 1 Schedule</button>
  <button class="sbc" @click="${openSchedule.bind(null,2)}">Day 2 Schedule</button>
</p>

<p>
  Re-watch recordings of previous streams anytime, by clicking the "Replays" button:
  <br>
  <button class="sbc" @click="${replays.open}">Replays</button>
</p>

<p>
  You can ask questions and chat with folks on our Matrix channel:

  <br><button class="sbc" @click=${chat.open}>Chat</button>

  <br><input type="checkbox" id="showchat" checked>&nbsp;<label for="showchat">Show chat messages</label>
</p>

`;
