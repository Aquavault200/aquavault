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

  /* ---------- Boutons magnétiques (souris fine uniquement) ----------
     Le bouton suit légèrement le curseur à l'approche, puis revient à sa
     place avec un léger dépassement élastique — un contact tactile discret,
     pas un gadget. Rayon d'action limité à sa propre taille pour rester
     subtil et ne jamais gêner le clic. */
  if (canFineCursor) {
    document.querySelectorAll('.m-btn, .m-cta').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.35;
        var y = (e.clientY - r.top - r.height / 2) * 0.45;
        btn.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  /* ---------- Comparateur avant/après ----------
     Se glisse tout seul (aller-retour doux) pour montrer l'effet sans que
     le client ait à agir — dès qu'il touche/clique, la démo s'arrête
     définitivement et il garde la main. */
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

    var autoplay = !prefersReduced;
    var raf = null;
    function loop(ts) {
      if (!autoplay) return;
      var pct = 50 + Math.sin(ts / 1700) * 32;
      setPos(pct);
      raf = requestAnimationFrame(loop);
    }
    function stopAutoplay() {
      if (!autoplay) return;
      autoplay = false;
      if (raf) cancelAnimationFrame(raf);
    }
    if (autoplay && 'IntersectionObserver' in window) {
      var ioAuto = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!autoplay) return;
          if (entry.isIntersecting && !raf) raf = requestAnimationFrame(loop);
          else if (!entry.isIntersecting && raf) { cancelAnimationFrame(raf); raf = null; }
        });
      }, { threshold: 0.35 });
      ioAuto.observe(compare);
    } else {
      setPos(50);
    }

    var dragging = false;
    compare.addEventListener('pointerdown', function (e) { stopAutoplay(); dragging = true; fromClientX(e.clientX); });
    window.addEventListener('pointermove', function (e) { if (dragging) fromClientX(e.clientX); });
    window.addEventListener('pointerup', function () { dragging = false; });
  });

  /* ---------- Séquence héro : le tapis couvert de poils, nettoyé en deux passes ---------- */
  /* Tapis clair (gris-beige) : la palette est volontairement assombrie et
     resserrée pour que chaque poil reste net et lisible dessus — plus de
     tons proches du blanc qui s'y noient. */
  var HAIR_COLORS = [
    'rgba(12,9,6,A)',      /* quasi noir */
    'rgba(12,9,6,A)',
    'rgba(46,34,22,A)',    /* brun très foncé */
    'rgba(46,34,22,A)',
    'rgba(94,74,52,A)',    /* brun moyen */
    'rgba(128,112,92,A)'   /* gris-brun, le plus clair de la gamme */
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
      /* Si la fenêtre n'est pas encore mesurable (0x0, par ex. un onglet pas
         encore affiché), on retente un peu plus tard plutôt que de figer un
         canvas cassé pour toute la session. */
      if (!vw || !vh) {
        setTimeout(function () { requestAnimationFrame(setupHero); }, 150);
        return;
      }
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
      var maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true });
      maskCtx.fillStyle = '#000';
      maskCtx.fillRect(0, 0, maskW, maskH);

      /* Système de poils à 4 types, mélangés, pour un vrai effet "amas de
         poils accumulés" plutôt que des lignes décoratives isolées :
         A) brins individuels fins  B) petits amas de fibres emmêlées
         C) touffes/nuages flous plus larges (bords doux, centre dense)
         D) fibres fines quasi invisibles, incrustées près du tapis. */
      var hairs = [];
      function addStrand(x, y, opts) {
        opts = opts || {};
        var len = opts.len || (11 + Math.random() * Math.random() * 50);
        var ang = Math.random() * Math.PI * 2;
        var color = HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)];
        var alpha = opts.alpha != null ? opts.alpha : (0.6 + Math.random() * 0.35);
        hairs.push({
          type: 'strand', x: x, y: y, len: len, ang: ang,
          curve: (Math.random() - 0.5) * (opts.curveRange || 22),
          color: color.replace('A', alpha.toFixed(2)),
          w: opts.w || (1.0 + Math.random() * 1.6),
          shadow: opts.shadow !== false
        });
      }
      function addTuft(x, y) {
        var r = 15 + Math.random() * 26;
        var blobCount = 3 + Math.floor(Math.random() * 3);
        var blobs = [];
        for (var b = 0; b < blobCount; b++) {
          blobs.push({
            dx: (Math.random() - 0.5) * r * 0.85,
            dy: (Math.random() - 0.5) * r * 0.65,
            r: r * (0.55 + Math.random() * 0.5)
          });
        }
        /* Même sur ce tapis clair, les touffes restent nettement plus foncées
           que le fond pour qu'on les distingue sans effort. */
        var tone = Math.random() > 0.6 ? '140,124,104' : '42,32,22';
        hairs.push({ type: 'tuft', x: x, y: y, blobs: blobs, tone: tone, alpha: 0.55 + Math.random() * 0.25 });
        var escapes = 2 + Math.floor(Math.random() * 4);
        for (var e = 0; e < escapes; e++) {
          var eang = Math.random() * Math.PI * 2;
          addStrand(x + Math.cos(eang) * r * 0.55, y + Math.sin(eang) * r * 0.55,
            { len: 9 + Math.random() * 20, w: 0.8 + Math.random() * 0.9, curveRange: 14 });
        }
      }

      /* A — brins individuels */
      for (var i = 0; i < 210; i++) addStrand(Math.random() * vw, Math.random() * vh);
      /* B — petits amas de fibres emmêlées */
      for (var c = 0; c < 34; c++) {
        var ccx = Math.random() * vw, ccy = Math.random() * vh;
        var size = 6 + Math.floor(Math.random() * 9);
        for (var k = 0; k < size; k++) {
          addStrand(ccx + (Math.random() - 0.5) * 26, ccy + (Math.random() - 0.5) * 26, { curveRange: 26 });
        }
      }
      /* C — touffes / nuages flous */
      for (var t = 0; t < 30; t++) addTuft(Math.random() * vw, Math.random() * vh);
      /* D — fibres fines incrustées, presque invisibles, pour la densité de fond */
      for (var d = 0; d < 260; d++) {
        addStrand(Math.random() * vw, Math.random() * vh, { len: 5 + Math.random() * 10, w: 0.5 + Math.random() * 0.5, alpha: 0.22 + Math.random() * 0.18, shadow: false });
      }

      function drawStrand(h) {
        var x2 = h.x + Math.cos(h.ang) * h.len;
        var y2 = h.y + Math.sin(h.ang) * h.len;
        var mx = (h.x + x2) / 2 - Math.sin(h.ang) * h.curve;
        var my = (h.y + y2) / 2 + Math.cos(h.ang) * h.curve;
        if (h.shadow) {
          ctx.strokeStyle = 'rgba(10,7,4,0.4)';
          ctx.lineWidth = h.w + 1;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(h.x + 0.6, h.y + 0.8);
          ctx.quadraticCurveTo(mx + 0.6, my + 0.8, x2 + 0.6, y2 + 0.8);
          ctx.stroke();
        }
        ctx.strokeStyle = h.color;
        ctx.lineWidth = h.w;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(h.x, h.y);
        ctx.quadraticCurveTo(mx, my, x2, y2);
        ctx.stroke();
      }
      function drawTuft(h) {
        for (var bi = 0; bi < h.blobs.length; bi++) {
          var b = h.blobs[bi];
          var cx = h.x + b.dx, cy = h.y + b.dy;
          var grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, b.r);
          grad.addColorStop(0, 'rgba(' + h.tone + ',' + h.alpha + ')');
          grad.addColorStop(0.55, 'rgba(' + h.tone + ',' + (h.alpha * 0.5).toFixed(2) + ')');
          grad.addColorStop(1, 'rgba(' + h.tone + ',0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, b.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      function drawHairObj(h) { if (h.type === 'tuft') drawTuft(h); else drawStrand(h); }

      var maskData = null;
      function isCleaned(x, y) {
        if (!maskData) return false;
        var mx = (x / vw) * maskW | 0;
        var my = (y / vh) * maskH | 0;
        if (mx < 0 || my < 0 || mx >= maskW || my >= maskH) return false;
        return maskData[(my * maskW + mx) * 4] > 40;
      }
      function redrawHairs(headX, headY, active) {
        maskData = maskCtx.getImageData(0, 0, maskW, maskH).data;
        ctx.clearRect(0, 0, vw, vh);
        for (var j = 0; j < hairs.length; j++) {
          if (!isCleaned(hairs[j].x, hairs[j].y)) drawHairObj(hairs[j]);
        }
        if (headX != null) {
          /* Ombre de contact + léger tassement des fibres sous la tête. */
          var shadow = ctx.createRadialGradient(headX, headY, 0, headX, headY, vw * 0.075);
          shadow.addColorStop(0, 'rgba(8,6,4,0.32)');
          shadow.addColorStop(0.7, 'rgba(8,6,4,0.12)');
          shadow.addColorStop(1, 'rgba(8,6,4,0)');
          ctx.fillStyle = shadow;
          ctx.beginPath(); ctx.arc(headX, headY, vw * 0.075, 0, Math.PI * 2); ctx.fill();

          /* Un peu de poil collecté qui reste accroché à la tête pendant
             qu'elle nettoie — juste assez pour suggérer la collecte, pas un tas. */
          if (active) {
            drawTuft({ x: headX, y: headY - vw * 0.01, blobs: [
              { dx: -6, dy: 0, r: vw * 0.018 },
              { dx: 5, dy: -3, r: vw * 0.015 },
              { dx: 0, dy: 4, r: vw * 0.02 }
            ], tone: '235,229,218', alpha: 0.55 });
          }
        }
      }
      redrawHairs();

      /* Trajet nettoyé mémorisé comme une trace (progression, position), pas
         comme un masque qui ne s'efface jamais : en remontant le scroll, on
         retire les points au-delà de la progression courante et on repeint
         le masque en entier depuis le début du trajet — le poil réapparaît
         exactement là où la brosse n'est plus encore passée. */
      var trail = [];
      function stampMaskCircle(mx, my, mr) {
        maskCtx.beginPath(); maskCtx.arc(mx, my, mr, 0, Math.PI * 2); maskCtx.fill();
      }
      function stampMaskSegment(a, b) {
        var steps = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / (b.r * 0.5)));
        for (var s = 0; s <= steps; s++) {
          var t = s / steps;
          stampMaskCircle(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, b.r);
        }
      }
      function rebuildMask() {
        maskCtx.fillStyle = '#000';
        maskCtx.fillRect(0, 0, maskW, maskH);
        maskCtx.fillStyle = '#fff';
        for (var i = 0; i < trail.length; i++) {
          if (i === 0) stampMaskCircle(trail[i].x, trail[i].y, trail[i].r);
          else stampMaskSegment(trail[i - 1], trail[i]);
        }
      }
      function paintClean(x, y, radius, progress) {
        var mx = (x / vw) * maskW, my = (y / vh) * maskH;
        var mr = (radius / vw) * maskW;
        var point = { p: progress, x: mx, y: my, r: mr };
        /* Remonte le scroll : on efface la queue de la trace au-delà d'ici. */
        while (trail.length && trail[trail.length - 1].p > progress) trail.pop();
        var last = trail[trail.length - 1];
        if (!last || progress - last.p > 0.0015) trail.push(point);
        else { last.x = mx; last.y = my; last.r = mr; }
        rebuildMask();
      }

      /* ---------- Modèle 3D (Three.js) du produit ---------- */
      var brushCanvas = document.getElementById('mBrushCanvas');
      var fs3d = (window.FurSweep3D && brushCanvas) ? window.FurSweep3D.init(brushCanvas) : null;

      /* ---------- Trajet physique de la brosse : une seule chute verticale,
         de haut en bas, taille quasi plein écran. ---------- */
      gsap.set(brush, { opacity: 0 });
      gsap.set(statement, { opacity: 0 });

      var state = { x: 50, y: -18, rot: -5, scale: 0.86 };
      function applyBrush() {
        brush.style.left = state.x + '%';
        brush.style.top = state.y + '%';
        /* La rotation vit désormais dans le rendu 3D lui-même (rotation réelle
           du modèle, pas une rotation 2D du canvas) — le conteneur ne fait
           plus que se positionner et se dimensionner. */
        brush.style.transform = 'translate(-50%,-68%) scale(' + state.scale.toFixed(2) + ')';
        var tilt = Math.max(-1, Math.min(1, (state.x - 50) / 55));
        if (fs3d) fs3d.update(state.rot, tilt);

        /* Point de contact réel : la tête métallique, vers le haut du dessin. */
        var px = (state.x / 100) * vw;
        var py = (state.y / 100) * vh - (brush.offsetHeight * state.scale * 0.3);
        /* Important : tl.progress() (position de lecture de la timeline,
           celle qui pilote réellement state.x/y) — PAS
           tl.scrollTrigger.progress (la cible brute du scroll, qui saute
           instantanément à sa valeur finale dès que le scroll s'arrête,
           avant que le rattrapage du scrub n'ait fini d'animer state.x/y).
           Utiliser cette dernière ici désynchronise la trace de la position
           réelle de la brosse : chaque appel pendant le rattrapage se voit
           taguer la même progression finale alors que px/py bougent encore,
           donc chaque point écrase le précédent au lieu de tracer le trajet. */
        var progress = tl.progress();
        var activePass = progress > 0.03 && progress < 0.44;
        /* Le rayon nettoyé doit suivre la largeur réelle affichée de la
           brosse (désormais quasi plein écran) — sinon, avec un rayon fixe
           trop petit, l'essentiel du passage visuel de la brosse ne nettoie
           rien et les poils semblent ne jamais disparaître. */
        var cleanRadius = brush.offsetWidth * state.scale * 0.42;
        /* On ne fait évoluer la trace que pendant la chute réelle (avant que
           la brosse ne quitte l'écran et que son état ne se fige) — au-delà,
           rien à ajouter ni à retirer. */
        if (progress > 0.01 && progress < 0.45) paintClean(px, py, cleanRadius, progress);
        redrawHairs(px, py, activePass);
      }

      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#mHeroPin',
          start: 'top top',
          /* La chute (0→~45%) garde exactement la même durée en pixels
             qu'avant — seul le palier final s'allonge, pour laisser au
             client le temps de voir et cliquer "Se procurer" plutôt que de
             l'avoir sous les yeux une fraction de seconde avant que tout
             s'efface. */
          end: '+=220%',
          scrub: 0.3,
          pin: true,
          anticipatePin: 1
        },
        onUpdate: applyBrush
      });

      tl.to(brush, { opacity: 1, duration: 0.03 }, 0)
        /* Chute verticale unique, légère oscillation latérale pour un mouvement
           naturel plutôt qu'une ligne droite mécanique — mais toujours,
           essentiellement, de haut en bas. */
        .to(state, { x: 45, y: 32, rot: 4, scale: 1.0, duration: 0.145, ease: 'power1.in' }, 0.03)
        .to(state, { x: 56, y: 64, rot: -3, scale: 1.08, duration: 0.16, ease: 'none' }, 0.175)
        .to(state, { x: 50, y: 100, rot: 2, scale: 1.16, duration: 0.115, ease: 'power2.in' }, 0.335)
        /* La brosse quitte l'écran par le bas, sort de scène. */
        .to(brush, { opacity: 0, duration: 0.03 }, 0.45)
        .to(statement, { opacity: 1, duration: 0.07 }, 0.48)
        .add(function () { statement.classList.add('is-active'); }, 0.48)
        /* Palier : le bouton "Se procurer" reste pleinement visible et
           cliquable sur une longue portion de scroll (~0.55 à 0.88, soit
           plus de 70% de la hauteur d'écran) au lieu d'un aperçu éclair. */
        .to(statement, { opacity: 0, duration: 0.05 }, 0.9)
        /* Vraie transition : le héro s'efface pendant que la section suivante
           monte et apparaît en fondu, au lieu d'une coupure franche. */
        .to(carpet, { opacity: 0, duration: 0.11 }, 0.88)
        .to(canvas, { opacity: 0, duration: 0.11 }, 0.88);

      /* ---------- Transition héro → section suivante ----------
         Créée ici (après le pin) et non plus tôt dans init() : le pin insère
         un pin-spacer qui repousse toute la suite du document. Mesurer la
         position de la section suivante avant que ce spacer existe donne des
         valeurs start/end obsolètes, décalées d'autant que le pin ajoute de
         hauteur — même piège que la mesure 0×0 du pin lui-même. Une fois le
         pin créé, la position réelle est correcte : la transition est un
         vrai fondu scrubbed, lié au scroll, pas une coupure nette. */
      var nextSection = document.getElementById('comment-ca-marche');
      /* On anime/déclenche sur le contenu réellement visible (le titre +
         comparateur), pas sur la section englobante : celle-ci a ~160px de
         padding avant le premier pixel utile, donc un déclencheur basé sur
         la section se retrouvait "complet" (opacity proche de 1) alors que
         tout le contenu était encore sous le bas de l'écran — un vrai trou
         vide, pas juste une impression. */
      var nextContent = nextSection ? nextSection.querySelector('.m-gesture-head') : null;
      if (nextSection && nextContent) {
        gsap.set(nextContent, { opacity: 0, y: 60 });
        gsap.to(nextContent, {
          opacity: 1, y: 0, ease: 'none',
          scrollTrigger: {
            trigger: nextContent,
            /* Démarre bien avant que la section soit visible (encore
               cachée derrière le héro pinné) : le fondu recouvre ainsi tout
               l'effacement du tapis, sans le trou mort où l'écran reste
               vide entre la fin du héro et le début de l'apparition. */
            start: 'top bottom+=330',
            end: 'top 55%',
            scrub: 0.4
          }
        });
      }
    }
  }

  if (document.readyState === 'complete') init();
  else window.addEventListener('load', init);
})();
