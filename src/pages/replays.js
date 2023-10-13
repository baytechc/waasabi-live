// Make sure video player is initialized
import * as video from '../js/video-player.js';

import { html, render, nothing } from 'lit-html';
import { until } from 'lit-html/directives/until.js';

import { showContent } from '../js/sidebar.js';

import { updateActiveContent } from '../js/active-content.js'

import { status, JWT } from '../js/auth.js'

const WAASABI_BACKEND = process.env.WAASABI_BACKEND;
const SESSION_URL = process.env.WAASABI_SESSION_URL;


export const replaysButtonHandler = async (e) => {
  const btn = e.target;
  e.preventDefault();

  showContent(tReplays({}));
}

const videoList = {}
const tReplays = (p) => {
  const list =
    window.videoJsReady
    .then(() => fetch(`${WAASABI_BACKEND}/content/replays`, {
      method: 'get',
      headers: {
        'Authorization': 'Bearer '+JWT()
      },
    }))
    .then(r => r.json())
    .then(items => items.map(item => {
      const id = item.event_data.livestream.playback_id;
      videoList[id] = item;
      return tReplayItem(videoList[id])
     }));

  return html`<div class="sidebar-content c-chat">
<h2>Replays</h2>

<p>You will find the aired sessions below,
if you missed them — or enjoyed them so much that
you want to watch them again! And again! And...</p>

${until(list, html`<span>Loading talk recordings...</span>`)}

`};

const tReplayItem = (p) => {
  const title = p.title;
  const duration = fancyTime(p.event_data.livestream.length)

  const idslug = idSlug(p.session.id, p.session.title)
  const linkedTitle = SESSION_URL ? html`<a href="${SESSION_URL.replace('%SLUG%', idslug)}" target="_blank">${title}</a>` : undefined;

  // TODO: show p.date (time recorded)
  return html`
  <h3>${linkedTitle ? linkedTitle : title}</h3>
  <p>${p.session.description} (${duration})</p>
  ${tVideoThumb(p)}
  `;
}

const startReplay = (e) => {
  const btn = e.target;
  const { playbackId } = btn.dataset;

  e.preventDefault();

  const p = videoList[playbackId]
  const vElement = tVideoTag(p);

  render(vElement, document.querySelector('.main__content'));

  if (p.event_data.livestream.type != 'peertube') setTimeout(() => {
    const player = videojs('v'+playbackId, video.playerConfig());
    video.configurePlayer(player);
    player.play();
  }, 10);

  document.getElementById('v'+playbackId).dataset.active=true
  updateActiveContent();
}
const tVideoThumb = (p) => {
  const id = p.event_data.livestream.playback_id;
  const provider = p.event_data.livestream.type;
  const thumbnail = provider == 'peertube'
    ? `/static/thumbnails/${p.video.Thumbnails[0].filename}`
    : `https://image.mux.com/${id}/thumbnail.jpg?time=5`

  return html`<button
    class="replay__thumb"
    data-playback-id="${id}"
    style="background-image:url(${thumbnail});"
    @click=${startReplay}
  ></button>`;
}

const tVideoTag = (p) => {
  const id = p.event_data.livestream.playback_id;
  const provider = p.event_data.livestream.type;
  if (provider == 'peertube') return tVideoTagPeertube(p);

  const poster = `https://image.mux.com/${id}/thumbnail.jpg?time=5`

  return html`<video-js id="v${id}"
  class="ac replay__video active_content video-js vjs-waasabi waasabi-${provider}"
  data-setup=""
  poster="${poster}"
  preload="auto"
  controls
>
<source type="application/x-mpegURL" src="https://stream.mux.com/${id}.m3u8">
<p class="vjs-no-js">
  To view this video please enable JavaScript, and consider upgrading to a
  web browser that
  <a href="https://videojs.com/html5-video-support/" target="_blank"
    >supports HTML5 video</a
  >
</p>
</video-js>
<br>
<br>
`;
}
const tVideoTagPeertube = (p) => {
  const id = p.event_data.livestream.playback_id;
  const provider = p.event_data.livestream.type;
  const poster =  `/static/thumbnails/${p.video.Thumbnails[0].filename}`;

  return html`<iframe
    id="v${id}"
    class="ac replay__video active_content video-js vjs-waasabi waasabi-${provider}"
    width="560"
    height="315"
    sandbox="allow-same-origin allow-scripts allow-popups"
    title="Live"
    src="/videos/embed/$${id}"
    frameborder="0"
    allowfullscreen
  ></iframe>
`;
}

function idSlug(id, label, locale = 'en') {
  let processedLabel = '';
  if (typeof label == 'string' && label != '') {
    processedLabel = label
      .toLocaleLowerCase(locale)
      .replace(/ &+ /g, ' and ')
      .replace(/[\s:./!?#]+/g,' ')
      .replace(/'/g, '')
      .trim();
  }

  return encodeURIComponent(
    [ id, processedLabel ].join(' ').replace(/[ ]+/g,'-')
  )
}

function fancyTime(l) {
  return [
    l >= 3600 ? ( l / 3600)|0 : undefined,
    l >= 60 ? ( l % 3600 / 60)|0 : undefined,
    ( l % 60)|0
  ].map(
    (v,i) => (v !== undefined && i>0 && v<10 ? '0'+v : v)
  ).filter(
    c => c !== undefined
  ).join(':')
}
