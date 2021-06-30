const WAASABI_BACKEND = process.env.WAASABI_BACKEND;

import marked from 'esmarked';

import { status as loggedin, JWT, getProfile } from '../js/auth.js';

import { html, render } from 'lit-html';
import {unsafeHTML} from 'lit-html/directives/unsafe-html.js';
import { until } from 'lit-html/directives/until.js';

import { showContent } from '../js/sidebar.js';


export const freebiesButtonHandler = (e) => {
  const btn = e.target;
  e.preventDefault();

  let asyncFreebies = getFreebies();

  showContent(tFreebiesList(asyncFreebies));
}

async function getFreebies() {
  // Resolve in parallel
  const [ freebie, freebie_items] = await Promise.all([
    // Get the list of active freebies
    getFreebies(),
    // Update the profile info and fetch attendee info for list of claimed freebies
    getProfile().then( p => p.data.attendee.freebie_items )
  ]);

  const claimed = freebie_items.reduce(
    (obj, i) => { obj[i.type] = i; return obj }
    , {}
  );

  freebies.data.forEach(f => f.claimed = claimed[f.id]);

  return freebies;
}

async function getFreebies() {
  const res = await fetch(WAASABI_BACKEND+'/freebies/list', {
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

async function claimFreebie(e) {
  const btn = e.target;
  e.preventDefault();
  btn.disabled = true;

  const freebieType = btn.value;
  console.log('Claiming', freebieType);
  
  const res = await fetch(WAASABI_BACKEND+'/freebies/claim', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+JWT()
    },
    body: JSON.stringify({ id: freebieType })
  });

  const { ok, status } = res;
  if (!ok) {
    alert(`Couldn\'t claim freebie: network error`);
    return { ok, status, error: await res.text() };
  }

  // Returns the changed profile
  let attendee = await res.json();
  // Get the freebie list
  const freebies = await getFreebies();

  // Re-render freebies
  showFreebies(freebies, attendee);
  // Update the profile data in Auth in the bg
  getProfile(); // note: no await
}


export const tFreebiesList = (p) => {
  let freebies = p.then(res => {
    if (res.ok && res.data.length) {
      return tFreebiesShowList(res.data);
    } else {
      return tNoFreebies(p);
    }
  });

  return html`
<div class="sidebar-content c-chat">
<h2>RustFest freebies</h2>

<p>Below you will find all the discounts, free trials, freebies and other
schwag (digital or otherwise) that we have received from our sponsors and
partners to distribute to our attendees.</p>

<p>Some of the freebies are limited, or expire, so be quick about
<em>claiming</em> these if you want to make sure you get these!</p>

${ until(freebies, html`<p>Loading list of freebies...</p>`) }

<p><em>Check back here occasionally during (or even after) the conference
as a few more trinkets might become available as we talks with our partners
progress.</em></p>

</div>`}

export const tFreebiesShowList = (items) => {
  return html`
<div class="freebies__list">
${items.map(i => tFreebie(i))}
</div>
  `}

export const tFreebie = (p) => {
  return html`
<div class="freebie">
<div class="freebie__header">
  <h3 class="freebie__header__title">${p.name}</h3>
  <span class="freebie__header__link">by <a href="${p.sponsor_link}">${p.sponsor}</a></span>
  <img src="${WAASABI_BACKEND+p.sponsor_logo}" alt=${p.sponsor}>
</div>
<p class="freebie__desc">${unsafeHTML(marked(p.description))}</p>
${tClaim(p)}
</div>
  `}

export const tClaim = (p) => {
  const claimed = p.claimed;
  if (claimed) return tClaimed(p);
  return html`
<button class="sbc" value=${p.id} @click=${claimFreebie}>Claim!</button>
  `}

export const tClaimed = (p) => {
  const claimed = p.claimed[p.type];
  if (claimed) return tClaimed(p);
  return html`
<strong class="freebie__claimed">Already claimed!</strong>
<div class="form-message success">
${p.claimed.content}
</div>
<p class="freebie__desc"><em>${unsafeHTML(marked(p.instructions))}</em></p>
    `}
  

export const tNoFreebies = (p) => {
  return html`
<div class="form-message">
Unfortunately there are currently no freebies available.
</div>
`}
