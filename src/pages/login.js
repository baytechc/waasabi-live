import { html, render, nothing } from 'lit-html';

import { showing, showContent } from '../js/sidebar.js';

import { loginWithTicket } from '../js/auth.js';
import { showHome } from './home.js';

const WAASABI_BACKEND = process.env.WAASABI_BACKEND;

export const loginButtonHandler = async (e) => {
  const btn = e.target;
  e.preventDefault();

  showContent(tLoginStart({}));
}

async function loginHandler(e) {
  const btn = e.target;
  e.preventDefault();

  btn.disabled = true
  const email = document.querySelector('input[name=email]').value
  const reference = document.querySelector('input[name=reference]').value

  await loginWithTicket(email, reference)

  showHome()
}

const videoList = {}
const tLoginStart = (p) => {
  return html`<div class="sidebar-content c-login">
<h2>Login</h2>

<fieldset class="fs-login">

<p>Please log in with your email address that you have used to purchase a ticket.</p>

<h3><label for="loginemail">E-mail address</label></h3>

<input type="email" id="loginemail" placeholder="me@mymail.com"
  name="email" required>

<h3><label for="loginref">Ticket reference</label></h3>

<p>The ticket reference is the reference code of the Tito ticket purchase,
it usually consists of uppercase letters followed by a dash and a number</p> 

<input type="email" id="loginref" placeholder="ABCD-N"
  name="reference" required>

<button class="sbc inline login" @click=${loginHandler}>Authenticate</button>
</fieldset>

`};
