// Things that auto-init
import './auth.js';

import './button-events.js';

//import './experiences.js';

import '../pages/home.js';

if (process.env.WAASABI_CHAT_ENABLED) {
  import('./chat.js');
}

//import('./live.js'); not needed?
import('./streaming.js');
/* TODO:
import('./webmonetization.js');
import('./immersive.js');
*/

import { updateActiveContent } from './active-content.js'

let el=document.createElement('div')
el.className="ac"

el.innerHTML='<button class="activeContentTrigger">Veloren</button>'

let ex=document.createElement('iframe')
ex.id="ex_veloren"
ex.className='content'
ex.setAttribute('style','width: 100%;height: 100%;')
ex.src = "/assets/ex/veloren/index.html"
//ex.hidden = true
el.appendChild(ex)

document.querySelector('main').appendChild(el);

el.querySelector('.activeContentTrigger').addEventListener('click', e => {
  const isActive = !el.dataset.active
  el.dataset.active = isActive ? 'true' : ''

  //ex=window.frames['ex_veloren'];
  exv=ex.contentDocument.querySelector('video')

  console.log(el.dataset, isActive, exv)
  if (isActive) {
    //ex.hidden = false

    if (exv) {
      exv.volume = .5
      exv.muted = false
      exv.play()
      console.log('just push play', exv.playing)
    }
  } else {
    if (exv) {
      exv.pause()
    }

    //ex.hidden = true
  }
  updateActiveContent()
})

let el2=document.createElement('div')
el2.className="ac"
el2.dataset.active=false

const fsb = document.createElement('button')
fsb.className = "fsb"
fsb.textContent = "Fullscreen"
fsb.addEventListener('click', e => {
  const elem = document.querySelector('main');
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  }
})

el2.appendChild(fsb)
document.querySelector('main').appendChild(el2);