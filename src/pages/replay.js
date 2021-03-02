// Make sure video player is initialized
import * as video from '../js/video-player.js';

import { html, render, nothing } from 'lit-html';
import { until } from 'lit-html/directives/until.js';

import { showContent } from '../js/sidebar.js';

const WAASABI_BACKEND = process.env.WAASABI_BACKEND;


export const replayButtonHandler = async (e) => {
  const btn = e.target;
  e.preventDefault();

  showContent(tReplays({}));
}

const tReplays = (p) => {
  let list = 
    window.videoJsReady
    .then(() => fetch(`${WAASABI_BACKEND}/attendee-pushes?type=stream&_sort=created_at:DESC&_limit=100`))
    .then(r => r.json())
    .then(r => r.filter(item => item.message.event == 'now-on-replay'))
    .then(items => items.map(item => tReplayItem(item.message.data)) );

  return html`<div class="sidebar-content c-chat">
<h2>Replays</h2>

<p>You will find the aired sessions below,
if you missed them — or enjoyed them so much that
you want to watch them again! And again! And...</p>

${until(list, html`<span>Loading talk recordings...</span>`)}

`};

const tReplayItem = (p) => {
  const link = 'https://rustfest.global/session/'+idSlug(p.session.id,p.session.title);
  return html`
  <h4><a href="${link}">${p.session.title}</a></h4>
  ${tVideoTag(p)}
  `;
}

const tVideoTag = (p) => {
  // Initialize player after tag is added to the dom
  setTimeout(() => {
    const player = videojs('v'+p.playback_id, video.playerConfig());
    video.configurePlayer(player);

    // Play video in main stream box
    player.on('play', () => {
      const videobox = document.querySelector('.streambox__player > .streambox__video');
      const playerbox = document.querySelector('#v'+p.playback_id);
      if (playerbox && videobox) {
        playerbox.classList.add('streambox__video');
        videobox.replaceWith(playerbox);
      }
    });
  }, 10);

  return html`<video-js id="v${p.playback_id}"
  class="replay__video video-js"
  data-setup=''
  poster="https://image.mux.com/${p.playback_id}/thumbnail.jpg?time=5"
  preload="auto"
  controls
>
<source type="application/x-mpegURL" src="https://stream.mux.com/${p.playback_id}.m3u8">
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




