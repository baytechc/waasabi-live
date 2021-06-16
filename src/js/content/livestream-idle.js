import { html, render } from 'lit-html';


export default async () => {
  return new Promise(resolve => {
    const frag = document.createDocumentFragment();
    render(tVideoTag(), frag);
    
    const vElement = frag.querySelector('video');

    videojs(vElement, null, function() {
      const overlay = document.createDocumentFragment();
      render(tVideoOverlay({ contents: html`
        <p class="notification">Livestream is offline, check the Schedule for the next event!</p>`
      }), overlay);

      this.el().appendChild(overlay);

      resolve(this);
    });
  });
}

// TODO: move all video tags in a central class (streaming, replays, etc.)
const tVideoTag = (p) => html`<video
  id="livestream"
  class="streambox__video active_content video-js vjs-waasabi nostream"
  data-setup='{"liveui":"true"}'
  poster="/assets/video-holder.jpg"
  preload="auto"
  controls
  muted
>
<p class="vjs-no-js">
  To view this video please enable JavaScript, and consider upgrading to a
  web browser that
  <a href="https://videojs.com/html5-video-support/" target="_blank"
    >supports HTML5 video</a
  >
</p>
</video>`;

const tVideoOverlay = (p) => html`<div class="active_content_overlay">
${p.contents}
</div>`