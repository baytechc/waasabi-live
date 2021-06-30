import * as hls from './content/hls.js';
import * as peertube from './content/peertube.js';
import * as idle from './content/idle.js';

const CTYPES = {
  hls,
  peertube,
  idle,
};

window.addEventListener('resize', updateActiveContentSizing);


export async function set(data) {
  const { type } = data;
  const endpoint = data.endpoint ?? type;
console.log('AC:', type+'/'+endpoint, data);

  if (type in CTYPES) {
    if (endpoint in CTYPES[type]) {
      const element = await CTYPES[type][endpoint](data);
      // TODO: manage and arrange multiple content boxes via their id-s
      console.log(element);
      change(element);
    }
  }
}

export function change(newContent) {
  // Remove all
  document.querySelectorAll('main > .active_content').forEach(c => c !== newContent ? c.remove() : null);

  // Add new
  document.querySelector('main').appendChild(newContent)

  // Content sizing
  updateActiveContentSizing();
}

export function updateActiveContentSizing() {
  const acw = document.querySelector('main > .active_content')?.clientWidth;

  if (acw > 0) {
    document.querySelector('main').style = `--active-content-w: ${acw}px`;
    return acw;  
  }
}