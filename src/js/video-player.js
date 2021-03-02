import videojs from 'video.js';
import 'videojs-contrib-quality-levels';
import 'videojs-hls-quality-selector';

async function init() {
  // CSS
  const videojsStyle = document.createElement('link');
  videojsStyle.setAttribute('rel', 'stylesheet');
  videojsStyle.setAttribute('href', '/assets/videojs/video-js.min.css');
  document.head.appendChild(videojsStyle);

  window.videojs = videojs;
  window.videoJsReady = Promise.resolve(videojs);
}


export function playerConfig(opts = {}) {
  let config = ({
    controls: true,
    playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
  });
  return config;
}

export function configurePlayer(player, opts = {}) {
  // TODO: run playerConfig(opts) on player
  player.hlsQualitySelector({ displayCurrentQuality: true });

  const ql = player.qualityLevels();

  ql.on('change', (e) => {
    const sel = ql.selectedIndex;
    if (sel === -1) {
      console.log('Auto quality level selected.');
    } else {
      const q = ql[sel];
      console.log(`Quality level selected: #${sel} (${q.width}x${q.height}, ${q.bitrate/1024|0}kbps)`);
    }
  });
}

init();
