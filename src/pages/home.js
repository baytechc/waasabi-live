import { html, render } from 'lit-html';

import C_HOME_INTRO from './home/intro.js';


import { status as loggedin, loginButtonHandler } from '../js/auth.js';

import { showing, showContent } from '../js/sidebar.js';

//import { chatButtonHandler } from './chat.js';
//import { freebiesButtonHandler } from './freebies.js';
//import { replayButtonHandler } from './replays.js';


const BUTTON_SELECTOR='[data-action="go-home"]';
const controlSidebar = document.querySelector(BUTTON_SELECTOR);
if (controlSidebar) {
  controlSidebar.addEventListener('click', goHomeButtonHandler);
}

const signupBtn = (e) => {
  e.preventDefault();
  window.open('https://rustfest.global/information/tickets/','_blank')
}

export const tHomepageIntro = (p) => {
  if (loggedin()) return tHomepageIntroAuthed(p);

  return html`
<div class="sidebar-content c-homepage-intro">
${C_HOME_INTRO}
</div>`;
}

export const tHomepageIntroAuthed = (p) => {
  const u = loggedin().attendee;
  return html`
<div class="sidebar-content c-homepage-intro authed">
${C_HOME_INTRO_LOGGEDIN}
</div>`;
}

export function goHomeButton(p) {
  const frag = document.createDocumentFragment();

  render(html`
<button class="sbc" @click=${goHomeButtonHandler}>&lt; back</button>
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
