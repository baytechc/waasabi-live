import { html, render, nothing } from 'lit-html';

import { showing, showContent } from '../js/sidebar.js';

const WAASABI_BACKEND = process.env.WAASABI_BACKEND;

export const loginButtonHandler = async (e) => {
  const btn = e.target;
  e.preventDefault();

  showContent(tLoginStart({}));
}

function loginHandler() {
  console.log('logging in in a bit...')
}

const videoList = {}
const tLoginStart = (p) => {
  return html`<div class="sidebar-content c-login">
<h2>Login</h2>

<fieldset class="fs-login">

<p>Please log in with your email address that you have used to purchase a ticket.</p>

<h3>E-mail address:</h3>

<input type="email" placeholder="me@mymail.com"
  name="email" required>

<p>We will send you a numeric code to confirmation the ownership and log you in</p>

<button class="sbc inline" @click=${loginHandler}>Receive Code</button>
</fieldset>

`};
