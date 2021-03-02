const POPUP_SELECTOR = '.streambox__popup';
const el = () => document.querySelector(POPUP_SELECTOR);

export function show(contents, opts) {
  const e=el(); while (e.firstChild) e.firstChild.remove();

  if (typeof contents == 'string') {
    const frag = document.createDocumentFragment();
    frag.textContent = contents;
    contents = frag;
  }

  el().appendChild(contents);

  if (opts.timeout) {
    setTimeout(() => toggle(false), opts.timeout*1000)
  }

  toggle(true);
}

export function toggle(value) {
  const root = document.documentElement;
  const popup = root.dataset.popup;
  
  if (value === false || (value !== true && popup === 'show')) {
    delete root.dataset.popup;
  } else {
    root.dataset.popup = 'show';
  }
}
