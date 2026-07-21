/* ==========================================================================
   AQUAVAULT — Comportements partagés (toutes les pages)
   ========================================================================== */
(function () {
  'use strict';

  /* Header: devient solide au scroll */
  var header = document.querySelector('.header');
  function onScrollHeader() {
    if (!header) return;
    if (header.hasAttribute('data-header-static')) { header.classList.add('is-solid'); return; }
    header.classList.toggle('is-solid', window.scrollY > 40);
  }
  document.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* Menu mobile */
  var mobileToggle = document.querySelector('.mobile-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  var mobileClose = document.querySelector('.mobile-nav-close');
  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', function () {
      mobileNav.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  }
  if (mobileClose && mobileNav) {
    mobileClose.addEventListener('click', closeMobileNav);
  }
  document.querySelectorAll('.mobile-nav a').forEach(function (a) {
    a.addEventListener('click', closeMobileNav);
  });
  function closeMobileNav() {
    mobileNav.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  /* Reveal on scroll (IntersectionObserver) */
  var revealEls = document.querySelectorAll('[data-reveal], [data-reveal-group]');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* Accordion générique (FAQ) */
  document.querySelectorAll('.accordion-item').forEach(function (item) {
    var trigger = item.querySelector('.accordion-trigger');
    var panel = item.querySelector('.accordion-panel');
    if (!trigger || !panel) return;
    trigger.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');
      var group = item.closest('[data-accordion-group]');
      if (group) {
        group.querySelectorAll('.accordion-item.is-open').forEach(function (openItem) {
          if (openItem !== item) {
            openItem.classList.remove('is-open');
            openItem.querySelector('.accordion-panel').style.maxHeight = null;
          }
        });
      }
      item.classList.toggle('is-open', !isOpen);
      panel.style.maxHeight = !isOpen ? panel.scrollHeight + 'px' : null;
    });
  });

  /* Compteurs animés (stats) */
  var counters = document.querySelectorAll('[data-counter]');
  if (counters.length && 'IntersectionObserver' in window) {
    var counterIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        counterIO.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { counterIO.observe(c); });
  }
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-counter'));
    var suffix = el.getAttribute('data-suffix') || '';
    var decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals'), 10) : 0;
    var duration = 1600;
    var start = performance.now();
    function tick(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = target * eased;
      el.textContent = decimals ? value.toFixed(decimals) : Math.round(value).toLocaleString('fr-FR');
      el.textContent += suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* Carousel d'avis (témoignages) */
  document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
    var track = carousel.querySelector('[data-carousel-track]');
    var slides = track ? Array.from(track.children) : [];
    var prev = carousel.querySelector('[data-carousel-prev]');
    var next = carousel.querySelector('[data-carousel-next]');
    var dotsWrap = carousel.querySelector('[data-carousel-dots]');
    if (!track || !slides.length) return;
    var index = 0;

    if (dotsWrap) {
      slides.forEach(function (_, i) {
        var dot = document.createElement('button');
        dot.className = 'carousel-dot';
        dot.addEventListener('click', function () { goTo(i); });
        dotsWrap.appendChild(dot);
      });
    }
    function update() {
      var slideWidth = slides[0].getBoundingClientRect().width + 24;
      track.style.transform = 'translateX(' + (-index * slideWidth) + 'px)';
      if (dotsWrap) {
        Array.from(dotsWrap.children).forEach(function (d, i) {
          d.classList.toggle('is-active', i === index);
        });
      }
    }
    function goTo(i) {
      index = (i + slides.length) % slides.length;
      update();
    }
    if (next) next.addEventListener('click', function () { goTo(index + 1); });
    if (prev) prev.addEventListener('click', function () { goTo(index - 1); });
    window.addEventListener('resize', update);
    update();
  });

  /* Newsletter — simulation d'envoi (prototype, pas de backend) */
  document.querySelectorAll('[data-newsletter-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button');
      var input = form.querySelector('input');
      if (!input.value) return;
      btn.innerHTML = '<svg class="icon"><use href="#icon-check"></use></svg>';
      input.value = '';
      input.placeholder = 'Merci, à bientôt ☁️';
      setTimeout(function () {
        btn.innerHTML = '<svg class="icon"><use href="#icon-arrow-right"></use></svg>';
        input.placeholder = 'Votre email';
      }, 2600);
    });
  });

  /* Bulles animées générées dynamiquement (démo étanchéité) */
  document.querySelectorAll('[data-bubbles]').forEach(function (container) {
    var count = parseInt(container.getAttribute('data-bubbles'), 10) || 14;
    for (var i = 0; i < count; i++) {
      var b = document.createElement('span');
      b.className = 'bubble';
      var size = 4 + Math.random() * 10;
      b.style.width = size + 'px';
      b.style.height = size + 'px';
      b.style.left = Math.random() * 100 + '%';
      b.style.animationDuration = (3 + Math.random() * 3) + 's';
      b.style.animationDelay = (Math.random() * 4) + 's';
      container.appendChild(b);
    }
  });

  /* Tilt 3D subtil au survol — desktop à souris fine uniquement, respecte prefers-reduced-motion */
  var canTilt = window.matchMedia('(pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (canTilt) {
    var TILT_MAX = 7;
    var TILT_RESET = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var rect = el.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transition = 'none';
        el.style.transform = 'perspective(900px) rotateX(' + (-py * TILT_MAX).toFixed(2) + 'deg) rotateY(' + (px * TILT_MAX).toFixed(2) + 'deg)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transition = 'transform .6s cubic-bezier(0.16, 1, 0.3, 1)';
        el.style.transform = TILT_RESET;
      });
    });
  }
})();
