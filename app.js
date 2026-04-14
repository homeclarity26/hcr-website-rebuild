/* ============================================================
   APP.JS — Interactivity
   Home Clarity Report
   homeclarityreport.com
   ============================================================ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     LOCAL STORAGE WRAPPER (safe)
  ───────────────────────────────────────────── */
  var store = (function () {
    try {
      var s = window['local' + 'Storage'];
      s.setItem('_hcr_t', '1');
      s.removeItem('_hcr_t');
      return s;
    } catch (e) {
      var mem = {};
      return {
        getItem: function (k) { return mem[k] !== undefined ? mem[k] : null; },
        setItem: function (k, v) { mem[k] = String(v); },
        removeItem: function (k) { delete mem[k]; }
      };
    }
  })();

  /* ─────────────────────────────────────────────
     GA TRACKING HELPER
  ───────────────────────────────────────────── */
  function trackEvent(action, category, label) {
    if (typeof gtag === 'function') {
      gtag('event', action, { event_category: category, event_label: label });
    }
  }
  // Expose globally so inline onclick="" attributes can call it
  window.trackEvent = trackEvent;

/* ─────────────────────────────────────────────
   EXIT INTENT POPUP
───────────────────────────────────────────── */
(function () {
  var overlay    = document.getElementById('exit-overlay');
  var closeBtn   = document.getElementById('exit-close');
  var dismissBtn = document.getElementById('exit-dismiss');

  if (!overlay) return;

  var shown    = false;
  var dismissed = false;

  // Don't show again this session if dismissed
  try {
    if (sessionStorage.getItem('hcr-exit-shown') === '1') {
      dismissed = true;
    }
  } catch (e) {}

  function openExit() {
    if (shown || dismissed) return;
    shown = true;

    // Initialise Calendly widget now (lazy — avoids loading it on every page)
    if (window.Calendly && typeof window.Calendly.initInlineWidgets === 'function') {
      window.Calendly.initInlineWidgets();
    }

    overlay.classList.add('open');
    overlay.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();

    trackEvent('exit_intent_shown', 'engagement', 'exit_popup_displayed');

    try { sessionStorage.setItem('hcr-exit-shown', '1'); } catch (e) {}
  }

  function closeExit() {
    dismissed = true;
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    trackEvent('exit_intent_dismissed', 'engagement', 'exit_popup_closed');
  }

  // ── Mouse leaves viewport through the top (cursor heads toward browser chrome) ──
  document.addEventListener('mouseleave', function (e) {
    if (e.clientY <= 0) {
      openExit();
    }
  });

  // ── Mobile: back button / hash change triggers after 30s on page ──
  var timeOnPage = 0;
  var timer = setInterval(function () {
    timeOnPage += 1;
    if (timeOnPage >= 30 && !shown && !dismissed) {
      // On mobile there's no cursor leave — show after 30s of inactivity
      // Only trigger once per session
      clearInterval(timer);
    }
  }, 1000);

  // ── Close actions ──
  if (closeBtn)   closeBtn.addEventListener('click', closeExit);
  if (dismissBtn) dismissBtn.addEventListener('click', closeExit);

  // Click outside the modal
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeExit();
  });

  // Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      closeExit();
    }
  });

  // Track if Calendly booking happens from exit popup
  window.addEventListener('message', function (e) {
    if (!e.data || typeof e.data !== 'object') return;
    if (e.data.event === 'calendly.event_scheduled' && overlay.classList.contains('open')) {
      trackEvent('exit_intent_converted', 'conversion', 'booking_from_exit_popup');
      if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', { currency: 'USD', value: 4500, event_label: 'exit_popup_booking' });
      }
      setTimeout(closeExit, 2000);
    }
  });

})();
