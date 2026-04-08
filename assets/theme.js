/* ============================================================
   KnivesFactory Theme JS
   ============================================================ */

// Policy page override — Shopify injects its own policy CSS after theme.css,
// so we inject a <style> tag via JS which loads last and wins.
if (window.location.pathname.indexOf('/policies/') === 0) {
  document.body.classList.add('kf-policy');
  var policyStyle = document.createElement('style');
  policyStyle.textContent = [
    '.kf-policy #main-content { padding: 2rem 0 4rem; }',
    '.kf-policy #main-content h1 { font-size: 1.6rem !important; text-align: left !important; padding: 0 2rem; margin: 0 0 1.5rem !important; line-height: 1.2 !important; color: #d9e3f2 !important; }',
    '.kf-policy #main-content h2 { font-size: 1rem !important; text-align: left !important; color: #ff4655 !important; margin: 2rem 0 0.5rem !important; }',
    '.kf-policy #main-content h3 { font-size: 0.875rem !important; text-align: left !important; color: #d9e3f2 !important; margin: 1.5rem 0 0.4rem !important; }',
    '.kf-policy #main-content p, .kf-policy #main-content li { font-size: 0.925rem !important; line-height: 1.75 !important; color: rgba(217,227,242,0.8) !important; text-align: left !important; }',
    '.kf-policy #main-content ul, .kf-policy #main-content ol { padding-left: 3.5rem !important; }',
    '.kf-policy #main-content * { text-align: left !important; max-width: none !important; }'
  ].join(' ');
  document.head.appendChild(policyStyle);
}

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
      on(this.hamburger, 'touchend', function (e) { e.preventDefault(); MobileNav.toggle(); });
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
      /* hover for mouse devices */
      on(this.item, 'mouseenter', function () { clearTimeout(self.timer); self.open(); });
      on(this.item, 'mouseleave', function () { self.timer = setTimeout(function () { self.close(); }, 160); });
      on(this.menu, 'mouseenter', function () { clearTimeout(self.timer); });
      on(this.menu, 'mouseleave', function () { self.timer = setTimeout(function () { self.close(); }, 160); });
      /* click/tap toggle for touch devices */
      if (this.btn) {
        on(this.btn, 'click', function (e) {
          e.preventDefault();
          self.menu.classList.contains('open') ? self.close() : self.open();
        });
      }
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
      on($('#search-toggle'), 'click', function () { SearchOverlay.toggle(); });
      on(document, 'keydown', function (e) { if (e.key === 'Escape') SearchOverlay.close(); });
    },
    toggle: function () {
      this.bar.classList.contains('open') ? this.close() : this.open();
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
    const cartKey = input.dataset.cartQty;
    if (val > 1) {
      input.value = val - 1;
      if (cartKey) {
        fetch('/cart/change.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: cartKey, quantity: val - 1 })
        }).then(function () { window.location.reload(); });
      }
    } else if (val === 1 && cartKey) {
      fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: cartKey, quantity: 0 })
      }).then(function () { window.location.reload(); });
    }
  }
  if (e.target.matches('[data-qty-plus]')) {
    const input = e.target.closest('.quantity-stepper').querySelector('input');
    const val = parseInt(input.value, 10) + 1;
    input.value = val;
    const cartKey = input.dataset.cartQty;
    if (cartKey) {
      fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: cartKey, quantity: val })
      }).then(function () { window.location.reload(); });
    }
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

  const variantImage = e.target.dataset.variantImage;
  if (variantImage) {
    const mainImg = document.getElementById('main-product-image');
    if (mainImg) mainImg.src = variantImage;
  }
});

// Buy Now — add to cart then go straight to checkout
document.addEventListener('click', function (e) {
  if (!e.target.matches('.product-info__buy-btn')) return;
  var form = e.target.closest('form');
  if (!form) return;
  var id  = form.querySelector('[name="id"]').value;
  var qty = parseInt(form.querySelector('[name="quantity"]').value || '1', 10);
  e.target.disabled = true;
  fetch('/cart/add.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: parseInt(id), quantity: qty })
  }).then(function () {
    window.location.href = '/checkout';
  }).catch(function () {
    e.target.disabled = false;
  });
});

