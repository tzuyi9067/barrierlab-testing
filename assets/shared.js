/* =======================================================================
   Barrier Lab — Shared JS (v2)
   Injects nav + footer + cart drawer on every page.
   Handles cart state in localStorage. Ready to port to Shopify.
   ======================================================================= */

(function () {
  'use strict';

  // ---------- Catalog (single source of truth) ----------
  // Each entry maps 1:1 to a future Shopify product.
  const CATALOG = {
    'bl-01': {
      code: 'BL-01',
      name: 'Recovery Balm',
      tag: '1.7 oz topical · ceramide barrier cream',
      shortTag: 'Outside — ceramide barrier cream',
      price: 32,
      subPrice: 27.20,
      href: 'recovery-balm.html',
      viz: 'jar',
      initial: 'R',
    },
    'bl-02': {
      code: 'BL-02',
      name: 'Inner Powder',
      tag: '30 sachets · kids oral barrier support',
      shortTag: 'Inside (kids) — daily sachets',
      price: 44,
      subPrice: 37.40,
      href: 'inner-powder.html',
      viz: 'tin',
      initial: 'I',
    },
    'bl-03': {
      code: 'BL-03',
      name: 'Inner Barrier Complex',
      tag: '90 caps · adult oral barrier system',
      shortTag: 'Inside (adult) — daily capsules',
      price: 49,
      subPrice: 41.65,
      href: 'inner-barrier.html',
      viz: 'bottle',
      initial: 'I',
    },
    'bl-bundle-adult': {
      code: 'BUNDLE',
      name: 'Adult System',
      tag: 'Recovery Balm + Inner Barrier Complex',
      shortTag: 'Outside + Inside — adults',
      price: 68.85,
      subPrice: 68.85,
      href: 'shop.html#bundles',
      viz: 'bundle',
      initial: 'B',
    },
    'bl-bundle-family': {
      code: 'BUNDLE',
      name: 'Family System',
      tag: 'Recovery Balm + Inner Powder',
      shortTag: 'Outside + Inside — kids',
      price: 64.60,
      subPrice: 64.60,
      href: 'shop.html#bundles',
      viz: 'bundle',
      initial: 'B',
    },
  };

  window.BarrierLab = window.BarrierLab || {};
  window.BarrierLab.catalog = CATALOG;

  // ---------- Nav injection ----------
  function injectNav() {
    const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const isShop = ['shop.html','recovery-balm.html','inner-powder.html','inner-barrier.html','cart.html','checkout.html'].includes(current);

    const cls = (match) => match.includes(current) ? ' class="active"' : '';

    const html = `
      <nav class="nav" role="navigation" aria-label="Primary">
        <div class="nav-inner">
          <a href="index.html" class="nav-logo-row" aria-label="Barrier Lab home">
            <span class="wordmark">
              <span class="w-barrier">barrier</span><span class="w-lab">lab.</span>
            </span>
          </a>
          <ul class="nav-links" id="navLinks">
            <li>
              <button class="nav-link-btn${isShop ? ' active' : ''}" aria-haspopup="true" aria-expanded="false" id="shopTrigger">
                Shop <span aria-hidden="true" style="font-size:0.7em;">▾</span>
              </button>
              <div class="nav-dd" role="menu">
                <a href="recovery-balm.html" role="menuitem">
                  <span class="nav-dd-chip">BL-01</span>
                  <span>
                    <div style="font-weight:600;">Recovery Balm</div>
                    <div class="nav-dd-meta">Outside · ceramide barrier cream — $32</div>
                  </span>
                </a>
                <a href="inner-powder.html" role="menuitem">
                  <span class="nav-dd-chip">BL-02</span>
                  <span>
                    <div style="font-weight:600;">Inner Powder</div>
                    <div class="nav-dd-meta">Inside · kids sachets — $44</div>
                  </span>
                </a>
                <a href="inner-barrier.html" role="menuitem">
                  <span class="nav-dd-chip">BL-03</span>
                  <span>
                    <div style="font-weight:600;">Inner Barrier Complex</div>
                    <div class="nav-dd-meta">Inside · adult caps — $49</div>
                  </span>
                </a>
                <div class="nav-dd-hr"></div>
                <a href="shop.html" class="nav-dd-cta" role="menuitem">
                  <span>Shop all + bundles</span><span>→</span>
                </a>
              </div>
            </li>
            <li><a href="science.html"${cls(['science.html'])}>Science</a></li>
            <li><a href="story.html"${cls(['story.html'])}>Our Story</a></li>
            <li><a href="learn.html"${cls(['learn.html','faq.html'])}>Learn</a></li>
          </ul>
          <div class="nav-cta">
            <a href="shop.html" class="btn btn-ink btn-sm" style="display:none;" id="navShopCta">Shop</a>
            <button class="cart-btn" id="cartOpenBtn" aria-label="Open cart">
              <span>Cart</span>
              <span class="cart-count is-empty" id="cartCount">0</span>
            </button>
            <button class="nav-menu-btn" id="navMenuBtn" aria-label="Menu">☰</button>
          </div>
        </div>
      </nav>
    `;
    document.body.insertAdjacentHTML('afterbegin', html);

    document.getElementById('navMenuBtn').addEventListener('click', () => {
      document.getElementById('navLinks').classList.toggle('is-open');
    });

    // Mobile: clicking the Shop trigger toggles the dropdown in-flow
    const shopTrigger = document.getElementById('shopTrigger');
    if (shopTrigger) {
      shopTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        shopTrigger.parentElement.classList.toggle('is-open');
      });
    }
  }

  // ---------- Footer injection ----------
  function injectFooter() {
    const html = `
      <footer class="footer">
        <div class="container">
          <div class="footer-top">
            <div class="footer-col">
              <span class="nav-logo-row">
                <span class="wordmark" style="color: var(--cream);">
                  <span class="w-barrier">barrier</span><span class="w-lab">lab.</span>
                </span>
              </span>
              <p class="footer-tagline">Skin heals from the <em>outside</em>. Eczema heals from the <em>inside</em>.</p>
              <form class="footer-signup" onsubmit="event.preventDefault(); BarrierLab.handleSignup(this);">
                <input type="email" required placeholder="Your email" aria-label="Email address">
                <button type="submit">Join</button>
              </form>
            </div>
            <div class="footer-col">
              <h4>Shop</h4>
              <ul>
                <li><a href="recovery-balm.html">Recovery Balm</a></li>
                <li><a href="inner-powder.html">Inner Powder</a></li>
                <li><a href="inner-barrier.html">Inner Barrier Complex</a></li>
                <li><a href="shop.html">Shop all + bundles</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h4>Learn</h4>
              <ul>
                <li><a href="science.html">Science</a></li>
                <li><a href="learn.html">Ingredient library</a></li>
                <li><a href="learn.html#faq">FAQ</a></li>
                <li><a href="story.html">Our Story</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h4>Company</h4>
              <ul>
                <li><a href="mailto:hello@barrierlab.com">Contact</a></li>
                <li><a href="#">Wholesale</a></li>
                <li><a href="#">Press</a></li>
                <li><a href="#">Careers</a></li>
              </ul>
            </div>
          </div>
          <div class="footer-bottom">
            <div>© 2026 Barrier Lab. Made in the US. Founded by people who actually live with eczema.</div>
            <div><a href="#">Privacy</a> · <a href="#">Terms</a> · <a href="#">Accessibility</a></div>
          </div>
        </div>
      </footer>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
  }

  // ---------- Cart drawer injection ----------
  function injectCart() {
    const html = `
      <div class="cart-overlay" id="cartOverlay"></div>
      <aside class="cart-drawer" id="cartDrawer" role="dialog" aria-label="Shopping cart">
        <div class="cart-header">
          <span class="cart-title">Your cart</span>
          <button class="cart-close" id="cartCloseBtn" aria-label="Close cart">✕</button>
        </div>
        <div class="cart-items" id="cartItems"></div>
        <div class="cart-footer" id="cartFooter" style="display:none;">
          <div class="cart-totals"><span>Subtotal</span><span class="cart-total" id="cartSubtotal">$0.00</span></div>
          <p class="cart-note">Taxes and shipping calculated at checkout.</p>
          <a href="cart.html" class="btn btn-ink btn-full btn-lg">Review cart →</a>
          <a href="checkout.html" class="btn btn-primary btn-full btn-lg" style="margin-top:0.5rem;">Checkout</a>
        </div>
      </aside>
      <div class="toast" id="toast" role="status" aria-live="polite"></div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);

    document.getElementById('cartOpenBtn').addEventListener('click', openCart);
    document.getElementById('cartCloseBtn').addEventListener('click', closeCart);
    document.getElementById('cartOverlay').addEventListener('click', closeCart);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeCart();
    });
  }

  // ---------- Cart state ----------
  const CART_KEY = 'barrierlab:cart:v1';

  function loadCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
    catch { return []; }
  }
  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCart();
    // Fire event so cart.html / checkout.html can re-render
    window.dispatchEvent(new CustomEvent('barrierlab:cart-updated'));
  }

  function addToCart(sku, qty = 1, subscribe = false) {
    if (!CATALOG[sku]) { console.warn('Unknown SKU:', sku); return; }
    const cart = loadCart();
    const found = cart.find(i => i.sku === sku && i.subscribe === subscribe);
    if (found) found.qty += qty;
    else cart.push({ sku, qty, subscribe });
    saveCart(cart);
    openCart();
    showToast(`${CATALOG[sku].name} added to cart`);
  }
  window.BarrierLab.addToCart = addToCart;

  function setQty(idx, qty) {
    const cart = loadCart();
    if (qty <= 0) cart.splice(idx, 1);
    else cart[idx].qty = qty;
    saveCart(cart);
  }
  function removeItem(idx) {
    const cart = loadCart();
    cart.splice(idx, 1);
    saveCart(cart);
  }
  window.BarrierLab.loadCart = loadCart;
  window.BarrierLab.setQty = setQty;
  window.BarrierLab.removeItem = removeItem;
  window.BarrierLab.saveCart = saveCart;

  function cartSubtotal() {
    return loadCart().reduce((s, i) => s + (i.subscribe ? CATALOG[i.sku].subPrice : CATALOG[i.sku].price) * i.qty, 0);
  }
  window.BarrierLab.cartSubtotal = cartSubtotal;

  function renderCart() {
    const cart = loadCart();
    const count = cart.reduce((s, i) => s + i.qty, 0);
    const subtotal = cartSubtotal();

    const countEl = document.getElementById('cartCount');
    if (countEl) {
      countEl.textContent = count;
      countEl.classList.toggle('is-empty', count === 0);
    }

    const itemsEl = document.getElementById('cartItems');
    const footerEl = document.getElementById('cartFooter');
    if (!itemsEl) return;

    if (cart.length === 0) {
      itemsEl.innerHTML = `
        <div class="cart-empty">
          <p>Your cart is empty.</p>
          <p style="margin-top:1rem;"><a href="shop.html" style="color:var(--purple);font-weight:600;">Browse the system →</a></p>
        </div>`;
      if (footerEl) footerEl.style.display = 'none';
      return;
    }
    if (footerEl) footerEl.style.display = 'block';

    itemsEl.innerHTML = cart.map((item, i) => {
      const p = CATALOG[item.sku];
      const price = item.subscribe ? p.subPrice : p.price;
      const total = (price * item.qty).toFixed(2);
      const subLabel = item.subscribe ? ' · Subscribe' : '';
      return `
        <div class="cart-item">
          <div class="cart-item-thumb">${p.initial}</div>
          <div>
            <div class="cart-item-name">${p.name}</div>
            <div class="cart-item-meta">${p.code}${subLabel}</div>
            <div class="cart-qty">
              <button data-action="dec" data-idx="${i}" aria-label="Decrease">−</button>
              <span>${item.qty}</span>
              <button data-action="inc" data-idx="${i}" aria-label="Increase">+</button>
            </div>
            <button class="cart-item-remove" data-action="rm" data-idx="${i}">Remove</button>
          </div>
          <div class="cart-item-price">$${total}</div>
        </div>`;
    }).join('');

    itemsEl.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.idx);
        const a = btn.dataset.action;
        const c = loadCart();
        if (a === 'inc') setQty(idx, c[idx].qty + 1);
        if (a === 'dec') setQty(idx, c[idx].qty - 1);
        if (a === 'rm') removeItem(idx);
      });
    });

    const sEl = document.getElementById('cartSubtotal');
    if (sEl) sEl.textContent = '$' + subtotal.toFixed(2);
  }

  function openCart() {
    document.getElementById('cartDrawer').classList.add('is-open');
    document.getElementById('cartOverlay').classList.add('is-open');
    renderCart();
  }
  function closeCart() {
    document.getElementById('cartDrawer').classList.remove('is-open');
    document.getElementById('cartOverlay').classList.remove('is-open');
  }
  window.BarrierLab.openCart = openCart;
  window.BarrierLab.closeCart = closeCart;

  // ---------- Toast ----------
  let toastTimer;
  function showToast(msg) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('is-shown');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-shown'), 2200);
  }
  window.BarrierLab.toast = showToast;

  // ---------- Signup handler (footer/waitlist) ----------
  window.BarrierLab.handleSignup = function (form) {
    const email = form.querySelector('input[type=email]').value;
    showToast("You're on the list. We'll email you at launch.");
    form.reset();
    try {
      const key = 'barrierlab:waitlist';
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      list.push({ email, at: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(list));
    } catch {}
  };

  // ---------- Accordion (reusable) ----------
  window.BarrierLab.toggleAcc = function (btn) {
    const content = btn.nextElementSibling;
    const icon = btn.querySelector('.acc-icon');
    const open = content.classList.toggle('is-open');
    if (icon) icon.textContent = open ? '−' : '+';
  };

  // ---------- Boot ----------
  document.addEventListener('DOMContentLoaded', () => {
    injectNav();
    injectCart();
    injectFooter();
    renderCart();

    // Auto-wire .js-add-to-cart buttons (data-sku + optional data-subscribe)
    document.body.addEventListener('click', (e) => {
      const btn = e.target.closest('.js-add-to-cart');
      if (!btn) return;
      e.preventDefault();
      const sku = btn.dataset.sku;
      const subscribe = btn.dataset.subscribe === 'true';
      addToCart(sku, 1, subscribe);
    });

    // Auto-wire accordions
    document.body.addEventListener('click', (e) => {
      const btn = e.target.closest('.acc-btn');
      if (!btn) return;
      window.BarrierLab.toggleAcc(btn);
    });
  });
})();
