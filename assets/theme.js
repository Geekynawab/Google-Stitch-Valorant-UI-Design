/* ============================================================
   KnivesFactory Theme JS
   ============================================================ */

// Header interactions
(function () {
  'use strict';

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function on(el, ev, fn) { if (el) el.addEventListener(ev, fn); }

  // Sticky header scroll class
  var header = $('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('is-scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  // Mobile nav drawer
  var MobileNav = {
    init: function () {
      this.hamburger = $('#hamburger-btn');
      this.nav       = $('#mobile-nav');
      this.overlay   = $('#mobile-nav-overlay');
      if (!this.hamburger) return;
      on(this.hamburger, 'click', function () { MobileNav.toggle(); });
      if (this.overlay) on(this.overlay, 'click', function () { MobileNav.close(); });
      on(this.nav, 'click', function (e) {
        var toggle = e.target.closest('[data-mobile-toggle]');
        if (!toggle) return;
        var sub = $('#' + toggle.dataset.mobileToggle);
        if (!sub) return;
        var opening = !sub.classList.contains('open');
        sub.classList.toggle('open', opening);
        toggle.classList.toggle('open', opening);
      });
    },
    toggle: function () {
      var isOpen = this.hamburger.classList.toggle('open');
      this.nav.classList.toggle('open', isOpen);
      if (this.overlay) this.overlay.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    },
    close: function () {
      this.hamburger.classList.remove('open');
      this.nav.classList.remove('open');
      if (this.overlay) this.overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  // Desktop mega menu
  var MegaMenu = {
    timer: null,
    init: function () {
      this.item = $('#categories-nav-item');
      this.menu = $('#mega-menu');
      if (!this.item || !this.menu) return;
      this.btn = this.item.querySelector('.desktop-nav__btn');
      var self = this;
      on(this.item, 'mouseenter', function () { clearTimeout(self.timer); self.open(); });
      on(this.item, 'mouseleave', function () { self.timer = setTimeout(function () { self.close(); }, 160); });
      on(this.menu, 'mouseenter', function () { clearTimeout(self.timer); });
      on(this.menu, 'mouseleave', function () { self.timer = setTimeout(function () { self.close(); }, 160); });
      on(document, 'click', function (e) {
        if (!self.item.contains(e.target) && !self.menu.contains(e.target)) self.close();
      });
    },
    open: function () {
      this.menu.classList.add('open');
      this.menu.setAttribute('aria-hidden', 'false');
      if (this.btn) this.btn.classList.add('active');
    },
    close: function () {
      this.menu.classList.remove('open');
      this.menu.setAttribute('aria-hidden', 'true');
      if (this.btn) this.btn.classList.remove('active');
    }
  };

  // Inline search overlay
  var SearchOverlay = {
    init: function () {
      this.bar   = $('#header-search');
      this.input = $('#header-search-input');
      if (!this.bar) return;
      on($('#search-toggle'),       'click', function () { SearchOverlay.open(); });
      on($('#header-search-close'), 'click', function () { SearchOverlay.close(); });
      on(document, 'keydown', function (e) { if (e.key === 'Escape') SearchOverlay.close(); });
    },
    open: function () {
      this.bar.classList.add('open');
      this.bar.setAttribute('aria-hidden', 'false');
      if (this.input) setTimeout(function () { SearchOverlay.input.focus(); }, 60);
    },
    close: function () {
      this.bar.classList.remove('open');
      this.bar.setAttribute('aria-hidden', 'true');
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    MobileNav.init();
    MegaMenu.init();
    SearchOverlay.init();
  });
})();

// Quantity stepper
document.addEventListener('click', function (e) {
  if (e.target.matches('[data-qty-minus]')) {
    const input = e.target.closest('.quantity-stepper').querySelector('input');
    const val = parseInt(input.value, 10);
    if (val > 1) input.value = val - 1;
  }
  if (e.target.matches('[data-qty-plus]')) {
    const input = e.target.closest('.quantity-stepper').querySelector('input');
    input.value = parseInt(input.value, 10) + 1;
  }
});

// Variant selector
document.addEventListener('click', function (e) {
  if (!e.target.matches('.variant-btn')) return;
  const form = e.target.closest('form');
  if (!form) return;
  form.querySelectorAll('.variant-btn').forEach(function (btn) {
    btn.classList.remove('active');
  });
  e.target.classList.add('active');
  const variantId = e.target.dataset.variantId;
  const input = form.querySelector('[name="id"]');
  if (input) input.value = variantId;
});

// Product gallery thumbnail switcher
document.addEventListener('click', function (e) {
  if (!e.target.matches('.product-gallery__thumb img')) return;
  const wrap = e.target.closest('.product-page__gallery');
  if (!wrap) return;
  const main = wrap.querySelector('.product-gallery__main img');
  if (main) main.src = e.target.src;
  wrap.querySelectorAll('.product-gallery__thumb').forEach(function (t) {
    t.classList.remove('active');
  });
  e.target.closest('.product-gallery__thumb').classList.add('active');
});

// Cart item remove (AJAX)
document.addEventListener('click', function (e) {
  if (!e.target.matches('[data-cart-remove]')) return;
  e.preventDefault();
  const key = e.target.dataset.cartRemove;
  fetch('/cart/change.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: key, quantity: 0 })
  }).then(function () { window.location.reload(); });
});

// Product page accordions
document.addEventListener('click', function (e) {
  var trigger = e.target.closest('.product-accordion__trigger');
  if (!trigger) return;
  var isOpen = trigger.getAttribute('aria-expanded') === 'true';
  trigger.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
  var body = trigger.nextElementSibling;
  if (body) body.classList.toggle('open', !isOpen);
});

// Cart quantity update (AJAX)
document.addEventListener('change', function (e) {
  if (!e.target.matches('[data-cart-qty]')) return;
  const key = e.target.dataset.cartQty;
  const qty = parseInt(e.target.value, 10);
  fetch('/cart/change.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: key, quantity: qty })
  }).then(function () { window.location.reload(); });
});
