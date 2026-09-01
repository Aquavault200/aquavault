/* ==========================================================================
   MOULT — Séquence de nettoyage au scroll (chaos → propre) + interactions
   Repli statique sur mobile et prefers-reduced-motion.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Header : solide au scroll, se cache en descendant ---------- */
  var header = document.getElementById('mHeader');
  var lastScroll = 0;
  function onScrollHeader() {
    if (!header) return;
    var y = window.scrollY;
    header.classList.toggle('is-solid', y > 40);
    if (y > 400 && y > lastScroll) header.classList.add('is-hidden');
    else header.classList.remove('is-hidden');
    lastScroll = y;
  }
  document.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------- Menu mobile ---------- */
  var mobileToggle = document.querySelector('.m-mobile-toggle');
  var mobileNav = document.getElementById('mMobileNav');
  var mobileClose = document.querySelector('.m-mobile-nav-close');
  if (mobileToggle && mobileNav) mobileToggle.addEventListener('click', function () { mobileNav.classList.add('is-open'); });
  if (mobileClose && mobileNav) mobileClose.addEventListener('click', function () { mobileNav.classList.remove('is-open'); });
  document.querySelectorAll('.m-mobile-nav a').forEach(function (a) {
    a.addEventListener('click', function () { mobileNav.classList.remove('is-open'); });
  });

  /* ---------- Reveal on scroll générique ---------- */
  var revealEls = document.querySelectorAll('[data-mreveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Curseur personnalisé (souris fine, pas de reduced-motion) ---------- */
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canFineCursor = window.matchMedia('(pointer: fine)').matches && !prefersReduced;
  if (canFineCursor) {
    var cursor = document.createElement('div');
    cursor.className = 'm-cursor';
    document.body.appendChild(cursor);
    document.body.classList.add('m-has-cursor');
    document.addEventListener('mousemove', function (e) {
      cursor.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px) translate(-50%,-50%)';
    });
    document.querySelectorAll('.m-btn, .m-cta, a, button').forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursor.classList.add('is-cta'); });
      el.addEventListener('mouseleave', function () { cursor.classList.remove('is-cta'); });
    });
  }

  /* ---------- Comparateur avant/après (glisser) ---------- */
  document.querySelectorAll('.m-gesture-compare').forEach(function (compare) {
    var after = compare.querySelector('.m-gesture-after');
    var handle = compare.querySelector('.m-gesture-handle');
    function setPos(pct) {
      pct = Math.max(0, Math.min(100, pct));
      after.style.clipPath = 'inset(0 0 0 ' + pct + '%)';
      handle.style.left = pct + '%';
    }
    function fromClientX(clientX) {
      var r = compare.getBoundingClientRect();
      setPos(((clientX - r.left) / r.width) * 100);
    }
    var dragging = false;
    compare.addEventListener('pointerdown', function (e) { dragging = true; fromClientX(e.clientX); });
    window.addEventListener('pointermove', function (e) { if (dragging) fromClientX(e.clientX); });
    window.addEventListener('pointerup', function () { dragging = false; });
  });

  /* ---------- Séquence héro : chaos -> propre ---------- */
  function makeFiber() {
    var span = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    var w = 40 + Math.random() * 70;
    var h = 14 + Math.random() * 20;
    span.setAttribute('width', w);
    span.setAttribute('height', h);
    span.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    var midY = h * (0.3 + Math.random() * 0.4);
    path.setAttribute('d', 'M0,' + (h / 2) + ' Q' + (w / 2) + ',' + midY + ' ' + w + ',' + (h / 2));
    var tone = Math.random() > 0.5 ? '17,17,17' : '156,124,81';
    path.setAttribute('stroke', 'rgba(' + tone + ',' + (0.35 + Math.random() * 0.3) + ')');
    path.setAttribute('stroke-width', (0.8 + Math.random() * 1.4).toFixed(1));
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-linecap', 'round');
    span.appendChild(path);
    return span;
  }

  function init() {
    var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

    if (prefersReduced || !hasGsap) {
      document.body.classList.add('m-static');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    var fibersWrap = document.getElementById('mFibers');
    var brush = document.getElementById('mBrush');
    var intro = document.getElementById('mHeroIntro');
    var statement = document.getElementById('mHeroStatement');
    if (!fibersWrap || !brush || !statement) return;

    /* Génère les fibres à des positions pseudo-aléatoires, chacune avec un
       "seuil" de nettoyage basé sur sa position diagonale (haut-gauche -> bas-droite),
       pour correspondre au trajet de la brosse. */
    var COUNT = 55;
    var fibers = [];
    for (var i = 0; i < COUNT; i++) {
      var el = makeFiber();
      var x = Math.random() * 96;
      var y = Math.random() * 92;
      el.classList.add('m-fiber');
      el.style.left = x + '%';
      el.style.top = y + '%';
      el.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
      fibersWrap.appendChild(el);
      var threshold = (x / 96) * 0.65 + (y / 92) * 0.25 + Math.random() * 0.08;
      fibers.push({ el: el, threshold: Math.min(threshold, 0.85) });
    }

    gsap.set(brush, { xPercent: -50, yPercent: -50, left: '8%', top: '14%', scale: 0.7, opacity: 0 });
    gsap.set(statement, { opacity: 0 });

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#mHero',
        start: 'top top',
        end: '+=280%',
        scrub: 0.3,
        pin: true,
        anticipatePin: 1
      }
    });

    tl.to(brush, { opacity: 1, scale: 1, duration: 0.08 }, 0)
      .to(intro, { opacity: 0, duration: 0.1 }, 0.02)
      .to(brush, {
        left: '82%', top: '78%', scale: 1.15, rotate: 18,
        duration: 0.85, ease: 'none'
      }, 0.02);

    fibers.forEach(function (f) {
      tl.to(f.el, { opacity: 0, scale: 0.4, duration: 0.05 }, f.threshold);
    });

    tl.to(brush, { scale: 1.6, left: '50%', top: '46%', rotate: 0, duration: 0.15, ease: 'power2.out' }, 0.82)
      .to(statement, { opacity: 1, duration: 0.2 }, 0.86)
      .add(function () { statement.classList.add('is-active'); }, 0.86);

    /* Recalcule le pin une fois que toutes les images sont réellement
       décodées : évite un mauvais calcul de largeur si ScrollTrigger se
       met en place avant que la mise en page (polices, images) soit stable. */
    var heroImages = document.querySelectorAll('#mHero img');
    var imagePromises = Array.prototype.map.call(heroImages, function (img) {
      if (img.complete) return Promise.resolve();
      return new Promise(function (resolve) {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', resolve, { once: true });
      });
    });
    Promise.all(imagePromises).then(function () {
      requestAnimationFrame(function () { ScrollTrigger.refresh(); });
    });
  }

  if (document.readyState === 'complete') init();
  else window.addEventListener('load', init);
})();
