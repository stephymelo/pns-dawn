document.addEventListener('click', function (e) {
  const btn = e.target.closest('.pns-qty-minus, .pns-qty-plus');
  if (!btn) return;

  const picker = btn.closest('.pns-qty-picker');
  const input = picker.querySelector('.pns-qty-input');
  const step = parseInt(input.step) || 1;
  const min = parseInt(input.min) || 1;
  const max = input.max ? parseInt(input.max) : Infinity;
  let value = parseInt(input.value) || min;

  if (btn.classList.contains('pns-qty-minus')) {
    value = Math.max(min, value - step);
  } else {
    value = Math.min(max, value + step);
  }

  input.value = value;
});
