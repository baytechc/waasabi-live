import { html } from 'lit-html';

import { loginButtonHandler } from '../login.js';
import { chatButtonHandler } from '../chat/chat.js';

const login = { open: loginButtonHandler };
const chat = { open: chatButtonHandler };
const tickets = { open() {
  window.open(`https://eurorust.eu/?tito=%2Fevents-matter%2Feurorust-2023%2Fen%2Fregistrations%2Fnew%3Fprefill%3D%257B%257D`)
}}

export default html`

<h2>Welcome!</h2>

<p>
  Use the link in the email you have received to access the live stream
  during the event, and to be able to watch the talk replays.<br>
  You may also click below to log in using your registered email address:

  <br>
  <button class="sbc" @click="${login.open}">Login</button><br>

  If you don't have a ticket yet you can easily purchase one by clicking
  on the link below. You will get access to all talk recordings and the
  remainder of the live stream instantly:
  <br>
  <button class="sbc" @click="${tickets.open}">Tickets</button>
</p>

<p>
  You can ask questions and chat with folks on our Matrix channel:

  <br><button class="sbc" @click=${chat.open}>Chat</button>
</p>

`;
