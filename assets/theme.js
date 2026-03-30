/* ============================================================
   KnivesFactory Theme JS
   ============================================================ */

// Sticky header scroll class
(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
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
