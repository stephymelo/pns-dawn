/* PNS collection infinite scroll.
   Replaces numbered pagination: fetches the next page and appends its product
   cards to #product-grid as the shopper scrolls (with a "Load more" fallback).
   Implemented as a custom element so it auto-initialises again after Dawn's
   facet AJAX replaces #ProductGridContainer. Because every loaded product stays
   in the DOM, the in-collection name search filters the whole loaded catalog. */
if (!customElements.get('pns-infinite-scroll')) {
  customElements.define(
    'pns-infinite-scroll',
    class PnsInfiniteScroll extends HTMLElement {
      connectedCallback() {
        this.loading = false;
        this.sectionId = this.dataset.sectionId;
        this.button = this.querySelector('[data-load-more]');
        this.sentinel = this.querySelector('[data-sentinel]');
        this.label = this.button ? this.button.textContent : '';

        if (this.button) {
          this.button.addEventListener('click', () => this.loadNext());
        }
        if (this.sentinel && 'IntersectionObserver' in window) {
          this.observer = new IntersectionObserver(
            (entries) => {
              if (entries.some((entry) => entry.isIntersecting)) this.loadNext();
            },
            { rootMargin: '800px 0px' }
          );
          this.observer.observe(this.sentinel);
        }
      }

      disconnectedCallback() {
        if (this.observer) this.observer.disconnect();
      }

      async loadNext() {
        if (this.loading || !this.dataset.nextUrl) return;
        this.loading = true;
        this.setBusy(true);

        try {
          const url = new URL(this.dataset.nextUrl, window.location.origin);
          if (this.sectionId) url.searchParams.set('section_id', this.sectionId);

          const response = await fetch(url.toString());
          if (!response.ok) throw new Error('Bad response');
          const doc = new DOMParser().parseFromString(await response.text(), 'text/html');

          const grid = document.getElementById('product-grid');
          const newItems = doc.querySelectorAll('#product-grid > .grid__item');
          if (grid && newItems.length) {
            const fragment = document.createDocumentFragment();
            newItems.forEach((item) => fragment.appendChild(document.importNode(item, true)));
            grid.appendChild(fragment);
          }

          const nextEl = doc.querySelector('pns-infinite-scroll');
          const nextUrl = nextEl ? nextEl.dataset.nextUrl : null;
          if (nextUrl) {
            this.dataset.nextUrl = nextUrl;
          } else {
            this.finish();
          }
        } catch (e) {
          // Keep the button visible so the shopper can retry manually.
        } finally {
          this.loading = false;
          this.setBusy(false);
        }

        // If the sentinel is still near the viewport (short page), keep going.
        this.maybeContinue();
      }

      // Force-load every remaining page. Used by the client-side filters
      // (name search / Category) so they can match products that live on
      // not-yet-scrolled pages instead of hiding the whole visible grid.
      // Guards against re-entry and caps iterations so a failing request
      // can't spin forever.
      async loadAll() {
        if (this._loadingAll) return;
        this._loadingAll = true;
        this.setBusy(true);
        let safety = 0;
        try {
          while (this.dataset.nextUrl && safety < 1000) {
            safety += 1;
            if (this.loading) {
              // A load kicked off elsewhere is in flight — wait for it.
              await new Promise((resolve) => setTimeout(resolve, 60));
            } else {
              await this.loadNext();
            }
          }
        } finally {
          this._loadingAll = false;
          this.setBusy(false);
        }
      }

      maybeContinue() {
        if (!this.dataset.nextUrl || !this.sentinel) return;
        const rect = this.sentinel.getBoundingClientRect();
        if (rect.top < window.innerHeight + 800) this.loadNext();
      }

      setBusy(state) {
        if (!this.button) return;
        this.button.disabled = state;
        this.button.textContent = state ? 'Loading…' : this.label;
      }

      finish() {
        delete this.dataset.nextUrl;
        if (this.observer) this.observer.disconnect();
        // Hide the whole control. (button.hidden is unreliable here: Dawn's
        // .button { display: ... } overrides the [hidden] attribute.)
        this.style.display = 'none';
      }
    }
  );
}