// Product card — click anywhere to navigate to product page
document.addEventListener('click', function (e) {
  var card = e.target.closest('[data-product-url]');
  if (!card) return;
  if (e.target.closest('a, button')) return;
  window.location.href = card.dataset.productUrl;
});

// Product card image arrows
document.addEventListener('click', function (e) {
  var btn = e.target.closest('.product-card__img-arrow');
  if (!btn) return;
  e.preventDefault();
  e.stopPropagation();
  var wrap = btn.closest('.product-card__image-wrap');
  var img = wrap && wrap.querySelector('img[data-img-index]');
  if (!img || !wrap.dataset.images) return;
  var images = wrap.dataset.images.split('|');
  var idx = parseInt(img.dataset.imgIndex || '0', 10);
  idx = btn.classList.contains('product-card__img-prev')
    ? (idx - 1 + images.length) % images.length
    : (idx + 1) % images.length;
  img.src = images[idx];
  img.dataset.imgIndex = idx;
});

// Product gallery — swipe transition
function galleryCurrentIndex(wrap) {
  var thumbs = Array.from(wrap.querySelectorAll('.product-gallery__thumb'));
  var idx = thumbs.findIndex(function (t) { return t.classList.contains('active'); });
  return idx === -1 ? 0 : idx;
}

function galleryGoTo(wrap, index, direction) {
  var thumbs = Array.from(wrap.querySelectorAll('.product-gallery__thumb'));
  if (!thumbs.length) return;
  index = (index + thumbs.length) % thumbs.length;
  var thumbImg = thumbs[index].querySelector('img');
  var mainEl = wrap.querySelector('.product-gallery__main');
  var main = mainEl && mainEl.querySelector('img');
  if (!main || !thumbImg) return;

  var newSrc = thumbImg.dataset.fullSrc || thumbImg.src;
  if (main.src === newSrc) return;

  // Clone current image and slide it out
  var clone = main.cloneNode(true);
  clone.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:contain;padding:inherit;transition:transform 0.45s cubic-bezier(0.4,0,0.2,1),opacity 0.45s cubic-bezier(0.4,0,0.2,1);z-index:1;animation:none;';
  mainEl.appendChild(clone);

  var outX = direction === 'prev' ? '100%' : '-100%';
  var inX  = direction === 'prev' ? '-100%' : '100%';

  // Position new image off-screen, load it, then slide in
  main.style.cssText = 'transform:translateX(' + inX + ');transition:none;animation:none;opacity:1;';
  main.src = newSrc;

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      clone.style.transform = 'translateX(' + outX + ')';
      clone.style.opacity = '0';
      main.style.transition = 'transform 0.45s cubic-bezier(0.4,0,0.2,1)';
      main.style.transform = 'translateX(0)';
      setTimeout(function () {
        clone.remove();
        main.style.cssText = '';
      }, 460);
    });
  });

  thumbs.forEach(function (t) { t.classList.remove('active'); });
  thumbs[index].classList.add('active');
}

document.addEventListener('click', function (e) {
  // Thumbnail click
  if (e.target.matches('.product-gallery__thumb img')) {
    var wrap = e.target.closest('.product-page__gallery');
    if (!wrap) return;
    var thumbs = Array.from(wrap.querySelectorAll('.product-gallery__thumb'));
    var current = galleryCurrentIndex(wrap);
    var next = thumbs.findIndex(function (t) { return t.contains(e.target); });
    galleryGoTo(wrap, next, next > current ? 'next' : 'prev');
    return;
  }
  // Arrow click
  if (e.target.closest('.gallery-arrow--prev')) {
    var wrap = e.target.closest('.product-page__gallery');
    if (wrap) galleryGoTo(wrap, galleryCurrentIndex(wrap) - 1, 'prev');
    return;
  }
  if (e.target.closest('.gallery-arrow--next')) {
    var wrap = e.target.closest('.product-page__gallery');
    if (wrap) galleryGoTo(wrap, galleryCurrentIndex(wrap) + 1, 'next');
    return;
  }
});

