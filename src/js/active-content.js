import livestreamIdle from './content/livestream-idle.js';
import livestreamLive from './content/livestream-live.js';

export async function set(ac, options) {
  if (ac == 'livestream.idle') {
    let player = await livestreamIdle();
    change(player.el());
  }

  if (ac == 'livestream.live') {
    let player = await livestreamLive(options);
    change(player.el());
  }
}

export function change(newContent) {
  // Remove all
  document.querySelectorAll('main > .active_content').forEach(c => c !== newContent ? c.remove() : null);

  // Add new
  document.querySelector('main').appendChild(newContent)

  // Content sizing
  const acw = document.querySelector('main > .active_content').clientWidth;
  document.querySelector('main').style = `--active-content-w: ${acw}px`;
//TODO: update on viewport size change
}