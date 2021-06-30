import { html, render } from 'lit-html';


export async function live(data) {
  const { cid, videoId, videoTitle } = data;

  const frag = document.createDocumentFragment();

  //`${process.env.W_PREFIX}/assets/video-holder.jpg`
  render(html`<div id="${cid}" class="streambox__video active_content">
    <iframe width="560" height="315"
      sandbox="allow-same-origin allow-scripts allow-popups"
      title="${videoTitle}"
      src="/videos/embed/${videoId}?autoplay=1&muted=1"
      style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;"
      frameborder="0" allowfullscreen></iframe>
    </div>
  `, frag);

  return frag;
}

const tVideoOverlay = (p = {}) => html`<div class="active_content_overlay">
${p.contents}
</div>`
