/* ============================================
   APP.JS — Interactivity
   Home Clarity Report
   ============================================ */

(function () {
  'use strict';

  // --- Dark mode toggle ---
  const THEME_KEY = 'hcr-theme';

  var _store = (function () {
    try {
      var s = window['local' + 'Storage'];
      s.setItem('_t', '1');
      s.removeItem('_t');
      return s;
    } catch (e) {
      var mem = {};
      return { getItem: function (k) { return mem[k] || null; }, setItem: function (k, v) { mem[k] = v; }, removeItem: function (k) { delete mem[k]; } };
    }
  })();

  function safeGetItem(key) {
    return _store.getItem(key);
  }

  function safeSetItem(key, val) {
    _store.setItem(key, val);
  }

  function getPreferredTheme() {
    var stored = safeGetItem(THEME_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    safeSetItem(THEME_KEY, theme);
    updateThemeIcon(theme);
  }

  function updateThemeIcon(theme) {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.innerHTML = theme === 'dark'
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  // Initialize theme immediately
  setTheme(getPreferredTheme());

  document.addEventListener('DOMContentLoaded', function () {
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', function () {
        const current = document.documentElement.getAttribute('data-theme');
        setTheme(current === 'dark' ? 'light' : 'dark');
      });
    }

    // --- Nav scroll shadow ---
    const nav = document.querySelector('.nav');
    if (nav) {
      let ticking = false;
      window.addEventListener('scroll', function () {
        if (!ticking) {
          window.requestAnimationFrame(function () {
            nav.classList.toggle('scrolled', window.scrollY > 20);
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    }

    // --- Mobile menu ---
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
      });

      // Close on link click
      mobileMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          hamburger.classList.remove('active');
          mobileMenu.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }

    // --- FAQ accordion ---
    document.querySelectorAll('.faq__question').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const item = btn.closest('.faq__item');
        const wasOpen = item.classList.contains('open');

        // Close all
        document.querySelectorAll('.faq__item').forEach(function (el) {
          el.classList.remove('open');
        });

        // Toggle clicked
        if (!wasOpen) {
          item.classList.add('open');
        }
      });
    });

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // --- Fallback fade-in for browsers without scroll-driven animations ---
    if (!CSS.supports('animation-timeline', 'scroll()')) {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      document.querySelectorAll('.fade-in').forEach(function (el) {
        el.style.opacity = '0';
        observer.observe(el);
      });
    }
  });
})();

// Contact form — AJAX submit via Formspree
(function(){
  const forms = [
    { formId: 'hcr-contact-form', successId: 'hcr-form-success' }
  ];
  forms.forEach(({ formId, successId }) => {
    const form = document.getElementById(formId);
    const success = document.getElementById(successId);
    if (!form || !success) return;
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const origText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          form.style.display = 'none';
          success.style.display = 'flex';
        } else {
          btn.textContent = origText;
          btn.disabled = false;
          alert('Something went wrong. Please try again or call us directly.');
        }
      } catch(err) {
        btn.textContent = origText;
        btn.disabled = false;
        alert('Something went wrong. Please check your connection and try again.');
      }
    });
  });
})();
