// import { onChatMessage } from './live.js';
function onChatMessage() { /* stub */ }

async function init() {
  let messagetimer;

  // Listen to livestream events
  onChatMessage(sig => {
    console.debug(sig);
    const { sender, message } = sig;

    const showchat = document.querySelector('#showchat')?.checked;
    if (!showchat) return;

    let e = document.createElement('p');
    e.className = 'message';
    e.textContent = '['+sender.match(/@([^:]+)/)[1]+'] '+message;

    let ac = document.querySelector('.active_content_overlay');
    if (!ac) {
      let ls = document.querySelector('#livestream');

      ac = document.createElement('div');
      ac.className='active_content_overlay';
      ls.appendChild(ac);
    } else {
      while (ac.firstChild) ac.firstChild.remove();
    }

    ac.appendChild(e);

    clearTimeout(messagetimer);
    messagetimer = setTimeout(() => { e.remove(); }, 5000);
});
}

init();
