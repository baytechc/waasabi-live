import { html, render } from 'lit-html';


export default async (options) => {
  const { streamUrl } = options;

  // Video element exists?
  let player; 
  try {
    player = videojs('livestream');
  }
  catch(e) {};

  if (player) {
    try {
      player.src(streamUrl);
      player.play();
      // TODO: properly clean the overlay
      player.el().querySelector('.active_content_overlay').remove();
      return player;
    }
    catch(e) {
      console.log(e);
      alert('The stream is live but you need to press play!');
    }
    // TODO: mute detection    
  }

  return new Promise(resolve => {
    // Need to create new player
    // TODO: reuse the same code as in "idle()"
    const frag = document.createDocumentFragment();
    render(tVideoTag(), frag);
    
    const vElement = frag.querySelector('video');

    videojs(vElement, null, function() {
      const player = this;
      //const overlay = document.createDocumentFragment();
      //render(tVideoOverlay({ contents: '' }), overlay);

      //player.el().appendChild(overlay);

      try {
        player.src(streamUrl);
        player.play();
        // TODO: properly clean the overlay
        let ac = player.el().querySelector('.active_content_overlay');
        while (ac && ac.firstChild) ac.firstChild.remove();
      }
      catch(e) {
        console.log(e);
        alert('The stream is live but you need to press play!');
      }
  
      resolve(player);
    });
  });
}

// TODO: move all video tags in a central class (streaming, replays, etc.)
const tVideoTag = (p) => html`<video
  id="livestream"
  class="streambox__video active_content video-js vjs-waasabi"
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