/* ==========================================================================
   AQUAVAULT — Comportements fiche produit
   Aucune logique de panier, de prix ou de paiement n'est simulée ici :
   ces responsabilités reviennent entièrement au Shopify Buy Button une fois
   intégré dans le conteneur [data-shopify-buy-button]. Voir README.md.
   ========================================================================== */
(function () {
  'use strict';

  /* Swatches couleur (aperçu visuel — correspondra aux variantes Shopify) */
  document.querySelectorAll('[data-color]').forEach(function (el) {
    el.addEventListener('click', function () {
      document.querySelectorAll('[data-color]').forEach(function (s) { s.classList.remove('is-active'); });
      el.classList.add('is-active');
      var color = el.getAttribute('data-color');
      var label = document.querySelector('[data-color-label]');
      var names = { ocean: 'Bleu Océan', black: 'Noir Abysse', white: 'Blanc Écume', coral: 'Corail' };
      if (label) label.textContent = names[color] || color;
    });
  });

  /* Sélecteur de quantité — la valeur est exposée via #buyButtonQuantity
     pour être lue par l'intégration Shopify Buy Button (voir README.md) */
  var qtyInput = document.querySelector('[data-qty-input]');
  var MIN_QTY = 1, MAX_QTY = 10;

  function setQty(v) {
    var clamped = Math.min(MAX_QTY, Math.max(MIN_QTY, v));
    if (qtyInput) qtyInput.value = clamped;
    return clamped;
  }

  document.querySelectorAll('[data-qty-minus]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setQty((parseInt(qtyInput.value, 10) || MIN_QTY) - 1);
    });
  });
  document.querySelectorAll('[data-qty-plus]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setQty((parseInt(qtyInput.value, 10) || MIN_QTY) + 1);
    });
  });
  if (qtyInput) {
    qtyInput.addEventListener('change', function () {
      setQty(parseInt(qtyInput.value, 10) || MIN_QTY);
    });
  }

  /* Galerie miniatures — change la photo principale */
  var galleryMainImg = document.getElementById('galleryMainImg');
  document.querySelectorAll('[data-thumb]').forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      document.querySelectorAll('[data-thumb]').forEach(function (t) { t.classList.remove('is-active'); });
      thumb.classList.add('is-active');
      var full = thumb.getAttribute('data-full');
      if (full && galleryMainImg) {
        galleryMainImg.style.opacity = '0';
        setTimeout(function () {
          galleryMainImg.src = full;
          galleryMainImg.style.opacity = '1';
        }, 150);
      }
    });
  });

  /* Barre sticky : apparaît quand l'emplacement du Buy Button sort de l'écran,
     et propose un lien de retour vers cet emplacement (aucun ajout panier ici) */
  var stickyBar = document.querySelector('[data-sticky-atc]');
  var buyButtonSlot = document.querySelector('[data-shopify-buy-button]');
  if (stickyBar && buyButtonSlot && 'IntersectionObserver' in window) {
    var atcIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        stickyBar.classList.toggle('is-visible', !entry.isIntersecting && entry.boundingClientRect.top < 0);
      });
    }, { threshold: 0 });
    atcIO.observe(buyButtonSlot);
  }
  document.querySelectorAll('[data-scroll-to-buy-button]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (buyButtonSlot) buyButtonSlot.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  /* Filtres avis */
  document.querySelectorAll('[data-review-filter]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('[data-review-filter]').forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      var filter = btn.getAttribute('data-review-filter');
      document.querySelectorAll('[data-review-item]').forEach(function (item) {
        var rating = item.getAttribute('data-rating');
        item.style.display = (filter === 'all' || filter === rating) ? '' : 'none';
      });
    });
  });

  /* Charger plus d'avis */
  var loadMoreBtn = document.querySelector('[data-load-more-reviews]');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function () {
      document.querySelectorAll('[data-review-hidden]').forEach(function (item) {
        item.removeAttribute('data-review-hidden');
        item.style.display = '';
      });
      loadMoreBtn.style.display = 'none';
    });
  }
})();
