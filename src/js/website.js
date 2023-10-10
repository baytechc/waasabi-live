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

document.body.addEventListener('click', e => {
  if (!e.target.classList.contains('activeContentTrigger')) {
    return
  }
  if (e.target.classList.contains('noex')) {
    return
  }

  e.preventDefault()

  const el = e.target.parentNode
  const ex = el.classList.contains('ac') ? el : el.querySelector('.ac')

  const isActive = !el.dataset.active
  el.dataset.active = isActive ? 'true' : ''

  let exv = ex?.querySelector('video')
    ?? ex.querySelector('iframe')?.contentDocument.querySelector('video')
    // todo: lazy-load experiences

  if (isActive) {
    //ex.hidden = false

    if (exv) {
      exv.volume = .5
      exv.muted = false
      exv.play()
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
fsb.className = "activeContentTrigger fsb noex"
fsb.textContent = "Fullscreen"
fsb.addEventListener('click', e => {
  const elem = document.querySelector('main');
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  }
})

el2.appendChild(fsb)
document.querySelector('main').appendChild(el2);

/*
addExperience({
  id: 'veloren',
  title: 'Veloren',
  src: '/assets/ex/veloren/index.html'
})

addExperience({
  id: 'paddlepunks',
  title: 'Paddlepunks',
  src: '/assets/ex/paddlepunks/index.html'
})

addExperience({
  id: 'concordium',
  title: 'Concordium',
  src: '/assets/ex/concordium/index.html'
})
*/

function addExperience(data) {
  const { id, title, src, } = data;
  let el=document.createElement('div')
  el.className="ac"

  el.innerHTML=`<button class="activeContentTrigger ex-${id}">${title}</button>`

  let ex=document.createElement('iframe')
  ex.id="ex_"+id
  ex.className='content'
  ex.setAttribute('style','width: 100%;height: 100%;')
  ex.src = src

  el.appendChild(ex)

  document.querySelector('main').appendChild(el);
}