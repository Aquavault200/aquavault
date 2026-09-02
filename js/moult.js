/* ==========================================================================
   FURSWEEP — Séquence de nettoyage au scroll (chaos → propre) + interactions
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

  /* ---------- Séquence héro : le tapis couvert de poils, nettoyé en deux passes ---------- */
  var HAIR_COLORS = [
    'rgba(24,18,13,A)',    /* poil foncé */
    'rgba(120,98,76,A)',   /* poil brun clair */
    'rgba(214,198,176,A)', /* poil clair/blond */
    'rgba(70,58,46,A)'     /* poil brun moyen */
  ];

  function init() {
    var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

    if (prefersReduced || !hasGsap) {
      document.body.classList.add('m-static');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    var canvas = document.getElementById('mHairCanvas');
    var brush = document.getElementById('mBrush');
    var statement = document.getElementById('mHeroStatement');
    var carpet = document.getElementById('mCarpet');
    if (!canvas || !brush || !statement) return;

    /* La toute première mesure que ScrollTrigger fait d'un élément fixé peut
       lire 0x0 si elle a lieu avant que la mise en page soit réellement
       stable (police, images) — et un simple refresh() ne suffit pas à
       effacer ce mauvais calcul une fois qu'il a été figé dans le style
       inline. On retarde donc la création du pin de deux frames, pour être
       certain qu'un cycle de rendu complet a eu lieu avant la première mesure. */
    requestAnimationFrame(function () {
      requestAnimationFrame(setupHero);
    });

    function setupHero() {
      var vw = window.innerWidth, vh = window.innerHeight;
      var ctx = canvas.getContext('2d');
      var DPR = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = vw * DPR;
      canvas.height = vh * DPR;
      canvas.style.width = vw + 'px';
      canvas.style.height = vh + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      /* Masque de nettoyage : canvas basse résolution jamais effacé pendant
         la séquence — une zone une fois "passée" par la brosse reste propre. */
      var maskW = 220, maskH = 130;
      var maskCanvas = document.createElement('canvas');
      maskCanvas.width = maskW; maskCanvas.height = maskH;
      var maskCtx = maskCanvas.getContext('2d');
      maskCtx.fillStyle = '#000';
      maskCtx.fillRect(0, 0, maskW, maskH);

      /* Des centaines de poils : longueurs, courbures, épaisseurs et teintes
         variées, mélangés à quelques petits amas, pour un vrai effet "tapis
         envahi" plutôt que quelques traits décoratifs. */
      var hairs = [];
      function addHair(x, y) {
        var len = 9 + Math.random() * Math.random() * 42;
        var ang = Math.random() * Math.PI * 2;
        var color = HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)];
        var alpha = (0.5 + Math.random() * 0.42).toFixed(2);
        hairs.push({
          x: x, y: y, len: len, ang: ang,
          curve: (Math.random() - 0.5) * 20,
          color: color.replace('A', alpha),
          w: 0.7 + Math.random() * 1.2
        });
      }
      var HAIR_COUNT = 380;
      for (var i = 0; i < HAIR_COUNT; i++) addHair(Math.random() * vw, Math.random() * vh);
      var CLUSTERS = 26;
      for (var c = 0; c < CLUSTERS; c++) {
        var ccx = Math.random() * vw, ccy = Math.random() * vh;
        var size = 4 + Math.floor(Math.random() * 5);
        for (var k = 0; k < size; k++) {
          addHair(ccx + (Math.random() - 0.5) * 34, ccy + (Math.random() - 0.5) * 34);
        }
      }

      function drawHair(h) {
        var x2 = h.x + Math.cos(h.ang) * h.len;
        var y2 = h.y + Math.sin(h.ang) * h.len;
        var mx = (h.x + x2) / 2 - Math.sin(h.ang) * h.curve;
        var my = (h.y + y2) / 2 + Math.cos(h.ang) * h.curve;
        ctx.strokeStyle = h.color;
        ctx.lineWidth = h.w;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(h.x, h.y);
        ctx.quadraticCurveTo(mx, my, x2, y2);
        ctx.stroke();
      }

      var maskData = null;
      function isCleaned(x, y) {
        if (!maskData) return false;
        var mx = (x / vw) * maskW | 0;
        var my = (y / vh) * maskH | 0;
        if (mx < 0 || my < 0 || mx >= maskW || my >= maskH) return false;
        return maskData[(my * maskW + mx) * 4] > 40;
      }
      function redrawHairs() {
        maskData = maskCtx.getImageData(0, 0, maskW, maskH).data;
        ctx.clearRect(0, 0, vw, vh);
        for (var j = 0; j < hairs.length; j++) {
          if (!isCleaned(hairs[j].x, hairs[j].y)) drawHair(hairs[j]);
        }
      }
      redrawHairs();

      /* Peint le passage de la brosse dans le masque, en interpolant depuis
         la dernière position pour ne jamais laisser de trou si le scroll
         avance vite entre deux mises à jour. */
      var lastMaskPos = null;
      function paintClean(x, y, radius) {
        var mx = (x / vw) * maskW, my = (y / vh) * maskH;
        var mr = (radius / vw) * maskW;
        maskCtx.fillStyle = '#fff';
        if (lastMaskPos) {
          var steps = Math.max(1, Math.ceil(Math.hypot(mx - lastMaskPos.x, my - lastMaskPos.y) / (mr * 0.5)));
          for (var s = 0; s <= steps; s++) {
            var t = s / steps;
            var ix = lastMaskPos.x + (mx - lastMaskPos.x) * t;
            var iy = lastMaskPos.y + (my - lastMaskPos.y) * t;
            maskCtx.beginPath(); maskCtx.arc(ix, iy, mr, 0, Math.PI * 2); maskCtx.fill();
          }
        } else {
          maskCtx.beginPath(); maskCtx.arc(mx, my, mr, 0, Math.PI * 2); maskCtx.fill();
        }
        lastMaskPos = { x: mx, y: my };
      }

      /* ---------- Trajet physique de la brosse (deux passes) ---------- */
      gsap.set(brush, { opacity: 0 });
      gsap.set(statement, { opacity: 0 });

      var state = { x: -12, y: 22, rot: -22, scale: 0.9 };
      function applyBrush() {
        brush.style.left = state.x + '%';
        brush.style.top = state.y + '%';
        brush.style.transform = 'translate(-50%,-68%) rotate(' + state.rot.toFixed(1) + 'deg) scale(' + state.scale.toFixed(2) + ')';
        /* Point de contact réel : la tête métallique, vers le haut du dessin. */
        var px = (state.x / 100) * vw;
        var py = (state.y / 100) * vh - (brush.offsetHeight * state.scale * 0.28);
        paintClean(px, py, vw * 0.115);
        redrawHairs();
      }

      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#mHeroPin',
          start: 'top top',
          end: '+=340%',
          scrub: 0.35,
          pin: true,
          anticipatePin: 1
        },
        onUpdate: applyBrush
      });

      tl.to(brush, { opacity: 1, duration: 0.03 }, 0)
        .to(state, { x: 10, y: 20, rot: -8, scale: 1, duration: 0.05 }, 0.02)
        /* Passe 1 : diagonale haut-gauche vers centre-bas-droite. */
        .to(state, { x: 76, y: 64, rot: 24, scale: 1.05, duration: 0.36, ease: 'none' }, 0.07)
        /* Repositionnement bref, la brosse se relève et se replace. */
        .to(state, { x: 94, y: 16, rot: -32, scale: 0.92, duration: 0.09, ease: 'power1.inOut' }, 0.43)
        /* Passe 2 : diagonale haut-droite vers bas-gauche, couvre le reste. */
        .to(state, { x: 4, y: 90, rot: -12, scale: 1.12, duration: 0.37, ease: 'none' }, 0.53)
        /* La brosse se stabilise, repos élégant au centre. */
        .to(state, { x: 50, y: 60, rot: 5, scale: 1.35, duration: 0.13, ease: 'power2.out' }, 0.91)
        .to(statement, { opacity: 1, duration: 0.14 }, 0.93)
        .add(function () { statement.classList.add('is-active'); }, 0.93)
        /* Le tapis s'efface pour laisser place au reste du site, en continu. */
        .to(carpet, { opacity: 0, duration: 0.09 }, 0.94)
        .to(canvas, { opacity: 0, duration: 0.09 }, 0.94);
    }
  }

  if (document.readyState === 'complete') init();
  else window.addEventListener('load', init);
})();
