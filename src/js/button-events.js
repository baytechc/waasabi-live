export function popupToggle(value) {
  const root = document.documentElement;
  const popup = root.dataset.popup;
  
  if (value === false || (value !== true && popup === 'show')) {
    delete root.dataset.popup;
  } else {
    root.dataset.popup = 'show';
  }
}
