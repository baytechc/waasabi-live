import { html, render } from 'lit-html';

import { status as loggedin, loginButtonHandler } from '../auth.js';
import { chatButtonHandler } from './chat.js';

import { showing, showContent } from '../sidebar.js';
import { freebiesButtonHandler } from './freebies.js';

import { replayButtonHandler } from './replay.js';

const CHAT_LINK = process.env.WAASABI_CHAT_URL;


const BUTTON_SELECTOR='[data-action="go-home"]';
const controlSidebar = document.querySelector(BUTTON_SELECTOR);
if (controlSidebar) {
  controlSidebar.addEventListener('click', goHomeButtonHandler);
}

const signupBtn = (e) => {
  e.preventDefault();
  window.open('https://rustfest.global/information/tickets/','_blank')
}

const chatBtn = (e) => {
  e.preventDefault();
  window.open(CHAT_LINK,'_blank')
}

export const tHomepageIntro = (p) => {
  if (loggedin()) return tHomepageIntroAuthed(p);

  return html`
<div class="sidebar-content c-homepage-intro">
<h2>Welcome to the Rust Hungary meetup</h2>

<p>The live stream starts on Thursday, February 4, 18:30 CET.</p>

<button class="sbc">Schedule</button>

<br>
<p>You will be able to watch the live stream right here, as well as re-watch the
  recording any time after, by clicking the "Replays" button below.</p>

<button class="sbc" @click=${replayButtonHandler}>Replays</button>

<br>
<p>You will be able to ask questions and chat with the other meetup attendees
at the Rust Hungary meetup Matrix channel on RustCh.at:</p>

<button class="sbc" @click=${chatBtn}>Chat</button>
`;
}

export const tHomepageIntroAuthed = (p) => {
  const u = loggedin().attendee;
  return html`
<div class="sidebar-content c-homepage-intro authed">
<h2>Welcome to the RustFest Global Event Experience, powered by Waasabi.</h2>

<p>The conference will happen on November 7, starting at
1:00 AM UTC. As an access pass holder you will be able to
watch in high definition either live or anytime after for
three months.<br>
In the meanwhile you can join the chat, get your hands on
some freebies and we are looking forward to havinging you
at RustFest Global this Saturday.</p>

<h3>Hello ${u.name}</h3>

<button @click=${chatButtonHandler}>Chat</button>
<button @click=${freebiesButtonHandler}>Freebies</button>
<button disabled>Replays</button>
<em>*All talks will be available on-demand right after they were streamed live.
<a href="https://rustfest.global/information/how-to-watch/#replays">Learn more.</a></em>

</div>`;
}

export function goHomeButton(p) {
  const frag = document.createDocumentFragment();

  render(html`
<button @click=${goHomeButtonHandler}>&lt; back</button>
  `, frag);

return frag;
}

export function goHomeButtonHandler(e) {
  e.preventDefault();
  showHome();
}

export function showHome() {
  showContent(tHomepageIntro({}), true, false);
}

// Render intro into sidebar content and open it!
setTimeout(
  () => {
    if (!showing()) showHome()
  }
, 10);
