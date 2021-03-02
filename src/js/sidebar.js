import { render } from 'lit-html';

import { goHomeButton } from '../pages/home.js';

const SIDEBAR_SELECTOR = '.streambox__sidebar';
const el = () => document.querySelector(SIDEBAR_SELECTOR);

const BUTTON_SELECTOR='[data-action="toggle-sidebar"]';
const controlSidebar = document.querySelector(BUTTON_SELECTOR);
if (controlSidebar) {
  controlSidebar.addEventListener('click', toggle);
}

export function toggle(value) {
  const root = document.documentElement;
  const sidebar = root.dataset.sidebar;

  if (value === false || (value !== true && sidebar === 'show')) {
    delete root.dataset.sidebar;
  } else {
    root.dataset.sidebar = 'show';
  }
}

export function showContent(content, open = true, back = true) {
  clearContents();

  const frag = document.createDocumentFragment();
  render(content, frag);

  // Append home button to content
  if (back) frag.lastElementChild.appendChild(goHomeButton());

  el().appendChild(frag);
  el().scrollTop = 0;


  showing('content');

  if (open) toggle(true);
}

// By default, toggles on/off
export function showEmbed(src) {
  // Clicking again toggles the experience on
  if (showing() == src) {
    clearContents();
    toggle(false);
    return;
  }

  let ex=document.createElement('iframe');
  // TODO: move this to css
  ex.setAttribute('style','width: 100%;height: 100%;');
  replaceContents(ex);
  showing(src);

  // Update the iframe source after a turn of the event loop
  setTimeout(() => {
    ex.src = src;
    toggle(true);
  }, 10);
}

export function replaceContents(element) {
  clearContents();
  el().appendChild(element);
}

export function clearContents() {
  const e=el(); while (e.firstChild) e.firstChild.remove();

  showing('');
}

export function showing(set = false) {
  if (set !== false) {
    return el().dataset.contents = set;
  }

  return el().dataset.contents;
}