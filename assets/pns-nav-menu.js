if (!window.__pnsNavMenuInit) {
  window.__pnsNavMenuInit = true;

  document.addEventListener('click', function (e) {
    const link = e.target.closest('.pns-nav-bar .pns-nav-link');
    if (link) {
      const item = link.closest('.pns-nav-item');
      if (item && item.querySelector('.pns-nav-dropdown')) {
        // Top-level item with a dropdown: toggle open on click instead of navigating.
        e.preventDefault();
        const wasOpen = item.classList.contains('is-open');
        const siblings = item.parentElement
          ? item.parentElement.querySelectorAll('.pns-nav-item.is-open')
          : [];
        siblings.forEach((i) => i.classList.remove('is-open'));
        if (!wasOpen) item.classList.add('is-open');
        return;
      }
      // Link without a dropdown: let it navigate normally.
      return;
    }

    // Click outside the nav bar closes all open items.
    if (!e.target.closest('.pns-nav-bar')) {
      document
        .querySelectorAll('.pns-nav-item.is-open')
        .forEach((i) => i.classList.remove('is-open'));
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document
        .querySelectorAll('.pns-nav-item.is-open')
        .forEach((i) => i.classList.remove('is-open'));
    }
  });
}
