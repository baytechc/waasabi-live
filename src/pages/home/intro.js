//import html from '@popeindustries/lit-html-server/index.mjs';
import { html } from 'lit-html';

import { replayButtonHandler as replayBtn } from '../replay.js';
import { chatButtonHandler as chatBtn } from '../chat.js';


export default html`

<h2>Welcome to Berline.rs Live!</h2>

<p>
  Today's <a href="https://berline.rs/2021/03/23/rust-and-tell.html">Rust & Tell</a> starts at 19:00 CET (Central European Time).
  For more info on upcoming and past events, visit the website:

  <br><button class="sbc" @click=${()=>{window.open('https://berline.rs')}}>berline.rs</button>
</p><br>

<p>
  You will be able to watch the live stream right here, as well as re-watch the
  recording any time after, by clicking the "Replays" button:
  
  <br><button class="sbc" @click=${replayBtn}>Replays</button>
</p><br>

<p>
  You can ask questions and chat with folks on our Matrix channel:

  <br><button class="sbc" @click=${()=>{window.open('https://matrix.to/#/!nScYCdqWQUsTkFRJMb:chat.berline.rs')}}>Chat</button>
</p>

`;
