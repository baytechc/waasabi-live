import * as activeContent from './active-content.js';


export async function liveNow(data) {
  const id = data.livestream['playback_id'];
  const streamUrl = `https://stream.mux.com/${id}.m3u8`;
  console.log('hls liveNow:', streamUrl)

  await activeContent.set({
    id,
    cid: `livestream-hls-${id}`,
    type: 'hls',
    endpoint: 'live',
    streamUrl,
  });
}

export async function stop() {
  const player = videojs('livestream');

  try {
    player.on(player.el(), 'ended', (e) => {
      console.log('Livestream ended.');
      activeContent.set('livestream.idle');
    });

    //player.reset();
    //player.poster();
    //TODO: on player buffer underrun => idle (try to keep the unmuted player around)
  }
  catch(e) {
    console.log(e);
  }
}
