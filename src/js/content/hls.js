import '../video-player.js';

import { html, render } from 'lit-html';


export async function live(options) {
  const { cid, streamUrl } = options;

  await window.videoJsReady;

  // Video element exists?
  let player; 
  try {
    player = videojs(cid);
  }
  catch(e) {
    if (!e.message.includes('ID supplied is not valid')) {
      console.error(e);
    }
  };

  if (player) {
    try {
      player.src(streamUrl);
      player.play();
      // TODO: properly clean the overlay
      player.el().querySelector('.active_content_overlay').remove();
      return player.el();
    }
    catch(e) {
      console.log(e);
    }
    // TODO: mute detection    
  }

  return new Promise(resolve => {
    // Need to create new player
    // TODO: reuse the same code as in "idle()"
    const frag = document.createDocumentFragment();
    render(tVideoTag(options), frag);
    
    const vElement = frag.querySelector('video');

    videojs(vElement, null, function() {
      const player = this;
      const overlay = document.createDocumentFragment();
      render(tVideoOverlay({ contents: '' }), overlay);

      player.el().appendChild(overlay);

      try {
        player.src(streamUrl);
        player.play();
        // TODO: properly clean the overlay
        let ac = player.el().querySelector('.active_content_overlay');
        while (ac && ac.firstChild) ac.firstChild.remove();
      }
      catch(e) {
        console.log(e);
      }

      resolve(player.el());
    });
  });
}

export async function ondemand(options) {}


const tVideoTag = (p = {}) => html`<video
  id="${p.cid}"
  class="streambox__video active_content video-js vjs-waasabi ${p.classes?.join(' ')}"
  data-setup='{"liveui":"true"}'
  poster="${process.env.W_PREFIX}/assets/video-holder.jpg"
  preload="auto"
  controls
  muted
>
</video>`;

const tVideoOverlay = (p = {}) => html`<div class="active_content_overlay">
${p.contents}
</div>`;
