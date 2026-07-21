/* ==========================================================================
   AQUAVAULT — Sprite d'icônes SVG (style ligne, minimal)
   Injecté une seule fois dans le DOM ; utilisation : <svg class="icon"><use href="#icon-NOM"/></svg>
   ========================================================================== */
(function () {
  var sprite = document.createElement('div');
  sprite.setAttribute('aria-hidden', 'true');
  sprite.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;';
  sprite.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg">
    <defs>
      <g id="icon-defs" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></g>
    </defs>

    <symbol id="icon-droplet" viewBox="0 0 24 24"><path stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M12 2.5c4 5 7 8.6 7 12.5a7 7 0 1 1-14 0c0-3.9 3-7.5 7-12.5Z"/></symbol>

    <symbol id="icon-shield-check" viewBox="0 0 24 24"><path stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M12 2.5 4.5 5.5v6c0 5 3.2 8.4 7.5 10 4.3-1.6 7.5-5 7.5-10v-6L12 2.5Z M9 12l2.2 2.2L15.5 9.7"/></symbol>

    <symbol id="icon-waves" viewBox="0 0 24 24"><path stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M2 8c1.6-1.6 3.4-1.6 5 0s3.4 1.6 5 0 3.4-1.6 5 0 3.4 1.6 5 0 M2 14c1.6-1.6 3.4-1.6 5 0s3.4 1.6 5 0 3.4-1.6 5 0 3.4 1.6 5 0 M2 20c1.6-1.6 3.4-1.6 5 0s3.4 1.6 5 0 3.4-1.6 5 0 3.4 1.6 5 0"/></symbol>

    <symbol id="icon-smartphone" viewBox="0 0 24 24"><rect x="7" y="2.5" width="10" height="19" rx="2.4" stroke="currentColor" fill="none" stroke-width="1.8"/><line x1="11" y1="18.3" x2="13" y2="18.3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></symbol>

    <symbol id="icon-check" viewBox="0 0 24 24"><path stroke="currentColor" fill="none" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" d="M4 12.5 9.5 18 20 6"/></symbol>

    <symbol id="icon-star" viewBox="0 0 24 24"><path d="M12 2.6 15 9l6.9.8-5.1 4.8 1.4 6.9L12 18l-6.2 3.5 1.4-6.9L2 9.8 8.9 9 12 2.6Z"/></symbol>

    <symbol id="icon-truck" viewBox="0 0 24 24"><path stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M2 6h11v10H2z M13 10h4l4 3.2V16h-8z"/><circle cx="6.5" cy="18.5" r="1.8" stroke="currentColor" fill="none" stroke-width="1.8"/><circle cx="16.5" cy="18.5" r="1.8" stroke="currentColor" fill="none" stroke-width="1.8"/></symbol>

    <symbol id="icon-lock" viewBox="0 0 24 24"><rect x="4.5" y="10.5" width="15" height="10" rx="2" stroke="currentColor" fill="none" stroke-width="1.8"/><path stroke="currentColor" fill="none" stroke-width="1.8" d="M7.5 10.5V7a4.5 4.5 0 0 1 9 0v3.5"/></symbol>

    <symbol id="icon-refresh" viewBox="0 0 24 24"><path stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M20 11a8 8 0 0 0-14.6-4.4M4 5v5h5 M4 13a8 8 0 0 0 14.6 4.4M20 19v-5h-5"/></symbol>

    <symbol id="icon-chevron-down" viewBox="0 0 24 24"><path stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M5 8.5 12 15l7-6.5"/></symbol>

    <symbol id="icon-menu" viewBox="0 0 24 24"><line x1="3.5" y1="7" x2="20.5" y2="7" stroke="currentColor" stroke-width="2"/><line x1="3.5" y1="12" x2="20.5" y2="12" stroke="currentColor" stroke-width="2"/><line x1="3.5" y1="17" x2="20.5" y2="17" stroke="currentColor" stroke-width="2"/></symbol>

    <symbol id="icon-x" viewBox="0 0 24 24"><line x1="5" y1="5" x2="19" y2="19" stroke="currentColor" stroke-width="2"/><line x1="19" y1="5" x2="5" y2="19" stroke="currentColor" stroke-width="2"/></symbol>

    <symbol id="icon-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5" stroke="currentColor" fill="none" stroke-width="1.8"/><line x1="16.2" y1="16.2" x2="21" y2="21" stroke="currentColor" stroke-width="1.8"/></symbol>

    <symbol id="icon-bag" viewBox="0 0 24 24"><path stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M5.5 8h13l1 12.5h-15L5.5 8Z M8.5 8V6a3.5 3.5 0 0 1 7 0v2"/></symbol>

    <symbol id="icon-plus" viewBox="0 0 24 24"><line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" stroke-width="2"/><line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" stroke-width="2"/></symbol>

    <symbol id="icon-minus" viewBox="0 0 24 24"><line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" stroke-width="2"/></symbol>

    <symbol id="icon-play" viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5-11-6.5Z"/></symbol>

    <symbol id="icon-anchor" viewBox="0 0 24 24"><circle cx="12" cy="5.5" r="2.2" stroke="currentColor" fill="none" stroke-width="1.8"/><line x1="12" y1="7.7" x2="12" y2="21" stroke="currentColor" stroke-width="1.8"/><path stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" d="M5 13a7 7 0 0 0 14 0 M5 13H3.2 M20.8 13H19"/></symbol>

    <symbol id="icon-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.2" stroke="currentColor" fill="none" stroke-width="1.8"/><g stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="12" y1="1.8" x2="12" y2="4.2"/><line x1="12" y1="19.8" x2="12" y2="22.2"/><line x1="1.8" y1="12" x2="4.2" y2="12"/><line x1="19.8" y1="12" x2="22.2" y2="12"/><line x1="4.6" y1="4.6" x2="6.2" y2="6.2"/><line x1="17.8" y1="17.8" x2="19.4" y2="19.4"/><line x1="4.6" y1="19.4" x2="6.2" y2="17.8"/><line x1="17.8" y1="6.2" x2="19.4" y2="4.6"/></g></symbol>

    <symbol id="icon-wind" viewBox="0 0 24 24"><path stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" d="M2.5 8h13a2.7 2.7 0 1 0-2.5-3.7 M2.5 13h16a2.7 2.7 0 1 1-2.5 3.7 M2.5 18h9"/></symbol>

    <symbol id="icon-life-buoy" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="currentColor" fill="none" stroke-width="1.8"/><circle cx="12" cy="12" r="3.6" stroke="currentColor" fill="none" stroke-width="1.8"/><line x1="5.3" y1="5.3" x2="9.4" y2="9.4" stroke="currentColor" stroke-width="1.8"/><line x1="14.6" y1="14.6" x2="18.7" y2="18.7" stroke="currentColor" stroke-width="1.8"/><line x1="18.7" y1="5.3" x2="14.6" y2="9.4" stroke="currentColor" stroke-width="1.8"/><line x1="9.4" y1="14.6" x2="5.3" y2="18.7" stroke="currentColor" stroke-width="1.8"/></symbol>

    <symbol id="icon-award" viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="5.5" stroke="currentColor" fill="none" stroke-width="1.8"/><path stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="m8.2 13.4-1.6 7.6 5.4-3 5.4 3-1.6-7.6"/></symbol>

    <symbol id="icon-zap" viewBox="0 0 24 24"><path fill="currentColor" stroke="none" d="M13 2 4 14h6.5L11 22l9-12h-6.5L13 2Z"/></symbol>

    <symbol id="icon-mail" viewBox="0 0 24 24"><rect x="2.5" y="5" width="19" height="14" rx="2.4" stroke="currentColor" fill="none" stroke-width="1.8"/><path stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="m3.5 6.5 8.5 7 8.5-7"/></symbol>

    <symbol id="icon-arrow-right" viewBox="0 0 24 24"><line x1="4" y1="12" x2="19.5" y2="12" stroke="currentColor" stroke-width="2"/><polyline points="13.5,6 19.5,12 13.5,18" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></symbol>

    <symbol id="icon-instagram" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" fill="none" stroke-width="1.8"/><circle cx="12" cy="12" r="4.2" stroke="currentColor" fill="none" stroke-width="1.8"/><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none"/></symbol>

    <symbol id="icon-facebook" viewBox="0 0 24 24"><path stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M15.5 8.5h-2A2 2 0 0 0 11.5 10.5V21 M8.5 13.5h6.5 M11.5 21V13.5"/><circle cx="12" cy="12" r="9.5" stroke="currentColor" fill="none" stroke-width="1.8"/></symbol>

    <symbol id="icon-tiktok" viewBox="0 0 24 24"><path stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M13 3v11.6a3.6 3.6 0 1 1-3-3.55 M13 3c.5 2.6 2.2 4.3 4.7 4.6"/></symbol>

    <symbol id="icon-map-pin" viewBox="0 0 24 24"><path stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M12 21.5S5 14.8 5 9.8a7 7 0 1 1 14 0c0 5-7 11.7-7 11.7Z"/><circle cx="12" cy="9.8" r="2.4" stroke="currentColor" fill="none" stroke-width="1.8"/></symbol>

    <symbol id="icon-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="currentColor" fill="none" stroke-width="1.8"/><path stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M12 7v5.5l4 2.3"/></symbol>

    <symbol id="icon-package" viewBox="0 0 24 24"><path stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M3.5 7.5 12 3l8.5 4.5-8.5 4.5-8.5-4.5Z M3.5 7.5v9L12 21l8.5-4.5v-9 M12 12v9"/></symbol>

    <symbol id="icon-credit-card" viewBox="0 0 24 24"><rect x="2.5" y="5.5" width="19" height="13" rx="2.2" stroke="currentColor" fill="none" stroke-width="1.8"/><line x1="2.5" y1="10" x2="21.5" y2="10" stroke="currentColor" stroke-width="1.8"/></symbol>

    <symbol id="icon-user" viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.6" stroke="currentColor" fill="none" stroke-width="1.8"/><path stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" d="M4.5 20c1.2-4 4-6 7.5-6s6.3 2 7.5 6"/></symbol>

    <symbol id="icon-heart" viewBox="0 0 24 24"><path stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M12 20.2S3.5 15 3.5 9.2a4.7 4.7 0 0 1 8.5-2.8 4.7 4.7 0 0 1 8.5 2.8c0 5.8-8.5 11-8.5 11Z"/></symbol>

    <symbol id="icon-quote" viewBox="0 0 24 24"><path fill="currentColor" stroke="none" d="M9 6.5C5.7 7.6 4 10 4 13c0 2.5 1.6 4.2 3.7 4.2 1.8 0 3-1.3 3-3 0-1.6-1.1-2.8-2.6-2.9.3-1.4 1.5-2.8 3.4-3.5L9 6.5Z M18 6.5c-3.3 1.1-5 3.5-5 6.5 0 2.5 1.6 4.2 3.7 4.2 1.8 0 3-1.3 3-3 0-1.6-1.1-2.8-2.6-2.9.3-1.4 1.5-2.8 3.4-3.5L18 6.5Z"/></symbol>

    <symbol id="icon-layers" viewBox="0 0 24 24"><path stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="m12 3 9 5-9 5-9-5 9-5Z M3 13l9 5 9-5 M3 17.5l9 5 9-5"/></symbol>
  </svg>`;
  document.addEventListener('DOMContentLoaded', function () {
    document.body.insertBefore(sprite, document.body.firstChild);
  });
})();
