/* PNS custom "Category" filter.
   Narrows the currently-rendered product grid by collection membership,
   client-side, to mirror how the in-grid name search works.

   Each .grid__item carries data-collections="handle1,handle2,..." (the handles
   of the collections that product belongs to). Ticking one or more boxes in the
   CATEGORY facet shows only items that belong to ANY checked collection (OR
   logic); unchecking all shows everything again.

   Coexistence:
   - Hides via the `pns-hide-category` class, while the name search hides via
     `pns-hide-search`. An item is visible only if it has NEITHER class, so the
     two filters combine instead of fighting over inline styles.
   - Re-applies after infinite scroll appends items and after Dawn's facet AJAX
     rebuilds #ProductGridContainer (MutationObserver).

   NOTE: like the name search, this only covers products loaded into the page.
   Infinite scroll loads more as you scroll; items not yet loaded aren't filtered. */
(function () {
  function getChecked() {
    return Array.prototype.slice
      .call(document.querySelectorAll('[data-pns-category-input]:checked'))
      .map(function (el) {
        return el.value;
      });
  }

  function apply() {
    var grid = document.getElementById('product-grid');
    if (!grid) return;
    var checked = getChecked();
    var items = grid.querySelectorAll('.grid__item');

    items.forEach(function (li) {
      var hide = false;
      if (checked.length) {
        var raw = li.getAttribute('data-collections') || '';
        var handles = raw.split(',');
        var match = checked.some(function (h) {
          return handles.indexOf(h) !== -1;
        });
        hide = !match;
      }
      li.classList.toggle('pns-hide-category', hide);
    });
  }

  function bind() {
    if (!document.body.dataset.pnsCategoryBound) {
      document.body.dataset.pnsCategoryBound = '1';

      // Delegate so it keeps working if the facet markup is ever re-rendered.
      document.addEventListener('change', function (e) {
        if (e.target && e.target.matches && e.target.matches('[data-pns-category-input]')) {
          apply();
        }
      });

      // Re-apply after infinite scroll appends items or Dawn rebuilds the grid.
      var container = document.getElementById('ProductGridContainer');
      if (container && window.MutationObserver) {
        var observer = new MutationObserver(function () {
          if (getChecked().length) apply();
        });
        observer.observe(container, { childList: true, subtree: true });
      }
    }

    // Restore filtering if boxes are already checked (e.g. back navigation).
    if (getChecked().length) apply();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
  document.addEventListener('shopify:section:load', bind);
})();
