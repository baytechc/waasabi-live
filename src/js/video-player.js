import { html } from 'lit-html';

import '@videojs/html/video/player';
import '@videojs/html/video/neutral-skin';
import '@videojs/html/live-video/player';
import '@videojs/html/live-video/neutral-skin';
import '@videojs/html/media/mux-video';


export function livePlayer(options) {
  console.log('[VIDEO-PLAYER] Creating <live-video-player>', options)

  const playerContainer = document.createElement('div');
  playerContainer.innerHTML = `<live-video-player id="${options.cid}">
    <live-video-neutral-skin style="display: block; width: 100%; aspect-ratio: 16 / 9;">
      <mux-video autoplay muted playsinline preload="auto" stream-type="live"></mux-video>
    </live-video-neutral-skin>
  </live-video-player>`

  const muxVideo = playerContainer.querySelector('mux-video') 
  muxVideo.source = {
    playbackId: options.id,
  }

  return playerContainer.firstElementChild
}

export function videoPlayer(options) {
  console.log('[VIDEO-PLAYER] Creating <video-player>', options)

  const playerContainer = document.createElement('div');
  playerContainer.innerHTML = `<video-player>
    <video-neutral-skin style="display: block; width: 100%; aspect-ratio: 16 / 9;">
      <mux-video
        src="${options.src ?? ''}"
        poster="${options.poster ?? ''}"
        crossorigin="anonymous"
        playsinline></mux-video>
    </video-neutral-skin>
  </video-player>`

  console.log(playerContainer)
  return playerContainer.firstElementChild
}

export async function play(element) {
  const store = element?.store
  console.log('JUST PUSH PLAY', store, store?.paused ? 'paused' : 'playing')
  await store?.play()
  console.log(store.paused)
}
