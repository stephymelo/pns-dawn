document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-pns-promo-slider]').forEach(function (slider) {
    var track = slider.querySelector('[data-pns-slider-track]');
    var slides = track.querySelectorAll('.pns-promo-slider__slide');
    var dots = slider.querySelectorAll('[data-pns-dot]');
    var prevBtn = slider.querySelector('[data-pns-slider-prev]');
    var nextBtn = slider.querySelector('[data-pns-slider-next]');
    var current = 0;
    var total = slides.length;
    if (total <= 1) return;

    function goTo(index) {
      if (index < 0) index = total - 1;
      if (index >= total) index = 0;
      current = index;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function (dot, i) {
        dot.classList.toggle('pns-promo-slider__dot--active', i === current);
      });
    }

    prevBtn.addEventListener('click', function () { goTo(current - 1); });
    nextBtn.addEventListener('click', function () { goTo(current + 1); });
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        goTo(parseInt(dot.getAttribute('data-pns-dot')));
      });
    });

    // Auto-advance every 5 seconds
    var interval = setInterval(function () { goTo(current + 1); }, 5000);
    slider.addEventListener('mouseenter', function () { clearInterval(interval); });
    slider.addEventListener('mouseleave', function () {
      interval = setInterval(function () { goTo(current + 1); }, 5000);
    });
  });
});
