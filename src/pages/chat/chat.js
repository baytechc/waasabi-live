const WAASABI_BACKEND = process.env.WAASABI_BACKEND;

const OWNSERVER = (process.env.WAASABI_MATRIX_SERVER || process.env.WAASABI_MATRIX_CLIENT_URL);
const SERVER = process.env.WAASABI_MATRIX_SERVER || 'matrix.org';
const CLIENTURL = process.env.WAASABI_MATRIX_CLIENT_URL || 'https://app.element.io/';
const APIURL = process.env.WAASABI_MATRIX_API_URL || 'https://matrix.org';

const ROOM_GROUPS = [ 'Staff', 'Main Conference', 'Talk Rooms', 'Project Rooms', 'Sponsors', 'Other', 'Pre/Post-Events' ];

import { status as loggedin, JWT, getProfile } from '../../js/auth.js';

import { html, render, nothing } from 'lit-html';
import { until } from 'lit-html/directives/until.js';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import marked from 'esmarked';

import { showContent } from '../../js/sidebar.js';

import { collectInputs } from '../../js/forms.js';
import { updateViaForm as updateProfile } from '../profile.js';


export const chatButtonHandler = async (e) => {
  const btn = e.target;
  e.preventDefault();

  showContent(tChatSetup({}));
}

const ownAccountBtn = async (e) => {
  const btn = e.target;
  e.preventDefault();
  btn.disabled = true;

  const fieldset = document.querySelector('.fs-own-account');
  
  let res;
  try {
    res = await updateProfile(fieldset);
  }
  catch (e) {
    console.log(e);
    
    // Form error
    if (e.type = 'invalid') {
      btn.disabled = false;
      return alert(e.message);
    }
  }

  if (res.ok) {
    let msg = document.createElement('div');
    msg.className='form-message success';
    msg.textContent = `Your information has been updated, keep an eye out for the invitation!`;
    fieldset.replaceWith(msg);
    document.querySelector('.fs-new-account').remove()
  }
  // TODO: error handling?
}

const registerAccountBtn = async (e) => {
  const btn = e.target;
  e.preventDefault();
  btn.disabled = true;

  const fieldset = document.querySelector('.fs-new-account');

  let fdata;
  try {
    fdata = collectInputs( fieldset, [
      'username', 'password', 'password2', 'display_name'
    ] );
  }
  catch (e) {
    // Form error
    if (e.type = 'invalid') {
      btn.disabled = false;
      return alert(e.message);
    }
  }

  if (fdata['password'] != fdata['password2']) {
    btn.disabled = false;
    return alert('Passwords do not match!');
  }

  if (!fdata['username'] || !fdata['password'] || !fdata['password2']) {
    btn.disabled = false;
    return alert('Username/password are required fields!');
  }

  // Register
  const regdata = {
    username: fdata.username,
    password: fdata.password,
    inhibit_login: true,
  };
  const r1 = await matrixApiReq('client/r0/register', regdata);

  // Server comes back with a 401 and a session id
  // One of the flows should be 'm.login.dummy'
  // We use the session id to re-attempt that flow
  if (r1.status === 401) {
    const { session, flows } = await r1.json();

    const auth = {
      session,
      type: 'm.login.dummy'
    }
    regdata.auth = auth;
    console.log(regdata);

    const r2 = await matrixApiReq('client/r0/register', regdata);

    // Registration successful!
    if (r2.status === 200) {
      const { user_id } = await r2.json();

      // Update hidden input with chat ID and send updated profile data
      fieldset.querySelector('input[name=chat_id]').value = user_id;

      try {
        res = await updateProfile(fieldset);
      }
      catch (e) {
        console.log(e);
      }

      // Show result
      let msg = document.createElement('div');
      msg.className='form-message success';
      render(html`
        ${user_id} is yours!<br>
        We will send you an invitation to the conference chat,
        and you can go to
        <a href="https://rustch.at/" target="_blank">
        RustCh.at</a>
        or use the various apps to log in!
      `, msg);
      fieldset.replaceWith(msg);
      document.querySelector('.fs-own-account').remove();
      return;
    }
  }

  // Something went wrong, let's try to recover
  try {
    const resp = await r1.json();

    // Recoverable errors (username in use, invalid characters etc.)
    const errors = [ 'M_USER_IN_USE', 'M_INVALID_USERNAME' ];
    if (r1.status === 400 && errors.includes(resp.errcode)) {
      btn.disabled = false;
      return alert('Matrix tells us: '+resp.error);
    }
  }
  catch(e) {
    console.log(e);
  }

  // Registration failed, ask them to try on rustch.at directly
  let msg;
  msg = document.createElement('div');
  msg.className='form-message error';
  render(html`
    Uh-oh!<br>
    We couldn't create your account —
    maybe try signing up on
    <a href="https://rustch.at/" target="_blank">
    RustCh.at directly?</a>`, msg);
  fieldset.replaceWith(msg);
  document.querySelector('.fs-own-account').remove();
}

async function matrixApiReq(url, data) {
  return fetch(APIURL+'/_matrix/'+url, {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    method: "POST",
  });
}

