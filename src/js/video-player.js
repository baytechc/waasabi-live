import VideoJS from 'video.js';
//import QualitySelectorHls from 'videojs-quality-selector-hls'


async function init() {
  // CSS
  //const videojsStyle = document.createElement('link');
  //videojsStyle.setAttribute('rel', 'stylesheet');
  //videojsStyle.setAttribute('href', process.env.W_PREFIX+'/assets/videojs/video-js.min.css');
  //document.head.appendChild(videojsStyle);
  // - disabled, we add this to the site CSS

  videojs = window.videojs ?? VideoJS;
  window.videoJsReady = Promise.resolve(videojs);

  //videojs.registerPlugin('qualitySelectorHls', QualitySelectorHls);
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

  // This is disabled because every existing version/fork of the library is broken
  // Symptom: infinite buffering on quality switch, chunks stop downloading
  // Needs further debugging as automatic switching on viewport resize usually works,
  // but observed to occasionally break, perhaps the same issue as:
  // https://github.com/videojs/video.js/issues/7107

  //player.qualitySelectorHls({
  // displayCurrentQuality: true,
  //})

  // this is now included built-in
  const ql = player.qualityLevels();

  ql.on('change', (e) => {
    if (ql.selectedIndex !== -1) {
      const { width, height, bitrate } = ql[ql.selectedIndex]
      console.log(`Quality level selected: #${ql.selectedIndex} (${width}x${height}, ${bitrate/1024|0}kbps)`)
    }
  });
}

init();
