// Make sure video player is initialized
import * as video from '../js/video-player.js';

import { html, render, nothing } from 'lit-html';
import { until } from 'lit-html/directives/until.js';

import { showContent } from '../js/sidebar.js';

const WAASABI_BACKEND = process.env.WAASABI_BACKEND;
const SESSION_URL = process.env.WAASABI_SESSION_URL;


export const replaysButtonHandler = async (e) => {
  const btn = e.target;
  e.preventDefault();

  showContent(tReplays({}));
}

const tReplays = (p) => {
  let list = 
    window.videoJsReady
    .then(() => fetch(`${WAASABI_BACKEND}/event-manager/client/replays`))
    .then(r => r.json())
    .then(items => items.map(item => tReplayItem(item)) );

  return html`<div class="sidebar-content c-chat">
<h2>Replays</h2>

<p>You will find the aired sessions below,
if you missed them — or enjoyed them so much that
you want to watch them again! And again! And...</p>

${until(list, html`<span>Loading talk recordings...</span>`)}

`};

const tReplayItem = (p) => {
  const link = SESSION_URL ? SESSION_URL+idSlug(p.session.id,p.session.title) : '';
  const title = link ? html`<a href="${link}">${p.session.title}</a>` : p.session.title;

  // TODO: show p.date (time recorded)
  return html`
  <h4>${title}</h4>
  ${tVideoThumb(p)}
  `;
}

const startReplay = (e) => {
  const btn = e.target;
  const { playbackId } = btn.dataset;

  e.preventDefault();

  const vElement = tVideoTag({ livestream: { playback_id: playbackId }});
  render(vElement, document.querySelector('.main__content'));
  setTimeout(() => {
    const player = videojs('v'+playbackId, video.playerConfig());
    video.configurePlayer(player);
    player.play();
  }, 10);
}
const tVideoThumb = (p) => {
  const id = p.livestream.playback_id;

  return html`<button
    class="replay__thumb"
    data-playback-id="${id}"
    style="background-image:url(https://image.mux.com/${id}/thumbnail.jpg?time=5);"
    @click=${startReplay}
  ></button>`;
}

const tVideoTag = (p) => {
  const id = p.livestream.playback_id;

  return html`<video-js id="v${id}"
  class="replay__video active_content video-js vjs-waasabi"
  data-setup=''
  poster="https://image.mux.com/${id}/thumbnail.jpg?time=5"
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

function idSlug(id, label, locale = 'en') {
  let processedLabel = '';
  if (typeof label == 'string' && label != '') {
    processedLabel = label
      .toLocaleLowerCase(locale)
      .replace(/ &+ /g, ' and ')
      .replace(/[\s:./!?#]+/g,' ')
      .trim();
  }

  return encodeURIComponent(
    [ id, processedLabel ].join(' ').replace(/[ ]+/g,'-')
  )
}