// Touch swipe for product gallery
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var mainEl = document.querySelector('.product-gallery__main');
    if (!mainEl) return;

    var startX = 0, startY = 0, active = false, dirLocked = false;

    mainEl.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      active = true;
      dirLocked = false;
    }, { passive: true });

    mainEl.addEventListener('touchmove', function (e) {
      if (!active) return;
      var dx = e.touches[0].clientX - startX;
      var dy = e.touches[0].clientY - startY;

      if (!dirLocked) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        dirLocked = true;
        if (Math.abs(dy) > Math.abs(dx)) { active = false; return; } // vertical scroll wins
      }

      e.preventDefault();
      var img = mainEl.querySelector('img');
      if (img) img.style.transform = 'translateX(' + (dx * 0.3) + 'px)';
    }, { passive: false });

    mainEl.addEventListener('touchend', function (e) {
      if (!active) return;
      active = false;
      var dx = e.changedTouches[0].clientX - startX;
      var img = mainEl.querySelector('img');
      if (img) img.style.transform = '';

      if (Math.abs(dx) < 50) return;
      var wrap = mainEl.closest('.product-page__gallery');
      if (!wrap) return;
      var current = galleryCurrentIndex(wrap);
      if (dx < 0) {
        galleryGoTo(wrap, current + 1, 'next');
      } else {
        galleryGoTo(wrap, current - 1, 'prev');
      }
    }, { passive: true });
  });
})();

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

// Wishlist heart — toggle add/remove from cart
document.addEventListener('click', function (e) {
  var btn = e.target.closest('.product-card__wishlist');
  if (!btn || btn.disabled) return;
  e.preventDefault();
  var variantId = btn.dataset.variantId;
  if (!variantId) return;
  var wishlisted = btn.classList.contains('is-wishlisted');
  // Toggle state instantly
  btn.classList.toggle('is-wishlisted', !wishlisted);
  btn.disabled = true;
  var url, body;
  if (wishlisted) {
    url = '/cart/change.js';
    body = JSON.stringify({ id: variantId, quantity: 0 });
  } else {
    url = '/cart/add.js';
    body = JSON.stringify({ id: variantId, quantity: 1 });
  }
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body
  }).catch(function () {
    // Revert on failure
    btn.classList.toggle('is-wishlisted', wishlisted);
  }).finally(function () {
    btn.disabled = false;
  });
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

// ============================================================ CLICK SPARK
(function () {
  var canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:99999;';
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d');

  var SPARK_COLOR  = '#ff4655';
  var SPARK_SIZE   = 10;
  var SPARK_RADIUS = 22;
  var SPARK_COUNT  = 8;
  var DURATION     = 900;

  var sparks    = [];
  var animating = false;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function easeOut(t) { return t * (2 - t); }

  function draw(ts) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sparks = sparks.filter(function (s) {
      var elapsed = ts - s.startTime;
      if (elapsed >= DURATION) return false;
      var p  = elapsed / DURATION;
      var ep = easeOut(p);
      var dist = ep * SPARK_RADIUS;
      var len  = SPARK_SIZE * (1 - ep);
      var x1 = s.x + dist * Math.cos(s.angle);
      var y1 = s.y + dist * Math.sin(s.angle);
      var x2 = s.x + (dist + len) * Math.cos(s.angle);
      var y2 = s.y + (dist + len) * Math.sin(s.angle);
      ctx.globalAlpha = 1 - ep;
      ctx.strokeStyle = SPARK_COLOR;
      ctx.lineWidth   = 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      return true;
    });
    ctx.globalAlpha = 1;
    if (sparks.length > 0) {
      requestAnimationFrame(draw);
    } else {
      animating = false;
    }
  }

  document.addEventListener('click', function (e) {
    var now = performance.now();
    for (var i = 0; i < SPARK_COUNT; i++) {
      sparks.push({ x: e.clientX, y: e.clientY, angle: (2 * Math.PI * i) / SPARK_COUNT, startTime: now });
    }
    if (!animating) { animating = true; requestAnimationFrame(draw); }
  });
})();

