import * as activeContent from './active-content.js';


export async function liveNow(data) {
  const id = data.livestream['playback_id'];
  console.log('peertube liveNow:', data.video)

  await activeContent.set({
    id,
    cid: `livestream-peertube-${id}`,
    type: 'peertube',
    endpoint: 'live',
    videoId: data.video.uuid,
    videoTitle: data.video.name,
  });
}

export async function stop() {
}
