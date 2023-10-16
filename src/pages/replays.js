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

const videoList = new Map()
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
      const id = item.event_data.livestream.playback_id
      videoList.set(id, item)
      return tReplayItem(item)
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

  const p = videoList.get(playbackId)
  const vElement = tVideoTag(p);

  render(vElement, document.querySelector('.main__content'));

  if (p.event_data.livestream.type != 'peertube') {
    const player = videojs('replays_player', video.playerConfig());
    console.log(player)

    if (player) {
      video.configurePlayer(player);

      const poster = posterForId(playbackId)
      const src = srcForId(playbackId)
      const media = {
        poster,
        src: {
          type: 'application/x-mpegURL',
          src
        }
      }

      player.loadMedia(media, () => {
        console.log('Media loaded: ', media)
        player.play()
          .then(r => console.log('Playback started', r))
          .catch(e => console.error('Failed to start playing', e))
      })
      player.load()

      const el = player.el()
      if (el) {
        el.dataset.vid = vidForId(playbackId)
        el.dataset.active = true
      } else {
        console.log('Video element not found')
      }
    } else {
      console.log('Player not ready')
    }
  }

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

  const poster = posterForId(id)
  const src = srcForId(id)

  return html`<video-js id="replays_player"
  class="ac replay__video active_content video-js vjs-waasabi waasabi-${provider}"
  data-setup=""
  preload="auto"
  controls
  autoplay
>
</video-js>`;
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

function srcForId(id) {
  return `https://stream.mux.com/${id}.m3u8`
}

function posterForId(id) {
  return `https://image.mux.com/${id}/thumbnail.jpg?time=5`
}

function vidForId(id) {
  return 'v'+id
}
