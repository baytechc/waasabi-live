export function collectInputs(parentElement, fields) {
  return fields.reduce( (obj, f) => {
    const el = parentElement.querySelector(`input[name=${f}]`);

    // Form field exists
    if (el) {
      // Required and empty
      if (el.required && !el.value) {
        throw Object.assign(
          new Error(`Required field: ${f}`), { type: 'invalid' }
        );
      }

      obj[f] = el.value;
    }
    return obj;
  }, {});
}
