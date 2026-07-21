/* ==========================================================================
   AQUAVAULT — Expérience d'immersion (scroll cinématique, page d'accueil)
   Pilotée par GSAP + ScrollTrigger. Repli statique sur mobile et
   prefers-reduced-motion : tout le contenu reste visible sans animation de scroll.
   ========================================================================== */
(function () {
  'use strict';

  function makeBubbles(container, count, nearLayer) {
    if (!container) return;
    for (var i = 0; i < count; i++) {
      var b = document.createElement('span');
      b.className = 'bubble';
      var size = nearLayer ? (10 + Math.random() * 14) : (3 + Math.random() * 7);
      b.style.width = size + 'px';
      b.style.height = size + 'px';
      b.style.left = Math.random() * 100 + '%';
      b.style.animationDuration = (nearLayer ? (6 + Math.random() * 5) : (4 + Math.random() * 4)) + 's';
      b.style.animationDelay = (Math.random() * 5) + 's';
      container.appendChild(b);
    }
  }

  function init() {
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isMobile = window.matchMedia('(max-width: 760px)').matches;
    var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

    /* Particules ambiantes à deux vitesses (décor, non liées au scroll) */
    makeBubbles(document.getElementById('diveParticlesFar'), isMobile ? 6 : 11, false);
    makeBubbles(document.getElementById('diveParticlesNear'), isMobile ? 2 : 4, true);

    /* Boutons magnétiques — léger déplacement vers le curseur (desktop uniquement) */
    var canHover = window.matchMedia('(pointer: fine)').matches && !prefersReduced;
    if (canHover) {
      document.querySelectorAll('.dive .btn').forEach(function (btn) {
        btn.classList.add('dive-magnetic');
        btn.addEventListener('mousemove', function (e) {
          var r = btn.getBoundingClientRect();
          var x = (e.clientX - r.left - r.width / 2) * 0.25;
          var y = (e.clientY - r.top - r.height / 2) * 0.35;
          btn.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
        });
        btn.addEventListener('mouseleave', function () {
          btn.style.transform = '';
        });
      });
    }

    if (prefersReduced || isMobile || !hasGsap) {
      document.body.classList.add('dive-static');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    /* ---------- Références ---------- */
    var pinInner = document.querySelector('.dive-pin-inner');
    var bgBright = document.querySelector('.dive-bg-bright');
    var bgDeep = document.querySelector('.dive-bg-deep');
    var vignette = document.querySelector('.dive-vignette');
    var entryWave = document.querySelector('.dive-entry-wave');
    var entrySplash = document.querySelector('.dive-entry-splash');
    var raysFar = document.querySelector('.dive-rays');
    var particlesFar = document.getElementById('diveParticlesFar');
    var particlesNear = document.getElementById('diveParticlesNear');

    var depthLine = document.querySelector('.dive-depth-line');
    var depthFill = document.getElementById('diveDepthFill');
    var depthCursor = document.getElementById('diveDepthCursor');
    var depthMarks = gsap.utils.toArray('.dive-depth-mark');
    var depthMeter = document.querySelector('.dive-depth-meter');
    var depthTravel = depthLine ? depthLine.offsetHeight : 160;

    var pinProduct = document.getElementById('divePinProduct');
    var lines = gsap.utils.toArray('.dive-line');
    var textStack = document.getElementById('diveTextStack');

    var closure = document.getElementById('diveClosure');
    var closureVisual = document.getElementById('diveClosureVisual');
    var closureNums = gsap.utils.toArray('.dive-closure-num');
    var closureSweeps = gsap.utils.toArray('.dive-closure-sweep');

    if (!pinProduct || !closure) return;

    /* ---------- États initiaux ---------- */
    gsap.set(entrySplash, { opacity: 0, scale: 0.5 });
    gsap.set(pinProduct, { opacity: 0, scale: 0.9 });
    gsap.set(lines, { opacity: 0, y: 22, filter: 'blur(8px)' });
    gsap.set(depthFill, { scaleY: 0 });
    gsap.set(depthCursor, { y: 0 });
    gsap.set(closure, { opacity: 0 });
    gsap.set(closureVisual, { opacity: 0, scale: 1.18 });
    gsap.set(closureNums, { borderColor: 'rgba(255,255,255,0.28)', backgroundColor: 'rgba(255,255,255,0)', boxShadow: '0 0 0 rgba(0,212,255,0)' });
    gsap.set(closureSweeps, { xPercent: -220 });

    /* ---------- Timeline principale : entrée → immersion → fermeture ----------
       Le rythme cinématographique vient surtout de la distance de scroll (+=440%),
       pas d'un lissage de scrub excessif : un scrub trop élevé se ressent comme de
       la latence (l'écran répond en retard au geste de scroll). 0.4 reste fluide
       sans donner d'impression de lag. */
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#dive-pin',
        start: 'top top',
        end: '+=440%',
        scrub: 0.4,
        pin: true,
        anticipatePin: 1
      }
    });

    /* Phase 1 — Entrée dans l'eau (0 → 1.2) : vague organique, brève distorsion
       optique (flou) au passage de la surface, éclaboussure subtile */
    tl.fromTo(entryWave, { yPercent: -100 }, { yPercent: 0, duration: 0.42, ease: 'sine.out' }, 0)
      .to(entryWave, { yPercent: 130, opacity: 0, duration: 0.55, ease: 'sine.inOut' }, 0.45)
      .to(entrySplash, { opacity: 0.5, scale: 0.9, duration: 0.35, ease: 'sine.out' }, 0.1)
      .to(entrySplash, { opacity: 0, scale: 1.15, duration: 0.4, ease: 'sine.in' }, 0.42)
      .to(bgBright, { opacity: 0, duration: 0.9, ease: 'sine.inOut' }, 0)
      .fromTo(pinInner, { filter: 'blur(0px)' }, { filter: 'blur(3px)', duration: 0.14, ease: 'sine.in' }, 0.05)
      .to(pinInner, { filter: 'blur(0px)', duration: 0.35, ease: 'sine.out' }, 0.19)
      .to(pinProduct, { opacity: 1, scale: 1, duration: 0.65, ease: 'sine.out' }, 0.4);

    /* Phase 2 — Immersion progressive (1.2 → 6.5)
       Les propriétés continues restent en ease "none" : elles doivent suivre le
       scroll au pixel près, le lissage vient du scrub global, pas d'un easing local. */
    var immersionStart = 1.2, immersionSpan = 5.3, immersionEnd = immersionStart + immersionSpan;
    tl.to(bgDeep, { opacity: 1, duration: immersionSpan, ease: 'none' }, immersionStart)
      .to(vignette, { opacity: 0.5, duration: immersionSpan, ease: 'none' }, immersionStart)
      .to(depthFill, { scaleY: 1, duration: immersionSpan, ease: 'none' }, immersionStart)
      .to(depthCursor, { y: depthTravel, duration: immersionSpan, ease: 'none' }, immersionStart)
      .to(raysFar, { yPercent: 12, duration: immersionSpan, ease: 'none' }, immersionStart)
      .to(particlesFar, { yPercent: 6, duration: immersionSpan, ease: 'none' }, immersionStart)
      .to(particlesNear, { yPercent: -14, duration: immersionSpan, ease: 'none' }, immersionStart)
      .to(pinProduct, { y: 26, rotateZ: 2.4, duration: immersionSpan, ease: 'none' }, immersionStart);

    /* Repères de profondeur : s'illuminent exactement quand le curseur les atteint,
       puis s'estompent progressivement une fois dépassés (jamais présentés comme
       une certification — purs repères visuels) */
    var markTimes = depthMarks.map(function (mark, i) {
      return immersionStart + (i / (depthMarks.length - 1)) * immersionSpan;
    });
    depthMarks.forEach(function (mark, i) {
      tl.to(mark, { color: '#00d4ff', duration: 0.2 }, markTimes[i]);
      if (i < depthMarks.length - 1) {
        tl.to(mark, { opacity: 0.35, duration: 0.35 }, markTimes[i + 1]);
      }
    });

    /* Trois messages qui se succèdent — montée, fondu, flou qui se dissipe */
    tl.to(lines[0], { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.55, ease: 'sine.out' }, 1.6)
      .to(lines[0], { opacity: 0, y: -20, filter: 'blur(8px)', duration: 0.45, ease: 'sine.in' }, 2.9)
      .to(lines[1], { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.55, ease: 'sine.out' }, 3.3)
      .to(lines[1], { opacity: 0, y: -20, filter: 'blur(8px)', duration: 0.45, ease: 'sine.in' }, 4.6)
      .to(lines[2], { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.55, ease: 'sine.out' }, 5.0)
      .to(lines[2], { opacity: 0, y: -20, filter: 'blur(8px)', duration: 0.45, ease: 'sine.in' }, 6.2)
      .to(textStack, { opacity: 0, duration: 0.25 }, immersionEnd)
      .to(depthMeter, { opacity: 0, duration: 0.25 }, immersionEnd);

    /* Phase 3 — Transition vers la scène fermeture (6.5 → 7.2) */
    tl.to(pinProduct, { opacity: 0.25, scale: 0.85, duration: 0.55, ease: 'sine.inOut' }, immersionEnd + 0.1)
      .to(closureVisual, { opacity: 1, scale: 1, duration: 0.6, ease: 'sine.out' }, immersionEnd + 0.3)
      .to(closure, { opacity: 1, duration: 0.5, ease: 'sine.out' }, immersionEnd + 0.3);

    /* Phase 4 — Fermeture : chaque étape synchronise son propre incrément de zoom,
       un renforcement lumineux et une très légère vibration au verrouillage */
    var closureStart = immersionEnd + 0.7;
    closureNums.forEach(function (num, i) {
      var t = closureStart + i * 0.85;
      var targetScale = 1 + (i + 1) * 0.045;
      tl.to(closureVisual, { scale: targetScale, duration: 0.5, ease: 'sine.out' }, t)
        .to(closureSweeps[i], { xPercent: 220, duration: 0.5, ease: 'power1.inOut' }, t)
        .to(num, {
          borderColor: '#00d4ff',
          backgroundColor: 'rgba(0,212,255,0.16)',
          boxShadow: '0 0 30px 4px rgba(0,212,255,0.55)',
          duration: 0.3
        }, t)
        .to(num, { keyframes: [{ x: -2 }, { x: 2 }, { x: -1.2 }, { x: 1.2 }, { x: 0 }], duration: 0.22, ease: 'power1.inOut' }, t);
    });

    /* ---------- Cartes d'usage (scène 4) ---------- */
    gsap.utils.toArray('.dive-usage-card').forEach(function (card, i) {
      gsap.fromTo(card, { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', clearProps: 'transform',
        scrollTrigger: { trigger: card, start: 'top 85%' },
        delay: i * 0.08
      });
    });

    /* ---------- Retour à la surface (scène 5) : séquence jouée une fois ---------- */
    var resurfaceVisual = document.getElementById('diveResurfaceVisual');
    var resurfaceInfo = document.getElementById('diveResurfaceInfo');
    var resurfacePrice = document.getElementById('diveResurfacePrice');
    var resurfaceRays = document.querySelector('.dive-resurface-rays');
    var droplets = gsap.utils.toArray('.dive-droplet');

    if (resurfaceVisual && resurfaceInfo && resurfacePrice) {
      gsap.set(resurfaceVisual, { opacity: 0, y: 60 });
      gsap.set(resurfaceInfo, { opacity: 0, y: 30 });
      gsap.set(resurfacePrice, { opacity: 0, y: 20 });
      gsap.set(resurfaceRays, { opacity: 0 });
      gsap.set(droplets, { opacity: 0, y: -10 });

      /* Quelques bulles résiduelles qui s'estompent pendant la remontée
         (mêmes bulles CSS que dans le pin, injectées dans la scène 5 existante —
         aucune nouvelle section, juste un décor éphémère qui se dissipe) */
      var resurfaceSection = document.getElementById('dive-resurface');
      var resurfaceBubbles = null;
      if (resurfaceSection) {
        resurfaceBubbles = document.createElement('div');
        resurfaceBubbles.className = 'dive-particles dive-resurface-bubbles';
        resurfaceSection.insertBefore(resurfaceBubbles, resurfaceSection.firstChild);
        makeBubbles(resurfaceBubbles, 6, false);
        gsap.set(resurfaceBubbles, { opacity: 0.55 });
      }

      /* Rythme cohérent avec le reste du parcours : la pochette remonte et se
         stabilise avant que quoi que ce soit d'autre n'apparaisse ; le bouton
         d'achat n'arrive qu'en tout dernier. */
      gsap.timeline({
        scrollTrigger: { trigger: '#dive-resurface', start: 'top 70%', toggleActions: 'play none none none' }
      })
        .to(resurfaceRays, { opacity: 1, duration: 1.3, ease: 'sine.out' })
        .to(resurfaceVisual, { opacity: 1, y: 0, duration: 1.3, ease: 'power2.out' }, '<')
        .to(droplets, { opacity: 1, y: 24, duration: 1.2, stagger: 0.15, ease: 'sine.out' }, '-=0.7')
        .to(resurfaceBubbles, { opacity: 0, duration: 1.6, ease: 'sine.in' }, '-=0.9')
        .to(resurfaceInfo, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, '-=0.7')
        .fromTo(resurfacePrice, { opacity: 0, y: 20, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: 'power2.out' }, '+=0.2');
    }

    /* ---------- Performance : recalcule les positions une fois que toutes les
       images sont réellement décodées (évite tout saut/espace vide de ScrollTrigger
       si une image finit de charger après la mise en place des triggers) ---------- */
    var diveImages = document.querySelectorAll('.dive img');
    var imagePromises = Array.prototype.map.call(diveImages, function (img) {
      if (img.complete) return Promise.resolve();
      return new Promise(function (resolve) {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', resolve, { once: true });
      });
    });
    Promise.all(imagePromises).then(function () {
      ScrollTrigger.refresh();
    });
  }

  /* On attend le chargement complet (y compris les scripts GSAP en CDN)
     avant d'initialiser, pour éviter toute course au chargement. */
  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }
})();
