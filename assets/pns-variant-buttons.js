/* PNS inline variant buttons on product cards.
   Clicking a .pns-variant-btn selects that variant (visual highlight) and
   updates the sibling hidden .product-variant-id input, so the existing pink
   "Add to cart" submit posts the selected variant. Selection only — no submit.
   Uses a global-init guard + event delegation on document so it works for
   cards appended by infinite scroll. */
if (!window.__pnsVariantBtnsInit) {
  window.__pnsVariantBtnsInit = true;

  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.pns-variant-btn');
    if (!btn) return;

    // Ignore clicks on unavailable variants.
    if (btn.getAttribute('data-available') === 'false') return;

    const form = btn.closest('product-form, form');
    if (!form) return;

    // Highlight the clicked button, clear its siblings.
    const group = btn.closest('.pns-variant-btns');
    if (group) {
      group.querySelectorAll('.pns-variant-btn').forEach(function (sibling) {
        const selected = sibling === btn;
        sibling.classList.toggle('is-selected', selected);
        sibling.setAttribute('aria-pressed', selected ? 'true' : 'false');
      });
    }

    // Point the hidden id input at the selected variant.
    const input = form.querySelector('.product-variant-id');
    if (input) input.value = btn.getAttribute('data-variant-id');
  });
}