export const tChatSetup = (p) => {
  return html`
<div class="sidebar-content c-chat">
<h2>${process.env.W_TITLE || 'Waasabi'} Chat</h2>

<p>This event uses <a href="" target="_blank">Matrix</a>,
a federated open chat service for text chat.

You are welcome to use your existing account from any server on
the Matrix network, or ${OWNSERVER?'our own':'the'} server at
<a href="${CLIENTURL}" target="_blank">${SERVER}</a>.

${ loggedin()?.attendee.chat_id ? tChatSetupComplete(p) : tChatSetupPending(p) }

<p><em>
  <a href="${process.env.WAASABI_CHAT_INFO}" target="_blank">
    Learn more about the chat here.</a></em></p>

</div>`};

export const tChatSetupPending = (p) => {
  return html`
<fieldset class="fs-own-account">

<p>After you have given us your Matrix username you will be automatically
invited to the conference chat!</p>

<h3>If you already have a Matrix account:</h3>

<input type="text" placeholder="E.g.: @ferris:matrix.org"
  name="chat_id" required>

<button class="sbc inline" @click=${ownAccountBtn}>That's me!</button>
</fieldset>


<fieldset class="fs-new-account">

<h3>…or create a new Matrix account</h3>

<p>Don't have a Matrix account? Don't worry, you can register
one on RustCh.at with a few clicks just below!<br>
The RustFest team has committed to keeping the RustCh.at
server running, so you can use your account in the future
to join any other room on other servers, too!</p>

<p>First, choose a username. <em>Your username can contain numbers, alphabetical characters,
dashes and underscores but no spaces or accented letters please!<br>
If you choose e.g. “<code>laura</code>”, your full Matrix
username will be <code>@laura:rustch.at</code>. Your username
is used for logging in, people will see your <em>display name</em> chosen below.</p>

<input name="username" type="text" placeholder="username" required>

<p>Now, choose a password.</p>

<input name="password" type="password" placeholder="password" required>
<input name="password2" type="password" placeholder="confirm the password" required>

<p><em>Finally, choose the display name that other people will see. This can be the same as your username,
but can also be any other name you go by (you can change this later):</em></p>

<input name="name" type="text" placeholder="display name">

<input type="hidden" name="chat_id">
<button class="sbc" @click=${registerAccountBtn}>Sign up</button>
</fieldset>
`};

export const tChatSetupComplete = (p) => {
  return html`
<div class="form-message">
  Your registered Matrix account:<br>
  <code>${loggedin().attendee.chat_id}</code>
</div>

<p>Our bot has invited you to the main chat, but we have
many other rooms for attendees (you could even create yours and have
it listed here!). You can find more details
<a href="https://rustfest.global/information/how-to-chat/">
in the chat guide</a>.</p>

${tChatroomsList(p)}

`};


async function getJoinableRooms() {
  const res = await fetch(WAASABI_BACKEND+'/chatrooms/joinable', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer '+JWT()
    }
  });

  let data;
  const { ok, status } = res;
  if (ok) {
    data = await res.json();

    return { ok, status, data };
  }

  return { ok, status, error: await res.text(), data: [] };
}

async function joinChatroom(e) {
  const btn = e.target;
  e.preventDefault();
  btn.disabled = true;

  const room_id = btn.value;
  console.log('Joining ', room_id);
  
  const res = await fetch(WAASABI_BACKEND+'/chatrooms/invite', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+JWT()
    },
    body: JSON.stringify({ room_id })
  });

  let { ok, status } = res;
  if (!ok) {
    alert(`Couldn\'t invite to room: network error`);
    return { ok, status, error: await res.text() };
  }

  let response = await res.json();

  let frag = document.createDocumentFragment();
  render(html`<div class="chatroom__invited">${
    response.status == 'ok' ? 'Invite sent!' : 'Invite failed! (already joined?)'
  }</div>`, frag);
  btn.replaceWith(frag);
}


export const tChatroomsList = (p) => {
  const roomData = getJoinableRooms().then(res => {
    return tChatroomsShowList(res.data);
  });

  return html`
<h2>RustFest chatrooms</h2>

<p>Below you will find all the other chatrooms you can join.
Most of these rooms are not open to the outside world, so
you will need to click <em>Join</em> below to receive
an invite.</p>

${until(roomData, html`<span>Loading room list...</span>`)}

`};

export const tChatroomsShowList = (items) => {
  const expandGroup = (g) => {
    if (items[g] && items[g].length > 0) {
      return tChatgroup(g, items[g])
    }
    return nothing;
  }

  return html`
<div class="chatrooms__list">
${ROOM_GROUPS.map(expandGroup)}
</div>
`};

export const tChatgroup = (title, items) => {
  console.log(title, items);
  return html`
<div class="chatgroup">
  <h4 class="chatgroup__title">${title}</h3>
${items.map(i => tChatroom(i))}
</div>
`};
  

export const tChatroom = (p) => {
  return html`
<div class="chatroom">
<h4 class="chatroom__title">${p.name}</h3>
<p class="chatroom__desc">${unsafeHTML(marked(p.topic||''))}</p>
${tJoin(p)}
</div>
  `}

export const tJoin = (p) => {
  const joined = p.joined;
  if (joined) return tJoined(p);
  return html`
<button class="sbc" value=${p.room_id} @click=${joinChatroom}>Join!</button>
  `}

export const tJoined = (p) => {
  const joined = p.joined[p.type];
  if (joined) return tJoined(p);
  return html`
<strong class="chatroom__joined">Already joined!</strong>
<div class="form-message success">
${p.joined.content}
</div>
    `}
