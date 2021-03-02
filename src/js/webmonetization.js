import listen from './live.js';


async function init() {
  let res = await fetch('https://backend.rustfest.global/attendee-pushes?type=other&_sort=created_at:DESC&_limit=10').then(r => r.json());
  for (let m of res) {
    if (m.message.event == 'monetize-to') {
      const age = (Date.now()-new Date(m.created_at)) / 1000 / 60;
      if (age > 55) break;
      switchTo(m.message.data.ptr);
      break;
    }
  }

  listen(m => {
    if (m.type == 'other') {
      if (m.message.event == 'monetize-to') {
        switchTo(m.message.data.ptr);
      }
    }
  });    
}

function switchTo(ptr) {
  console.log('Switching payment pointers: ', ptr);
  document.querySelector('meta[name="monetization"]').setAttribute('content', ptr);
}

init();
