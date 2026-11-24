/* =========================================================
   ولتا — هسته مشترک فروشگاه
   ========================================================= */
(function (w) {
  'use strict';

  /* ---------- آیکون‌ها ---------- */
  const P = {
    cpu: '<rect x="7" y="7" width="10" height="10" rx="2"/><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/>',
    mb: '<rect x="3" y="3" width="18" height="18" rx="2"/><rect x="7" y="7" width="6" height="6" rx="1"/><path d="M16 7h3M16 11h3M7 16h12M7 19h6"/>',
    ram: '<rect x="2" y="7" width="20" height="10" rx="2"/><path d="M6 17v3M10 17v3M14 17v3M18 17v3M6 11h3M11 11h3M16 11h2"/>',
    vga: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="8" cy="12" r="2.5"/><circle cx="15" cy="12" r="2.5"/><path d="M2 18v3M6 6V3"/>',
    ssd: '<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="6" rx="2"/><path d="M7 20v2M12 20v2M17 20v2M7 8h5"/>',
    cooler: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18"/>',
    case: '<rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="7" r="2"/><path d="M9 13h6M9 16h6M9 19h6"/>',
    psu: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="7.5" cy="12" r="3"/><path d="M14 10h5M14 14h5"/>',
    rgb: '<path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/><circle cx="12" cy="12" r="4"/>',
    mouse: '<rect x="6" y="2" width="12" height="20" rx="6"/><path d="M12 6v4"/>',
    keyboard: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/>',
    monitor: '<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
    wifi: '<path d="M5 12.5a10 10 0 0 1 14 0M8.5 16a5.5 5.5 0 0 1 7 0"/><circle cx="12" cy="19.5" r="1.2"/><path d="M2 9a15 15 0 0 1 20 0"/>',
    router: '<rect x="2" y="13" width="20" height="8" rx="2"/><path d="M6 17h.01M10 17h.01M17 13V9M7 13V9"/><circle cx="17" cy="6" r="2"/><circle cx="7" cy="6" r="2"/>',
    cart: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.6 12.4a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L22 7H6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>',
    star: '<path d="M12 2l3 6.5 7 1-5 5 1.2 7-6.2-3.3L5.8 21.5 7 14.5l-5-5 7-1z" fill="currentColor" stroke="none"/>',
    chevronL: '<path d="M15 18l-6-6 6-6"/>',
    chevronR: '<path d="M9 18l6-6-6-6"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    x: '<path d="M18 6L6 18M6 6l12 12"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    truck: '<path d="M1 3h13v11H1zM14 7h4l4 4v3h-8"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',
    shield: '<path d="M12 2l8 4v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/>',
    headset: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="2" y="14" width="4" height="6" rx="2"/><rect x="18" y="14" width="4" height="6" rx="2"/><path d="M20 20a3 3 0 0 1-3 3h-3"/>',
    card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".8" fill="currentColor"/>',
    telegram: '<path d="M21.5 4.3L2.9 11.5c-.9.3-.9 1.5 0 1.8l4.5 1.5 1.7 5.2c.3.8 1.3 1 1.8.3l2.4-2.7 4.6 3.4c.7.5 1.7.1 1.9-.8l3-14c.2-1-.7-1.8-1.3-1.9z" fill="none"/><path d="M8.5 15l9-8-6 8.5"/>',
    whatsapp: '<path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.5L3 21l2-5.2A8.5 8.5 0 1 1 21 11.5z"/><path d="M8.5 9c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 1c-1-.5-1.5-1-2-2l1-1-1-2z"/>',
    arrowLeft: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
    arrowRight: '<path d="M5 12h14M12 5l7 7-7 7"/>',
    sliders: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
    box: '<path d="M21 8v8l-9 5-9-5V8l9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
    zap: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    alert: '<path d="M10.3 3.9L2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    wrench: '<path d="M14.7 6.3a4 4 0 1 0 5 5L21 21l-3-3-9.3-9.3a4 4 0 1 1-5-5L6.3 5z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    tag: '<path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0l-7.2-7.2a2 2 0 0 1-.6-1.4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 1.4.6l6.4 6.4a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
    gift: '<rect x="2" y="8" width="20" height="4"/><path d="M4 12v9h16v-9M12 8v13"/><path d="M12 8S9.5 2 7 4s1 4 5 4zM12 8s2.5-6 5-4-1 4-5 4z"/>',
    refresh: '<path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/>',
    edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z"/>',
    save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
    dashboard: '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 15l3-4 3 3 4-6"/>',
    lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    filter: '<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
    flame: '<path d="M12 2c4 4 6 7 6 10a6 6 0 0 1-12 0c0-2 1-4 3-6 1 2 3 2 3 2s-1-3 0-6z"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>'
  };
  function icon(n, cls) {
    const d = P[n] || P.box;
    return '<svg class="ico ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  }

  /* ---------- ابزار ---------- */
  const FA = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const toFa = (s) => String(s).replace(/\d/g, (d) => FA[+d]);
  const toEn = (s) => String(s).replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
  const num = (v) => Number(toEn(String(v == null ? 0 : v)).replace(/[^\d.-]/g, '')) || 0;
  const fmt = (n) => toFa(num(n).toLocaleString('en-US'));
  const money = (n) => fmt(n) + ' <span class="cur">تومان</span>';
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const qs = (s, r) => (r || document).querySelector(s);
  const qsa = (s, r) => Array.from((r || document).querySelectorAll(s));
  const params = () => Object.fromEntries(new URLSearchParams(location.search));
  const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

  /* ---------- API ---------- */
  const API = {
    async get(key) {
      try {
        const fd = new FormData();
        fd.append('action', 'get');
        fd.append('key', key);
        const token = localStorage.getItem('aht_admin_token') || '';
        if (token) fd.append('admin_token', token);
        const r = await fetch('data.php', { method: 'POST', body: fd, cache: 'no-store' });
        if (!r.ok) throw new Error('http ' + r.status);
        const j = await r.json();
        if (!j || j.ok !== true) throw new Error((j && j.error) || 'bad');
        return { ok: true, value: j.value };
      } catch (e) {
        // آفلاین یا بدون PHP: از کش مرورگر استفاده کن
        const raw = localStorage.getItem('aht_cache_' + key);
        return { ok: false, value: raw ? JSON.parse(raw) : null, offline: true };
      }
    },
    async set(key, value, token) {
      const fd = new FormData();
      fd.append('key', key);
      fd.append('value', JSON.stringify(value));
      fd.append('admin_token', token || localStorage.getItem('aht_admin_token') || '');
      const r = await fetch('data.php', { method: 'POST', body: fd, cache: 'no-store' });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || 'ذخیره نشد');
      localStorage.setItem('aht_cache_' + key, JSON.stringify(value));
      return j;
    },
    async order(order) {
      const fd = new FormData();
      fd.append('action', 'append_order');
      fd.append('order', JSON.stringify(order));
      const r = await fetch('data.php', { method: 'POST', body: fd, cache: 'no-store' });
      return r.json();
    },
    async track(code) {
      const fd = new FormData();
      fd.append('action', 'track_order');
      fd.append('code', code);
      const r = await fetch('data.php', { method: 'POST', body: fd, cache: 'no-store' });
      return r.json();
    }
  };

  /* ---------- استور ---------- */
  const S = { products: [], cats: [], slides: [], settings: {}, brands: [], loaded: false, orders: [], reviews: {} };
  const KEYS = { products: 'aht_parts', cats: 'aht_cats', slides: 'aht_slides', settings: 'aht_settings' };

  async function loadAll(force) {
    if (S.loaded && !force) return S;
    const [pr, ct, sl, st] = await Promise.all([
      API.get(KEYS.products), API.get(KEYS.cats), API.get(KEYS.slides), API.get(KEYS.settings)
    ]);
    S.products = Array.isArray(pr.value) && pr.value.length ? pr.value : AHT_SEED.products;
    S.cats = Array.isArray(ct.value) && ct.value.length ? ct.value : AHT_SEED.cats;
    S.slides = Array.isArray(sl.value) && sl.value.length ? sl.value : AHT_SEED.slides;
    S.settings = Object.assign({}, AHT_SEED.settings, st.value || {});
    S.brands = AHT_SEED.brands.slice();
    S.products.forEach((p) => { if (p.brand && S.brands.indexOf(p.brand) < 0) S.brands.push(p.brand); });
    S.loaded = true;
    applySettings();
    return S;
  }

  function applySettings() {
    const st = S.settings;
    document.title = document.title.replace(/\{site\}/g, st.siteName || 'ولتا');
    qsa('[data-site-name]').forEach((e) => (e.textContent = st.siteName || 'ولتا'));
    qsa('[data-site-latin]').forEach((e) => (e.textContent = st.siteLatin || ''));
    qsa('[data-site-phone]').forEach((e) => { e.textContent = st.phone || ''; if (e.tagName === 'A') e.href = 'tel:' + toEn(st.phone || '').replace(/[^\d+]/g, ''); });
    qsa('[data-site-mobile]').forEach((e) => { e.textContent = st.mobile || ''; if (e.tagName === 'A') e.href = 'tel:' + toEn(st.mobile || '').replace(/[^\d+]/g, ''); });
    qsa('[data-site-address]').forEach((e) => (e.textContent = st.address || ''));
    qsa('[data-site-hours]').forEach((e) => (e.textContent = st.hours || ''));
    qsa('[data-site-email]').forEach((e) => { e.textContent = st.email || ''; if (e.tagName === 'A') e.href = 'mailto:' + st.email; });
    qsa('[data-site-about]').forEach((e) => (e.textContent = st.about || ''));
  }

  const catById = (id) => S.cats.find((c) => c.id === id) || { id: id, name: id, full: id, icon: 'box' };
  const prodById = (id) => S.products.find((p) => String(p.id) === String(id));
  const activeProducts = () => S.products.filter((p) => p.active !== false);
  const discountPct = (p) => (p.oldPrice && num(p.oldPrice) > num(p.price) ? Math.round((1 - num(p.price) / num(p.oldPrice)) * 100) : 0);
  const inStock = (p) => num(p.stock) > 0;

  /* ---------- سبد خرید ---------- */
  const CART_KEY = 'aht_cart_v1';
  let cart = [];
  function cartLoad() {
    try { cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]') || []; } catch (e) { cart = []; }
    cart = cart.filter((l) => prodById(l.id) || l.build);
  }
  function cartSave() { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
  function cartCount() { return cart.reduce((s, l) => s + num(l.qty), 0); }
  function cartTotal() {
    return cart.reduce((s, l) => {
      if (l.build) return s + num(l.build.total) * num(l.qty);
      const p = prodById(l.id); return s + (p ? num(p.price) * num(l.qty) : 0);
    }, 0);
  }
  function cartAdd(id, qty, silent) {
    const p = prodById(id); if (!p) return;
    if (!inStock(p)) { toast('این کالا فعلاً موجود نیست', 'err'); return; }
    const line = cart.find((l) => l.id === id && !l.build);
    if (line) line.qty = Math.min(num(line.qty) + (qty || 1), num(p.stock) || 99);
    else cart.push({ id: id, qty: qty || 1 });
    cartSave(); renderCart(); toast('«' + shortName(p.name) + '» به سبد اضافه شد', 'ok');
    if (!silent) openDrawer();
  }
  function cartAddBuild(build) { cart.push({ build: build, qty: 1, key: 'b' + Date.now() }); cartSave(); renderCart(); toast('سیستم اسمبل‌شده به سبد اضافه شد', 'ok'); openDrawer(); }
  function cartSetQty(idx, qty) {
    const l = cart[idx]; if (!l) return;
    if (qty <= 0) cart.splice(idx, 1); else l.qty = qty;
    cartSave(); renderCart();
  }
  function cartRemove(idx) { cart.splice(idx, 1); cartSave(); renderCart(); }
  function shortName(n) { return String(n).length > 34 ? String(n).slice(0, 34) + '…' : n; }

  function renderCart() {
    const badge = qs('#cartCount');
    const n = cartCount();
    if (badge) { badge.textContent = toFa(n); badge.style.display = n ? 'grid' : 'none'; }
    const body = qs('#cartBody'), foot = qs('#cartFoot');
    if (!body) return;
    if (!cart.length) {
      body.innerHTML = '<div class="empty-state">' + icon('cart') + '<b>سبد خرید خالی است</b><span>از میان قطعات و تجهیزات، انتخاب خود را انجام دهید</span>' +
        '<a class="btn btn-soft btn-sm" href="shop.html" style="margin-top:6px">مشاهده محصولات</a></div>';
      if (foot) foot.innerHTML = '';
      return;
    }
    body.innerHTML = cart.map((l, i) => {
      if (l.build) {
        return '<div class="cart-line"><div style="width:64px;height:64px;border-radius:10px;background:rgba(0,209,255,.1);display:grid;place-items:center;color:var(--brand);flex:none">' + icon('cpu') + '</div>' +
          '<div class="cl-body"><b>سیستم اسمبل‌شده ولتا (' + toFa(l.build.parts.length) + ' قطعه)</b>' +
          '<div class="cl-meta">' + esc(l.build.parts.map((x) => x.name).join(' + ').slice(0, 70)) + '…</div>' +
          '<div class="qty"><button data-cq="' + i + '" data-d="-1">−</button><span>' + toFa(l.qty) + '</span><button data-cq="' + i + '" data-d="1">+</button></div></div>' +
          '<div style="display:flex;flex-direction:column;align-items:flex-end;justify-content:space-between"><span class="cl-price">' + fmt(num(l.build.total) * num(l.qty)) + '</span>' +
          '<button class="cl-remove" data-crm="' + i + '" aria-label="حذف">' + icon('x') + '</button></div></div>';
      }
      const p = prodById(l.id); if (!p) return '';
      return '<div class="cart-line"><img src="' + esc(p.img) + '" alt="' + esc(p.name) + '" loading="lazy">' +
        '<div class="cl-body"><b>' + esc(p.name) + '</b><div class="cl-meta">' + esc(p.brand || '') + (p.warranty ? ' — ' + esc(p.warranty) : '') + '</div>' +
        '<div class="qty"><button data-cq="' + i + '" data-d="-1">−</button><span>' + toFa(l.qty) + '</span><button data-cq="' + i + '" data-d="1">+</button></div></div>' +
        '<div style="display:flex;flex-direction:column;align-items:flex-end;justify-content:space-between"><span class="cl-price">' + fmt(num(p.price) * num(l.qty)) + '</span>' +
        '<button class="cl-remove" data-crm="' + i + '" aria-label="حذف">' + icon('trash') + '</button></div></div>';
    }).join('');

    const total = cartTotal();
    const freeShip = num(S.settings.freeShipThreshold);
    const ship = total >= freeShip || total === 0 ? 0 : num(S.settings.shipCost);
    if (foot) {
      foot.innerHTML =
        '<div class="sum-row"><span>جمع کالاها</span><b class="num">' + fmt(total) + ' تومان</b></div>' +
        '<div class="sum-row"><span>هزینه ارسال</span><b>' + (ship === 0 ? '<span style="color:var(--brand-3)">رایگان</span>' : '<span class="num">' + fmt(ship) + ' تومان</span>') + '</b></div>' +
        (ship > 0 ? '<div class="hint" style="margin-bottom:8px">با ' + fmt(freeShip - total) + ' تومان خرید بیشتر، ارسال رایگان می‌شود</div>' : '') +
        '<div class="sum-row total"><span>مبلغ قابل پرداخت</span><b class="num" style="color:#7de6ff">' + fmt(total + ship) + ' تومان</b></div>' +
        '<button class="btn btn-block btn-lg" id="goCheckout" style="margin-top:10px">' + icon('card') + ' ادامه و ثبت سفارش</button>';
    }
  }

  /* ---------- سبد/مودال ---------- */
  function ensureShell() {
    if (qs('#drawerShell')) return;
    document.body.insertAdjacentHTML('beforeend',
      '<div class="overlay" id="overlay"></div>' +
      '<aside class="drawer" id="cartDrawer" aria-label="سبد خرید">' +
      '<div class="drawer-head"><h3>' + icon('cart') + ' سبد خرید من</h3><button class="close-x" id="closeCart">' + icon('x') + '</button></div>' +
      '<div class="drawer-body" id="cartBody"></div><div class="drawer-foot" id="cartFoot"></div></aside>' +
      '<div class="modal" id="modal"><div class="modal-box" id="modalBox"></div></div>' +
      '<div class="toast-wrap" id="toasts"></div>' +
      '<div id="drawerShell" hidden></div>');
    qs('#overlay').addEventListener('click', () => { closeDrawer(); closeModal(); });
    qs('#closeCart').addEventListener('click', closeDrawer);
    qs('#cartBody').addEventListener('click', (e) => {
      const q = e.target.closest('[data-cq]'), r = e.target.closest('[data-crm]');
      if (q) { const i = +q.dataset.cq; cartSetQty(i, num(cart[i].qty) + (+q.dataset.d)); }
      if (r) { cartRemove(+r.dataset.crm); }
    });
    qs('#cartFoot').addEventListener('click', (e) => { if (e.target.closest('#goCheckout')) openCheckout(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeDrawer(); closeModal(); } });
  }
  function openDrawer() { ensureShell(); renderCart(); qs('#overlay').classList.add('open'); qs('#cartDrawer').classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeDrawer() { const d = qs('#cartDrawer'); if (d) d.classList.remove('open'); const o = qs('#overlay'); if (o && !qs('#modal.open')) o.classList.remove('open'); document.body.style.overflow = ''; }
  function openModal(html, cls) {
    ensureShell();
    const box = qs('#modalBox');
    box.className = 'modal-box ' + (cls || '');
    box.innerHTML = html;
    qs('#modal').classList.add('open'); qs('#overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
    const x = box.querySelector('[data-close]'); if (x) x.addEventListener('click', closeModal);
    return box;
  }
  function closeModal() { const m = qs('#modal'); if (m) m.classList.remove('open'); const o = qs('#overlay'); if (o && !qs('#cartDrawer.open')) o.classList.remove('open'); document.body.style.overflow = ''; }

  function toast(msg, type) {
    ensureShell();
    const t = document.createElement('div');
    t.className = 'toast ' + (type || '');
    t.innerHTML = icon(type === 'err' ? 'alert' : 'check') + '<span>' + esc(msg) + '</span>';
    qs('#toasts').appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateY(8px)'; t.style.transition = '.3s'; }, 2600);
    setTimeout(() => t.remove(), 3000);
  }

  /* ---------- هدر و فوتر ---------- */
  function headerHTML() {
    const st = S.settings;
    const navCats = S.cats.filter((c) => c.active !== false).sort((a, b) => (a.order || 0) - (b.order || 0));
    const partsCats = navCats.filter((c) => ['cpu', 'mb', 'ram', 'vga', 'storage', 'cooler', 'case', 'psu', 'deco'].includes(c.id));
    const page = (location.pathname.split('/').pop() || 'index.html');
    const megaItems = partsCats.map((c) => '<a class="mega-item" href="shop.html?cat=' + c.id + '"><span class="mi-ico">' + icon(c.icon) + '</span><span>' + esc(c.full || c.name) + '</span></a>').join('');
    return '' +
      '<div class="container header-top">' +
        '<a href="index.html" class="logo" aria-label="' + esc(st.siteName) + '">' +
          '<span class="logo-mark"><svg viewBox="0 0 48 48" fill="none"><path d="M14.2 17 L24 33.6 L33.8 17" stroke="#fff" stroke-width="5.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="24" cy="12.2" r="2.8" fill="#fff"/></svg></span>' +
          '<span class="logo-text"><b data-site-name>' + esc(st.siteName) + '</b><span data-site-latin>' + esc(st.siteLatin || '') + '</span></span>' +
        '</a>' +
        '<div class="search-box">' + icon('search') +
          '<input type="search" id="siteSearch" placeholder="جستجوی قطعه، برند یا مدل… (مثلاً RTX 4060)" autocomplete="off" aria-label="جستجو">' +
          '<div class="search-results hidden" id="searchResults"></div>' +
        '</div>' +
        '<div class="header-actions">' +
          '<a class="phone-chip" href="tel:' + toEn(st.mobile || '').replace(/[^\d+]/g, '') + '">' + icon('phone') + '<span data-site-mobile>' + esc(st.mobile || '') + '</span></a>' +
          '<a class="icon-btn" href="admin.html" title="ورود مدیر" aria-label="پنل مدیریت">' + icon('user') + '</a>' +
          '<button class="icon-btn cart-btn" id="openCart" aria-label="سبد خرید">' + icon('cart') + '<span class="cart-count" id="cartCount">۰</span></button>' +
        '</div>' +
      '</div>' +
      '<nav class="header-nav"><div class="container nav-inner">' +
        '<a class="nav-link' + (page === 'index.html' || page === '' ? ' active' : '') + '" href="index.html">خانه</a>' +
        '<div class="has-mega"><a class="nav-link' + (/^(shop|product)\.html$/.test(page) ? ' active' : '') + '" href="shop.html">قطعات کامپیوتر ' + icon('chevronR') + '</a>' +
          '<div class="mega"><div class="mega-grid">' + megaItems + '</div>' +
            '<div class="mega-promo"><div><h4>' + icon('wrench') + ' اسمبل هوشمند</h4><p>قطعات سازگار را انتخاب کن، قیمت نهایی و توان مصرفی را همان لحظه ببین.</p></div>' +
            '<a class="btn btn-sm" href="build.html">شروع اسمبل</a></div></div></div>' +
        '<a class="nav-link' + (page === 'build.html' ? ' active' : '') + '" href="build.html">' + icon('wrench') + ' اسمبل هوشمند</a>' +
        '<a class="nav-link" href="shop.html?deal=1">تخفیف‌ها <span class="dot"></span></a>' +
        '<a class="nav-link" href="shop.html?cat=periph">تجهیزات جانبی</a>' +
        '<a class="nav-link" href="shop.html?cat=network">تجهیزات شبکه</a>' +
        '<a class="nav-link' + (page === 'about.html' ? ' active' : '') + '" href="about.html">دربارهٔ ولتا</a>' +
        '<span class="nav-sep"></span>' +
        '<a class="nav-link" href="shop.html?cat=cpu">پردازنده</a>' +
        '<a class="nav-link" href="shop.html?cat=vga">کارت گرافیک</a>' +
        '<a class="nav-link" href="shop.html?cat=storage">حافظه جانبی</a>' +
        '<a class="nav-link" href="shop.html?cat=case">کیس</a>' +
      '</div></nav>';
  }

  function footerHTML() {
    const st = S.settings;
    const navCats = S.cats.filter((c) => c.active !== false);
    return '<div class="container">' +
      '<div class="footer-top">' +
        '<div class="footer-col footer-about">' +
          '<div class="logo" style="margin-bottom:12px"><span class="logo-mark"><svg viewBox="0 0 48 48" fill="none"><path d="M14.2 17 L24 33.6 L33.8 17" stroke="#fff" stroke-width="5.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="24" cy="12.2" r="2.8" fill="#fff"/></svg></span>' +
          '<span class="logo-text"><b data-site-name>' + esc(st.siteName) + '</b><span data-site-latin>' + esc(st.siteLatin || '') + '</span></span></div>' +
          '<p data-site-about>' + esc(st.about) + '</p>' +
          '<ul class="footer-contact">' +
            '<li>' + icon('phone') + '<a href="tel:' + toEn(st.phone || '').replace(/[^\d+]/g, '') + '" data-site-phone>' + esc(st.phone) + '</a></li>' +
            '<li>' + icon('phone') + '<a href="tel:' + toEn(st.mobile || '').replace(/[^\d+]/g, '') + '" data-site-mobile>' + esc(st.mobile) + '</a></li>' +
            '<li>' + icon('box') + '<span data-site-address>' + esc(st.address) + '</span></li>' +
            '<li>' + icon('clock') + '<span data-site-hours>' + esc(st.hours) + '</span></li>' +
          '</ul>' +
          '<div class="socials">' +
            (st.instagram ? '<a href="' + esc(st.instagram) + '" target="_blank" rel="noopener" aria-label="اینستاگرام">' + icon('instagram') + '</a>' : '') +
            (st.telegram ? '<a href="' + esc(st.telegram) + '" target="_blank" rel="noopener" aria-label="تلگرام">' + icon('telegram') + '</a>' : '') +
            (st.whatsapp ? '<a href="' + esc(st.whatsapp) + '" target="_blank" rel="noopener" aria-label="واتساپ">' + icon('whatsapp') + '</a>' : '') +
          '</div>' +
        '</div>' +
        '<div class="footer-col"><h4>دسته‌بندی قطعات</h4><ul>' +
          navCats.slice(0, 7).map((c) => '<li><a href="shop.html?cat=' + c.id + '">' + esc(c.full || c.name) + '</a></li>').join('') + '</ul></div>' +
        '<div class="footer-col"><h4>خرید و پشتیبانی</h4><ul>' +
          '<li><a href="build.html">اسمبل هوشمند</a></li>' +
          '<li><a href="shop.html?deal=1">تخفیف‌های ویژه</a></li>' +
          '<li><a href="shop.html">همه محصولات</a></li>' +
          '<li><a href="track.html">پیگیری سفارش</a></li>' +
          '<li><a href="about.html">داستان ولتا</a></li>' +
          '<li><a href="admin.html">ورود مدیر</a></li>' +
        '</ul></div>' +
        '<div class="footer-col"><h4>تضمین خرید مطمئن</h4>' +
          '<ul class="footer-contact">' +
            '<li>' + icon('shield') + '<span>گارانتی اصالت و سلامت کالا</span></li>' +
            '<li>' + icon('truck') + '<span>ارسال به سراسر ایران</span></li>' +
            '<li>' + icon('card') + '<span>پرداخت کارت به کارت و آپلود فیش</span></li>' +
            '<li>' + icon('refresh') + '<span>۷ روز ضمانت بازگشت کالا</span></li>' +
          '</ul>' +
          '<a class="btn btn-soft btn-sm" href="build.html" style="margin-top:8px">' + icon('wrench') + ' سیستم خودت را ببند</a>' +
        '</div>' +
      '</div>' +
      '<div class="footer-bottom">' +
        '<span>© ' + toFa(new Date().getFullYear() - 621 + 621) + ' — تمامی حقوق برای <b data-site-name>' + esc(st.siteName) + '</b> محفوظ است.</span>' +
        '<div class="footer-badges">' +
          '<span class="f-badge">' + icon('shield') + ' نماد اعتماد الکترونیکی</span>' +
          '<span class="f-badge">' + icon('lock') + ' پرداخت امن</span>' +
          '<span class="f-badge">' + icon('truck') + ' ارسال سریع</span>' +
        '</div>' +
      '</div></div>';
  }

  function mountChrome() {
    const h = qs('#siteHeader'); if (h) { h.className = 'site-header'; h.innerHTML = headerHTML(); }
    const f = qs('#siteFooter'); if (f) { f.className = 'site-footer'; f.innerHTML = footerHTML(); }
    ensureShell();
    renderCart();
    const oc = qs('#openCart'); if (oc) oc.addEventListener('click', (e) => { e.preventDefault(); openDrawer(); });
    /* جستجوی زنده */
    const inp = qs('#siteSearch'), res = qs('#searchResults');
    if (inp && res) {
      const run = debounce(() => {
        const q = inp.value.trim();
        if (q.length < 2) { res.classList.add('hidden'); return; }
        const found = activeProducts().filter((p) => (p.name + ' ' + (p.brand || '') + ' ' + JSON.stringify(p.specs || '')).toLowerCase().includes(q.toLowerCase())).slice(0, 6);
        res.innerHTML = found.length
          ? found.map((p) => '<a href="product.html?id=' + encodeURIComponent(p.id) + '"><img src="' + esc(p.img) + '" alt=""><span>' + esc(p.name) + '</span><span class="sr-price">' + fmt(p.price) + '</span></a>').join('')
          : '<div style="padding:14px;font-size:12.5px;color:var(--muted)">نتیجه‌ای پیدا نشد — نام قطعه یا برند را کامل‌تر بنویسید</div>';
        res.classList.remove('hidden');
      }, 180);
      inp.addEventListener('input', run);
      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { const q = inp.value.trim(); if (q) location.href = 'shop.html?q=' + encodeURIComponent(q); }
      });
      document.addEventListener('click', (e) => { if (!e.target.closest('.search-box')) res.classList.add('hidden'); });
    }
    /* جستجو با پارامتر q در صفحه فروشگاه */
    const pp = params();
    if (inp && pp.q) inp.value = pp.q;
  }

  /* ---------- کارت محصول ---------- */
  function specTags(p) {
    const s = p.specs || {}; const out = [];
    if (p.cat === 'cpu') { if (s.socket) out.push(s.socket); if (s.cores) out.push(toFa(s.cores) + ' هسته'); }
    else if (p.cat === 'mb') { if (s.socket) out.push(s.socket); if (s.ramType) out.push(s.ramType); if (s.formFactor) out.push(s.formFactor); }
    else if (p.cat === 'ram') { if (s.capacity) out.push(s.capacity); if (s.ramType) out.push(s.ramType); if (s.speed) out.push(toFa(s.speed) + 'MHz'); }
    else if (p.cat === 'vga') { if (s.vram) out.push(s.vram); if (s.tdp) out.push(toFa(s.tdp) + ' وات'); }
    else if (p.cat === 'storage') { if (s.capacity) out.push(s.capacity); if (s.interface) out.push(s.interface); }
    else if (p.cat === 'cooler') { if (s.type) out.push(s.type); if (s.tdp) out.push('تا ' + toFa(s.tdp) + ' وات'); }
    else if (p.cat === 'case') { if (s.maxVga) out.push('گرافیک تا ' + toFa(s.maxVga) + 'mm'); }
    else if (p.cat === 'psu') { if (s.wattage) out.push(toFa(s.wattage) + ' وات'); if (s.efficiency) out.push(String(s.efficiency).replace('80Plus ', '')); }
    else if (p.cat === 'deco') { if (s.size) out.push(s.size); if (s.rgb) out.push(s.rgb); }
    else if (p.cat === 'periph') { if (s.type) out.push(s.type); if (s.refresh) out.push(toFa(s.refresh)); }
    else if (p.cat === 'network') { if (s.speed) out.push(toFa(s.speed)); if (s.ports) out.push(s.ports); }
    return out.slice(0, 3).map((t) => '<span class="spec-tag">' + esc(t) + '</span>').join('');
  }

  function productCard(p) {
    const off = discountPct(p);
    const out = !inStock(p);
    const fav = isFav(p.id);
    return '<article class="prod" data-id="' + esc(p.id) + '">' +
      '<div class="prod-media">' +
        '<div class="prod-badges">' +
          (off ? '<span class="badge-off">' + toFa(off) + '٪ تخفیف</span>' : '') +
          ((p.tags || []).includes('پرفروش') ? '<span class="badge-hot">پرفروش</span>' : '') +
          (!off && (p.tags || []).includes('حرفه‌ای') ? '<span class="badge-new">حرفه‌ای</span>' : '') +
        '</div>' +
        '<button class="prod-fav' + (fav ? ' on' : '') + '" data-fav="' + esc(p.id) + '" aria-label="علاقه‌مندی">' + icon('heart') + '</button>' +
        '<a href="product.html?id=' + encodeURIComponent(p.id) + '"><img src="' + esc(p.img) + '" alt="' + esc(p.name) + '" loading="lazy"></a>' +
        (out ? '<div class="stock-out"><span>ناموجود</span></div>' : '') +
      '</div>' +
      '<div class="prod-body">' +
        '<div class="prod-brand"><span>' + esc(p.brand || '') + '</span>' + (p.warranty ? '<span class="warranty">• ' + esc(p.warranty) + '</span>' : '') + '</div>' +
        '<h3 class="prod-name"><a href="product.html?id=' + encodeURIComponent(p.id) + '">' + esc(p.name) + '</a></h3>' +
        '<div class="prod-specs">' + specTags(p) + '</div>' +
        '<div class="prod-price">' +
          (off ? '<div class="price-old">' + fmt(p.oldPrice) + ' تومان <span class="price-save">' + toFa(off) + '٪</span></div>' : '') +
          '<div class="price-now">' + fmt(p.price) + ' <span class="cur">تومان</span></div>' +
        '</div>' +
        '<div class="prod-actions">' +
          '<button class="btn btn-sm" data-add="' + esc(p.id) + '"' + (out ? ' disabled' : '') + '>' + icon('cart') + ' افزودن</button>' +
          '<a class="icon-btn" href="product.html?id=' + encodeURIComponent(p.id) + '" title="جزئیات">' + icon('info') + '</a>' +
        '</div>' +
      '</div></article>';
  }

  function bindProducts(root) {
    (root || document).addEventListener('click', (e) => {
      const add = e.target.closest('[data-add]');
      if (add) { e.preventDefault(); cartAdd(add.dataset.add, 1); }
      const fav = e.target.closest('[data-fav]');
      if (fav) { e.preventDefault(); toggleFav(fav.dataset.fav); fav.classList.toggle('on'); }
    });
  }

  /* ---------- علاقه‌مندی ---------- */
  const FAV_KEY = 'aht_favs';
  function favs() { try { return JSON.parse(localStorage.getItem(FAV_KEY) || '[]'); } catch (e) { return []; } }
  function isFav(id) { return favs().includes(id); }
  function toggleFav(id) {
    const list = favs(); const i = list.indexOf(id);
    if (i > -1) list.splice(i, 1); else list.push(id);
    localStorage.setItem(FAV_KEY, JSON.stringify(list));
    toast(i > -1 ? 'از علاقه‌مندی‌ها حذف شد' : 'به علاقه‌مندی‌ها اضافه شد', 'ok');
  }

  /* ---------- ثبت سفارش ---------- */
  function openCheckout() {
    if (!cart.length) { toast('سبد خرید خالی است', 'err'); return; }
    const total = cartTotal();
    const freeShip = num(S.settings.freeShipThreshold);
    const ship = total >= freeShip ? 0 : num(S.settings.shipCost);
    const st = S.settings;
    closeDrawer();
    const box = openModal(
      '<div class="modal-head"><h3>' + icon('card') + ' ثبت سفارش</h3><button class="close-x" data-close>' + icon('x') + '</button></div>' +
      '<div class="modal-body">' +
        '<div style="background:rgba(0,209,255,.06);border:1px solid rgba(0,209,255,.18);border-radius:12px;padding:11px 13px;font-size:11.5px;color:var(--text-2);margin-bottom:14px">' +
          icon('info') + ' سفارش شما پس از ثبت، توسط کارشناسان تأیید و برای هماهنگی ارسال با شما تماس گرفته می‌شود.</div>' +
        '<form id="checkoutForm" novalidate>' +
          '<div class="form-row"><div class="field"><label>نام و نام خانوادگی <span class="req">*</span></label><input class="input" name="name" required placeholder="مثلاً علی محمدی"></div>' +
          '<div class="field"><label>شماره موبایل <span class="req">*</span></label><input class="input num" name="phone" inputmode="numeric" required placeholder="09xxxxxxxxx"></div></div>' +
          '<div class="form-row"><div class="field"><label>استان</label><select class="select" name="province" id="ckProvince"></select></div>' +
          '<div class="field"><label>شهر</label><input class="input" name="city" placeholder="شهر"></div></div>' +
          '<div class="field"><label>آدرس کامل <span class="req">*</span></label><textarea class="textarea" name="address" required placeholder="خیابان، کوچه، پلاک، واحد"></textarea></div>' +
          '<div class="form-row"><div class="field"><label>کد پستی</label><input class="input num" name="postal" inputmode="numeric" placeholder="۱۰ رقم"></div>' +
          '<div class="field"><label>روش ارسال</label><select class="select" name="shipping"><option value="tipax">تیپاکس (پیشنهادی)</option><option value="barbari">باربری — برای سفارش‌های حجیم</option></select></div></div>' +
          '<div class="field"><label>توضیح سفارش (اختیاری)</label><input class="input" name="note" placeholder="مثلاً ساعت تحویل یا مشخصات سیستم"></div>' +
          '<div style="background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:12px 14px;margin-top:6px">' +
            '<div class="sum-row"><span>جمع کالاها</span><b class="num">' + fmt(total) + ' تومان</b></div>' +
            '<div class="sum-row"><span>ارسال</span><b>' + (ship ? fmt(ship) + ' تومان' : 'رایگان') + '</b></div>' +
            '<div class="sum-row total"><span>مبلغ نهایی</span><b class="num" style="color:#7de6ff">' + fmt(total + ship) + ' تومان</b></div>' +
          '</div>' +
          '<div class="err" id="ckErr"></div>' +
          '<button class="btn btn-block btn-lg" type="submit" style="margin-top:8px">' + icon('check') + ' ثبت نهایی سفارش</button>' +
          '<div class="hint" style="text-align:center">پرداخت پس از تماس کارشناس: کارت‌به‌کارت به ' + esc(st.cardNumber) + ' — ' + esc(st.cardOwner) + '</div>' +
        '</form>' +
      '</div>');
    /* استان‌ها */
    const provSel = box.querySelector('#ckProvince');
    const provinces = (w.IRAN_PROVINCES || ['یزد', 'تهران', 'اصفهان', 'فارس', 'خراسان رضوی', 'آذربایجان شرقی', 'البرز', 'خوزستان', 'کرمان', 'گیلان']);
    provSel.innerHTML = provinces.map((p) => {
      const nm = typeof p === 'string' ? p : p.name;
      return '<option' + (/تهران/.test(nm) ? ' selected' : '') + '>' + esc(nm) + '</option>';
    }).join('');
    box.querySelector('#checkoutForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const f = e.target;
      const name = f.name.value.trim(), phone = toEn(f.phone.value).replace(/\D/g, '');
      const errEl = box.querySelector('#ckErr');
      if (name.length < 3) { errEl.textContent = 'نام و نام خانوادگی را کامل وارد کنید'; return; }
      if (!/^09\d{9}$/.test(phone)) { errEl.textContent = 'شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد'; return; }
      if (f.address.value.trim().length < 10) { errEl.textContent = 'آدرس را کامل‌تر وارد کنید'; return; }
      errEl.textContent = '';
      const btn = f.querySelector('button[type=submit]'); btn.disabled = true; btn.textContent = 'در حال ثبت…';
      const code = 'AHT-' + Date.now().toString().slice(-8);
      const order = {
        code: code, fname: name, lname: '', phone: phone, province: f.province.value, city: f.city.value,
        address: f.address.value.trim(), postal: toEn(f.postal.value).replace(/\D/g, ''),
        items: cart.map((l) => l.build
          ? ('سیستم اسمبل‌شده: ' + l.build.parts.map((x) => x.name).join(' + '))
          : (prodById(l.id) ? prodById(l.id).name + ' × ' + toFa(l.qty) : '')),
        itemsDetail: cart.map((l) => l.build ? { build: 1, parts: l.build.parts.map((x) => x.name), qty: l.qty, price: l.build.total } : { id: l.id, qty: l.qty, price: prodById(l.id) ? prodById(l.id).price : 0 }),
        note: f.note.value.trim(), total: fmt(total + ship) + ' تومان', totalRaw: total + ship,
        shippingMethod: f.shipping.value, payMethod: 'card',
        date: new Date().toLocaleDateString('fa-IR'), dateISO: new Date().toISOString(), status: 'pending'
      };
      try {
        const r = await API.order(order);
        if (!r || !r.ok) throw new Error((r && r.error) || 'ثبت نشد');
        cart = []; cartSave(); renderCart();
        box.innerHTML = '<div class="modal-head"><h3>' + icon('check') + ' سفارش ثبت شد</h3><button class="close-x" data-close>' + icon('x') + '</button></div>' +
          '<div class="modal-body" style="text-align:center;padding:30px 22px">' +
            '<div style="width:66px;height:66px;border-radius:50%;margin:0 auto 14px;display:grid;place-items:center;background:rgba(37,208,125,.14);color:#2ee08a">' + icon('check') + '</div>' +
            '<h3 style="font-size:16px;margin-bottom:8px">سفارش شما با موفقیت ثبت شد</h3>' +
            '<p style="font-size:12.5px;color:var(--text-2);line-height:2">کد پیگیری سفارش:<br><b class="num" style="font-size:19px;color:#7de6ff;letter-spacing:1px">' + esc(code) + '</b></p>' +
            '<p style="font-size:12px;color:var(--muted);margin-top:10px">کارشناسان ما در ساعات کاری با شما تماس می‌گیرند. این کد را نزد خود نگه دارید.</p>' +
            '<div style="display:flex;gap:8px;justify-content:center;margin-top:16px"><a class="btn btn-soft btn-sm" href="shop.html">ادامه خرید</a><a class="btn btn-sm" href="track.html?code=' + encodeURIComponent(code) + '">پیگیری سفارش</a></div>' +
          '</div>';
        box.querySelector('[data-close]').addEventListener('click', closeModal);
      } catch (err) {
        errEl.textContent = 'ثبت سفارش ناموفق بود: ' + err.message + ' — لطفاً دوباره تلاش کنید یا با پشتیبانی تماس بگیرید.';
        btn.disabled = false; btn.innerHTML = icon('check') + ' ثبت نهایی سفارش';
      }
    });
  }

  /* ---------- عمومی ---------- */
  w.AHT = {
    S, API, KEYS, icon, toFa, toEn, num, fmt, money, esc, qs, qsa, params, debounce,
    loadAll, mountChrome, productCard, bindProducts, specTags, catById, prodById, activeProducts,
    discountPct, inStock, cart, cartAdd, cartAddBuild, cartCount, cartTotal, openDrawer, closeDrawer,
    openModal, closeModal, toast, openCheckout, isFav, toggleFav, applySettings
  };
})(window);
