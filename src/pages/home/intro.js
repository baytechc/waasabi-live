//import html from '@popeindustries/lit-html-server/index.mjs';
import { html } from 'lit-html';

import { replayButtonHandler as replayBtn } from '../replay.js';
import { chatButtonHandler as chatBtn } from '../chat.js';


export default html`

<h2>Welcome to the Waasabi dev stream!</h2>

<p>
  The live stream starts in 6 hours (Thursday, March 1., 18:30 Tallinn/EET).
  For more info on upcoming and past events, check the schedule:

  <br><button class="sbc">Schedule</button>
</p><br>

<p>
  You will be able to watch the live stream right here, as well as re-watch the
  recording any time after, by clicking the "Replays" button:
  
  <br><button class="sbc" @click=${replayBtn}>Replays</button>
</p><br>

<p>
  You can ask questions and chat with folks on the Waasabi development channel
  on Matrix:

  <br><button class="sbc" @click=${chatBtn}>Chat</button>
</p>

`;
