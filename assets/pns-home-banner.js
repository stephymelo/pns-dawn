class PnsHomeBanner extends HTMLElement {
  connectedCallback() {
    this.track = this.querySelector('[data-pns-banner-track]');
    this.slides = this.track ? Array.from(this.track.children) : [];
    this.total = this.slides.length;
    if (this.total === 0) return;

    this.dots = Array.from(this.querySelectorAll('[data-pns-banner-dot]'));
    this.current = 0;
    this.interval = parseInt(this.getAttribute('data-interval'), 10) || 5000;

    const prev = this.querySelector('[data-pns-banner-prev]');
    const next = this.querySelector('[data-pns-banner-next]');
    if (prev) prev.addEventListener('click', () => this.step(-1, true));
    if (next) next.addEventListener('click', () => this.step(1, true));
    this.dots.forEach((dot, i) => dot.addEventListener('click', () => this.goTo(i, true)));

    this._onResize = () => this.render(false);
    window.addEventListener('resize', this._onResize);
    this.addEventListener('mouseenter', () => this.stop());
    this.addEventListener('mouseleave', () => this.start());

    this.render(false);
    if (this.total > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.start();
    }
  }

  disconnectedCallback() {
    this.stop();
    if (this._onResize) window.removeEventListener('resize', this._onResize);
  }

  goTo(index, user) {
    this.current = ((index % this.total) + this.total) % this.total;
    this.render(true);
    if (user) {
      this.stop();
      this.start();
    }
  }

  step(dir, user) {
    this.goTo(this.current + dir, user);
  }

  render(animate) {
    // One full slide = the viewport width, measured in px so the next banner
    // always lands completely in view.
    const width = this.slides[0].getBoundingClientRect().width;
    this.track.style.transition = animate ? 'transform 0.5s ease' : 'none';
    this.track.style.transform = `translateX(${-this.current * width}px)`;
    this.dots.forEach((dot, i) => dot.classList.toggle('is-active', i === this.current));
  }

  start() {
    this.stop();
    if (this.total > 1) this.timer = setInterval(() => this.step(1), this.interval);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }
}

if (!customElements.get('pns-home-banner')) {
  customElements.define('pns-home-banner', PnsHomeBanner);
}
