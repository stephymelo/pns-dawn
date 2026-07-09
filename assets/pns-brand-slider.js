class PnsBrandSlider extends HTMLElement {
  connectedCallback() {
    this.track = this.querySelector('.pns-brand-slider__track');
    if (!this.track || this.track.children.length < 2) return;

    this.interval = parseInt(this.getAttribute('data-interval'), 10) || 4000;
    this.duration = parseInt(this.getAttribute('data-duration'), 10) || 800;
    this.animating = false;

    this.track.style.transition = 'none';
    this.track.style.transform = 'translateX(0)';

    const prev = this.querySelector('.slider-button--prev');
    const next = this.querySelector('.slider-button--next');
    if (prev) prev.addEventListener('click', () => this.userStep('prev'));
    if (next) next.addEventListener('click', () => this.userStep('next'));

    this.addEventListener('mouseenter', () => this.stop());
    this.addEventListener('mouseleave', () => this.start());
    this.addEventListener('focusin', () => this.stop());
    this.addEventListener('focusout', () => this.start());

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) this.start();
  }

  disconnectedCallback() {
    this.stop();
  }

  slideWidth() {
    return this.track.children[0].getBoundingClientRect().width;
  }

  next() {
    if (this.animating || this.track.children.length < 2) return;
    this.animating = true;
    const w = this.slideWidth();
    this.track.style.transition = `transform ${this.duration}ms ease`;
    this.track.style.transform = `translateX(${-w}px)`;
    const done = () => {
      this.track.removeEventListener('transitionend', done);
      this.track.style.transition = 'none';
      this.track.appendChild(this.track.children[0]);
      this.track.style.transform = 'translateX(0)';
      void this.track.offsetWidth; // force reflow
      this.animating = false;
    };
    this.track.addEventListener('transitionend', done);
  }

  prev() {
    if (this.animating || this.track.children.length < 2) return;
    this.animating = true;
    const w = this.slideWidth();
    this.track.style.transition = 'none';
    this.track.insertBefore(this.track.lastElementChild, this.track.firstElementChild);
    this.track.style.transform = `translateX(${-w}px)`;
    void this.track.offsetWidth; // force reflow
    this.track.style.transition = `transform ${this.duration}ms ease`;
    this.track.style.transform = 'translateX(0)';
    const done = () => {
      this.track.removeEventListener('transitionend', done);
      this.animating = false;
    };
    this.track.addEventListener('transitionend', done);
  }

  start() {
    this.stop();
    this.timer = setInterval(() => this.next(), this.interval);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  userStep(dir) {
    this.stop();
    if (dir === 'next') this.next();
    else this.prev();
    this.start();
  }
}

if (!customElements.get('pns-brand-slider')) {
  customElements.define('pns-brand-slider', PnsBrandSlider);
}
