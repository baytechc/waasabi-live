import listen from './live.js';


async function init() {
  let res = await fetch('https://backend.rustfest.global/attendee-pushes?type=other&_sort=created_at:DESC&_limit=10').then(r => r.json());
  for (let m of res) {
    if (m.message.event == 'immerse') {
      const age = (Date.now()-new Date(m.created_at)) / 1000 / 60;
      if (age > 55) break;
      switchTo(m.message.data.ex);
      break;
    }
  }

  listen(m => {
    if (m.type == 'other') {
      if (m.message.event == 'immerse') {
        switchTo(m.message.data.ex);
      }
    }
  });    
}

function switchTo(ex) {
  console.log('Switching to immersive website experience: ', ex);
  document.documentElement.dataset.immersive=ex;
}

init();
