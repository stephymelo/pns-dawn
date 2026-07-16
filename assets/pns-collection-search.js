/* PNS in-collection product search (filter by name).
   Filters the currently-rendered product grid client-side as the user types.
   NOTE: this filters the products loaded on the page. If the collection is
   paginated, products on later pages aren't loaded yet — raise "products per
   page" on the section, or use an app for full-catalog in-collection search. */
(function () {
  function getQuery(input) {
    return (input.value || '').trim().toLowerCase();
  }

  function apply(input) {
    var grid = document.getElementById('product-grid');
    if (!grid) return;
    var q = getQuery(input);
    var items = grid.querySelectorAll('.grid__item');
    var visible = 0;

    items.forEach(function (li) {
      var titleEl = li.querySelector('.card__heading, .card-information .card__heading');
      var title = (titleEl ? titleEl.textContent : li.textContent) || '';
      var match = q === '' || title.toLowerCase().indexOf(q) !== -1;
      // Hide via a class (not inline display) so the custom "Category" filter,
      // which toggles `pns-hide-category`, combines with this instead of fighting
      // over the same inline style. An item shows only if it has neither class.
      li.classList.toggle('pns-hide-search', !match);
      if (match) visible++;
    });

    var wrap = input.closest('[data-pns-collection-search-wrap]');
    var empty = wrap && wrap.querySelector('[data-pns-collection-search-empty]');
    if (empty) empty.classList.toggle('is-visible', q !== '' && visible === 0);
  }

  function bind() {
    var input = document.querySelector('[data-pns-collection-search]');
    if (!input) return;

    if (!input.dataset.pnsBound) {
      input.dataset.pnsBound = '1';
      input.addEventListener('input', function () {
        apply(input);
      });

      // Re-apply the active text filter after Dawn re-renders the grid via
      // facet AJAX (changing a checkbox/sort rebuilds #ProductGridContainer).
      var container = document.getElementById('ProductGridContainer');
      if (container && window.MutationObserver) {
        var observer = new MutationObserver(function () {
          if (getQuery(input) !== '') apply(input);
        });
        observer.observe(container, { childList: true, subtree: true });
      }
    }

    // Restore filtering if the input already has a value (e.g. back nav).
    if (getQuery(input) !== '') apply(input);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
  document.addEventListener('shopify:section:load', bind);
})();
