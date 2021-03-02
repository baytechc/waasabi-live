const WAASABI_BACKEND = process.env.WAASABI_BACKEND;

import { show as showPopup } from './popup.js'
import { showHome } from '../pages/home.js';



// Currently authenticated user information
let AUTH;

export function status() { return AUTH }
export function JWT() { return AUTH ? AUTH.jwt : undefined }

async function initAuthState() {
  // Check for existing login key saved in storage
  await existingLogin();

  // Check for auth key in URL and use it to log in
  if (locationToken() !== undefined) {
    await loginWithToken(locationToken());

    window.location.hash = '';
  }

  // If one of those methods above worked than we are logged in!
  if (status()) loggedin();
}

function locationToken() {
  if (window.location.href.includes('#auth=')) {
    const token = window.location.hash.match(/^#auth=([a-z0-9]+)/) || [];
    return token[1];
  }

  return;
}

export async function loginButtonHandler(e) {
  const btn = e.target;
  e.preventDefault();

  alert('Please log in using the link we sent you in email!');
}

export async function loginWithToken(token) {
  return await login({ token });
}

export async function loginWithPin(email, pin) {
  email = String(email).toLowerCase();
  pin = parseInt(String(pin).replace(/[\s-]/g,''), 10);

  return await login({ email, pin });
}

export async function existingLogin() {
  const savedauth = window.localStorage.getItem('AUTH');
  if (!savedauth) return;

  try {
    // Parse
    const authJson = JSON.parse(savedauth);

    // Make sure it hasn't expired yet
    const JWTdata = JSON.parse(atob(authJson.jwt.split('.')[1]));
    if (!(Date.now()/1000 < JWTdata.exp)) {
      console.log('Saved auth expired.');
      return false;
    }

    // Commit restored auth object
    return setAuth(authJson);
  }
  catch(e) {
    console.log(e);
  }
}

export async function login(authParams) {
  const res = await fetch(WAASABI_BACKEND+'/attendees/login', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(authParams)
  });
  
  if (!res.ok) return;

  const auth = await res.json();

  // Update current auth data
  return setAuth(auth);
}

// Re-fetch AUTH profile data
export async function getProfile() {
  const res = await fetch(WAASABI_BACKEND+'/attendees/profile', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer '+JWT()
    }
  });

  const { ok, status } = res;
  if (ok) {
    data = await res.json();

    setAuth(Object.assign(data, { jwt: JWT() }));

    return { ok, status, data };
  }

  return { ok, status, error: await res.text() };
}

export async function updateProfile(data) {
  const res = await fetch(WAASABI_BACKEND+'/attendees/profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+JWT()
    },
    body: JSON.stringify(data)
  });

  const { ok, status } = res;
  if (ok) {
    data = await res.json();

    setAuth(Object.assign(data, { jwt: JWT() }));

    return { ok, status, data };
  }

  return { ok, status, error: await res.text() };
}

function setAuth(auth) {
  // Make immutable
  Object.freeze(auth.attendee);
  Object.freeze(auth);

  // Make auth status accessible for other modules
  AUTH = auth;

  // Store AUTH result in persistent storage
  window.localStorage.setItem('AUTH', JSON.stringify(AUTH));
  window.localStorage.setItem('WAASABI_JWT', AUTH.jwt);

  return AUTH;
}

function loggedin() {
  showPopup('You are now logged in!', { timeout: 5 });
  showHome();
}


// Initialize authentication state
initAuthState();