/* =========================================================
   پنل مدیریت ولتا
   ========================================================= */
(function () {
  const A = window.AHT;
  const { icon, fmt, toFa, toEn, num, esc, qs, qsa } = A;

  const ST = {
    token: localStorage.getItem('aht_admin_token') || '',
    user: null, tab: 'dash',
    products: [], cats: [], slides: [], settings: {}, orders: [],
    loaded: false, ordersLoaded: false
  };

  const TABS = {
    dash: { title: 'داشبورد', sub: 'نمای کلی فروشگاه', icon: 'dashboard' },
    products: { title: 'محصولات', sub: 'افزودن، ویرایش و مدیریت قطعات', icon: 'box' },
    discounts: { title: 'تخفیف‌ها', sub: 'مدیریت قیمت‌های ویژه و شگفت‌انگیز', icon: 'tag' },
    orders: { title: 'سفارش‌ها', sub: 'تأیید، لغو و پیگیری سفارش‌های مشتریان', icon: 'cart' },
    cats: { title: 'دسته‌بندی‌ها', sub: 'ساختار دسته‌بندی قطعات', icon: 'sliders' },
    slides: { title: 'اسلایدر صفحه اصلی', sub: 'مدیریت بنرهای صفحه نخست', icon: 'image' },
    settings: { title: 'تنظیمات فروشگاه', sub: 'اطلاعات تماس، ارسال و پرداخت', icon: 'wrench' },
    archive: { title: 'گزارش و بایگانی', sub: 'آمار فروش تأییدشده', icon: 'chart' }
  };

  /* ---------- شروع ---------- */
  document.addEventListener('DOMContentLoaded', async () => {
    paintSidebar();
    bindLogin();
    bindGlobal();
    if (ST.token) {
      const ok = await checkToken();
      if (ok) enterPanel(); else { localStorage.removeItem('aht_admin_token'); ST.token = ''; }
    }
  });

  function paintSidebar() {
    qsa('.aside-link[data-tab]').forEach((el) => {
      const t = TABS[el.dataset.tab];
      el.innerHTML = '<span style="display:flex;align-items:center;gap:9px">' + icon(t.icon) + t.title + '</span>' + (el.dataset.tab === 'orders' ? '<span class="badge hidden" id="pendingBadge">۰</span>' : '');
    });
    const ext = qsa('.aside-link').find((e) => e.target === '_blank' || e.getAttribute('target') === '_blank');
    if (ext) ext.innerHTML = icon('search') + 'مشاهده سایت';
    qs('#logoutBtn').innerHTML = icon('logout') + 'خروج از حساب';
  }

  function bindLogin() {
    qs('#loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const f = e.target, err = qs('#loginErr');
      const phone = toEn(f.phone.value).replace(/\D/g, '');
      const pass = f.pass.value;
      if (!/^09\d{9}$/.test(phone)) { err.textContent = 'شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود'; return; }
      if (pass.length < 4) { err.textContent = 'رمز عبور را وارد کنید'; return; }
      err.textContent = '';
      const btn = f.querySelector('button'); btn.disabled = true; btn.textContent = 'در حال ورود…';
      try {
        const fd = new FormData(); fd.append('action', 'login'); fd.append('phone', phone); fd.append('pass', pass);
        const r = await fetch('auth.php', { method: 'POST', body: fd });
        const j = await r.json();
        if (!j.ok) throw new Error(j.error || 'ورود ناموفق');
        ST.token = j.token; ST.user = j.user;
        localStorage.setItem('aht_admin_token', j.token);
        enterPanel();
      } catch (ex) {
        err.textContent = ex.message;
        btn.disabled = false; btn.textContent = 'ورود به پنل';
      }
    });
  }

  async function checkToken() {
    try {
      const r = await fetch('auth.php?action=check&token=' + encodeURIComponent(ST.token));
      const j = await r.json();
      return !!j.isAdmin;
    } catch (e) { return false; }
  }

  async function enterPanel() {
    qs('#loginWrap').classList.add('hidden');
    qs('#adminShell').classList.remove('hidden');
    qs('#adminUserName').textContent = (ST.user && ST.user.name) || 'مدیر سایت';
    await loadData();
    renderTab('dash');
  }

  async function loadData() {
    setState('loading');
    const [pr, ct, sl, st] = await Promise.all([
      A.API.get('aht_parts'), A.API.get('aht_cats'), A.API.get('aht_slides'), A.API.get('aht_settings')
    ]);
    /* اگر سرور خالی بود، کاتالوگ اولیه یک‌بار روی سرور نوشته می‌شود */
    let seeded = false;
    if (!pr.value || !pr.value.length) { ST.products = AHT_SEED.products.slice(); seeded = true; }
    else ST.products = pr.value;
    if (!ct.value || !ct.value.length) { ST.cats = AHT_SEED.cats.slice(); seeded = true; } else ST.cats = ct.value;
    if (!sl.value || !sl.value.length) { ST.slides = AHT_SEED.slides.slice(); seeded = true; } else ST.slides = sl.value;
    ST.settings = Object.assign({}, AHT_SEED.settings, st.value || {});
    if (seeded) {
      try {
        if (!pr.value || !pr.value.length) await A.API.set('aht_parts', ST.products, ST.token);
        if (!ct.value || !ct.value.length) await A.API.set('aht_cats', ST.cats, ST.token);
        if (!sl.value || !sl.value.length) await A.API.set('aht_slides', ST.slides, ST.token);
        if (!st.value) await A.API.set('aht_settings', ST.settings, ST.token);
        A.toast('کاتالوگ اولیه روی سرور بارگذاری شد', 'ok');
      } catch (e) { A.toast('بارگذاری کاتالوگ اولیه ناموفق: ' + e.message, 'err'); }
    }
    await loadOrders();
    ST.loaded = true;
    setState('saved');
    A.applySettings();
  }

  async function loadOrders() {
    const r = await A.API.get('aht_orders');
    ST.orders = Array.isArray(r.value) ? r.value : [];
    ST.ordersLoaded = true;
    const pending = ST.orders.filter((o) => (o.status || 'pending') === 'pending').length;
    const b = qs('#pendingBadge');
    if (b) { b.textContent = toFa(pending); b.classList.toggle('hidden', !pending); }
  }

  function filterRows(sel, term) {
    const t = String(term || '').trim().toLowerCase();
    qsa(sel + ' tr').forEach((tr) => {
      if (!tr.dataset.row) return;
      tr.style.display = !t || tr.dataset.row.includes(t) ? '' : 'none';
    });
  }

  function setState(kind, msg) {
    const el = qs('#saveState'), txt = qs('#saveStateText');
    if (!el) return;
    el.className = 'save-state' + (kind === 'saving' ? ' dirty' : kind === 'err' ? ' err' : '');
    txt.textContent = kind === 'saving' ? 'در حال ذخیره…' : kind === 'err' ? (msg || 'خطا در ذخیره') : kind === 'loading' ? 'در حال بارگذاری…' : 'همه‌چیز ذخیره شده';
  }

  async function persist(key, value, okMsg) {
    setState('saving');
    try {
      await A.API.set(key, value, ST.token);
      setState('saved');
      if (okMsg) A.toast(okMsg, 'ok');
      return true;
    } catch (e) {
      setState('err', 'ذخیره نشد');
      A.toast('ذخیره ناموفق: ' + e.message, 'err');
      return false;
    }
  }

  /* ---------- تعاملات عمومی ---------- */
  function bindGlobal() {
    qsa('.aside-link[data-tab]').forEach((el) => el.addEventListener('click', () => {
      renderTab(el.dataset.tab);
      qs('#adminSide').classList.remove('open');
    }));
    qs('#logoutBtn').addEventListener('click', async () => {
      try { await fetch('auth.php?action=logout&token=' + encodeURIComponent(ST.token)); } catch (e) { }
      localStorage.removeItem('aht_admin_token');
      location.reload();
    });
    const mb = qs('#menuBtn'); if (mb) mb.addEventListener('click', () => qs('#adminSide').classList.toggle('open'));
    qs('#tabBody').addEventListener('click', onAction);
    qs('#tabBody').addEventListener('change', onChange);
    qs('#tabBody').addEventListener('keydown', (e) => {
      const inp = e.target.closest('[data-disc]');
      if (inp && e.key === 'Enter') { e.preventDefault(); setDiscount(inp.dataset.disc); }
      const d = e.target.closest('#discSearch');
      if (d) {
        const term = d.value.trim().toLowerCase();
        qsa('#discTable tbody tr').forEach((tr) => { tr.style.display = !term || tr.dataset.row.includes(term) ? '' : 'none'; });
      }
    });
    qs('#tabBody').addEventListener('input', (e) => {
      if (e.target.id === 'pq') filterRows('#tabBody table.dt tbody', e.target.value);
      if (e.target.id === 'discSearch') filterRows('#discTable tbody', e.target.value);
    });
    qs('#tabBody').addEventListener('change', (e) => {
      if (e.target.id === 'pcat') { prodFilter.cat = e.target.value; renderTab('products'); }
      if (e.target.id === 'pstatus') { prodFilter.status = e.target.value; renderTab('products'); }
    });
  }

  function onAction(e) {
    const el = e.target.closest('[data-act]'); if (!el) return;
    const act = el.dataset.act, id = el.dataset.id;
    const map = {
      'add-product': () => openEditor(null),
      'edit-product': () => openEditor(id),
      'del-product': () => delProduct(id),
      'dup-product': () => dupProduct(id),
      'seed': () => seedCatalog(),
      'order-approve': () => setOrder(id, 'approved'),
      'order-cancel': () => setOrder(id, 'canceled'),
      'order-delete': () => delOrder(id),
      'order-view': () => viewOrder(id),
      'add-cat': () => addCat(),
      'del-cat': () => delCat(id),
      'add-slide': () => addSlide(),
      'del-slide': () => delSlide(id),
      'save-slides': () => saveSlides(),
      'save-settings': () => saveSettings(),
      'save-cats': () => saveCats(),
      'disc-set': () => setDiscount(id),
      'disc-clear': () => clearDiscount(id),
      'refresh-orders': async () => { await loadOrders(); renderTab('orders'); A.toast('سفارش‌ها به‌روز شد', 'ok'); },
      'export-orders': () => exportOrders(),
      'reset-catalog': () => resetCatalog(),
      'goto': () => renderTab(id)
    };
    if (map[act]) { e.preventDefault(); map[act](); }
  }

  function onChange(e) {
    const el = e.target.closest('[data-change]'); if (!el) return;
    const act = el.dataset.change, id = el.dataset.id;
    if (act === 'toggle-active') {
      const p = ST.products.find((x) => String(x.id) === String(id));
      if (!p) return;
      p.active = el.checked;
      persist('aht_parts', ST.products, p.active ? 'محصول فعال شد' : 'محصول غیرفعال شد');
    }
    if (act === 'order-status') setOrder(id, el.value);
  }

  /* ---------- رندر تب ---------- */
  function renderTab(tab) {
    ST.tab = tab;
    qsa('.aside-link[data-tab]').forEach((el) => el.classList.toggle('active', el.dataset.tab === tab));
    qs('#tabTitle').textContent = TABS[tab].title;
    qs('#tabSub').textContent = TABS[tab].sub;
    const body = qs('#tabBody');
    if (tab === 'dash') body.innerHTML = viewDash();
    else if (tab === 'products') body.innerHTML = viewProducts();
    else if (tab === 'discounts') body.innerHTML = viewDiscounts();
    else if (tab === 'orders') { body.innerHTML = viewOrders(); loadOrders().then(() => { if (ST.tab === 'orders') body.innerHTML = viewOrders(); }); }
    else if (tab === 'cats') body.innerHTML = viewCats();
    else if (tab === 'slides') body.innerHTML = viewSlides();
    else if (tab === 'settings') body.innerHTML = viewSettings();
    else if (tab === 'archive') { body.innerHTML = viewArchive(); loadOrders().then(() => { if (ST.tab === 'archive') body.innerHTML = viewArchive(); }); }
    window.scrollTo({ top: 0 });
  }

  /* ---------- داشبورد ---------- */
  function viewDash() {
    const prods = ST.products;
    const active = prods.filter((p) => p.active !== false);
    const stockSum = active.reduce((s, p) => s + num(p.stock), 0);
    const outOfStock = active.filter((p) => num(p.stock) <= 0).length;
    const approved = ST.orders.filter((o) => o.status === 'approved');
    const pending = ST.orders.filter((o) => (o.status || 'pending') === 'pending');
    const sales = approved.reduce((s, o) => s + num(o.totalRaw), 0);
    const deals = active.filter((p) => A.discountPct(p) > 0).length;
    const lowStock = active.filter((p) => num(p.stock) > 0 && num(p.stock) <= 3);

    const top = active.slice().sort((a, b) => (num(b.sold) || 0) - (num(a.sold) || 0)).slice(0, 5);

    return '<div class="stats-grid">' +
      stat('box', toFa(active.length), 'محصول فعال از ' + toFa(prods.length) + ' محصول', '') +
      stat('zap', toFa(stockSum), 'مجموع موجودی انبار', 'green') +
      stat('cart', toFa(pending.length), 'سفارش در انتظار تأیید', 'orange') +
      stat('chart', fmt(sales), 'فروش تأییدشده (تومان)', 'violet') +
      '</div>' +
      '<div style="display:grid;grid-template-columns:1.3fr 1fr;gap:14px" class="dash-cols">' +
        '<div class="admin-card"><div class="ac-head"><h3>' + icon('flame') + ' پرفروش‌ترین محصولات</h3><button class="btn btn-sm btn-ghost" data-act="goto" data-id="products">مدیریت</button></div><div class="ac-body flush"><div class="table-wrap"><table class="dt"><thead><tr><th>محصول</th><th>قیمت</th><th>فروش</th><th>موجودی</th></tr></thead><tbody>' +
          top.map((p) => '<tr><td><div class="t-prod"><img src="' + esc(p.img) + '" alt=""><div><b>' + esc(p.name.slice(0, 42)) + '</b><span>' + esc(p.brand || '') + '</span></div></div></td><td class="num">' + fmt(p.price) + '</td><td>' + toFa(p.sold || 0) + '</td><td>' + (num(p.stock) > 0 ? toFa(p.stock) : '<span style="color:#ff8ea3">ناموجود</span>') + '</td></tr>').join('') +
        '</tbody></table></div></div></div>' +
        '<div class="admin-card"><div class="ac-head"><h3>' + icon('alert') + ' نیازمند توجه</h3></div><div class="ac-body">' +
          '<div style="display:flex;flex-direction:column;gap:9px;font-size:12px">' +
            item('ناموجود', outOfStock + ' محصول', outOfStock ? 'danger' : 'ok') +
            item('موجودی کم (۳ یا کمتر)', lowStock.length + ' محصول', lowStock.length ? 'warn' : 'ok') +
            item('تخفیف فعال', deals + ' محصول', deals ? 'ok' : 'warn') +
            item('سفارش در انتظار', pending.length + ' سفارش', pending.length ? 'warn' : 'ok') +
          '</div>' +
          '<div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap">' +
            '<button class="btn btn-sm" data-act="add-product">' + icon('plus') + ' افزودن محصول</button>' +
            '<button class="btn btn-sm btn-ghost" data-act="refresh-orders">' + icon('refresh') + ' به‌روزرسانی سفارش‌ها</button>' +
          '</div>' +
        '</div></div>' +
      '</div>' +
      (pending.length ? '<div class="admin-card"><div class="ac-head"><h3>' + icon('cart') + ' آخرین سفارش‌های در انتظار</h3><button class="btn btn-sm btn-ghost" data-act="goto" data-id="orders">مشاهده همه</button></div><div class="ac-body flush">' +
        pending.slice(0, 4).map((o) => orderRow(o)).join('') + '</div></div>' : '');

    function stat(ic, val, label, cls) {
      return '<div class="stat-card ' + cls + '"><div class="sc-ico">' + icon(ic) + '</div><b class="num">' + val + '</b><span>' + label + '</span></div>';
    }
    function item(label, val, kind) {
      const color = kind === 'danger' ? '#ff8ea3' : kind === 'warn' ? '#ffc766' : '#57e6a3';
      return '<div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px dashed var(--line-soft)"><span style="color:var(--text-2)">' + label + '</span><b style="color:' + color + '">' + val + '</b></div>';
    }
  }

  /* ---------- محصولات ---------- */
  let prodFilter = { q: '', cat: '', status: '' };

  function viewProducts() {
    const list = ST.products.filter((p) => {
      if (prodFilter.cat && p.cat !== prodFilter.cat) return false;
      if (prodFilter.status === 'active' && p.active === false) return false;
      if (prodFilter.status === 'inactive' && p.active !== false) return false;
      if (prodFilter.status === 'out' && num(p.stock) > 0) return false;
      if (prodFilter.q) {
        const q = prodFilter.q.toLowerCase();
        if (!((p.name || '') + ' ' + (p.brand || '') + ' ' + p.id).toLowerCase().includes(q)) return false;
      }
      return true;
    });
    return '<div class="admin-card"><div class="ac-head">' +
      '<h3>' + icon('box') + ' لیست محصولات <span class="tag-pill">' + toFa(list.length) + ' از ' + toFa(ST.products.length) + '</span></h3>' +
      '</div>' +
      '<div class="ac-tools-row">' +
        '<input class="input" id="pq" placeholder="جستجو در نام یا برند…" value="' + esc(prodFilter.q) + '">' +
        '<select class="select" id="pcat">' +
          '<option value="">همه دسته‌ها</option>' + ST.cats.map((c) => '<option value="' + c.id + '"' + (prodFilter.cat === c.id ? ' selected' : '') + '>' + esc(c.name) + '</option>').join('') + '</select>' +
        '<select class="select" id="pstatus">' +
          '<option value="">همه وضعیت‌ها</option><option value="active"' + (prodFilter.status === 'active' ? ' selected' : '') + '>فعال</option><option value="inactive"' + (prodFilter.status === 'inactive' ? ' selected' : '') + '>غیرفعال</option><option value="out"' + (prodFilter.status === 'out' ? ' selected' : '') + '>ناموجود</option></select>' +
        '<button class="btn btn-sm" data-act="add-product">' + icon('plus') + ' محصول جدید</button>' +
      '</div>' +
      '<div class="ac-body flush"><div class="table-wrap"><table class="dt"><thead><tr>' +
        '<th>محصول</th><th>دسته</th><th>قیمت (تومان)</th><th>تخفیف</th><th>موجودی</th><th>فعال</th><th style="text-align:left">عملیات</th>' +
      '</tr></thead><tbody>' +
      (list.length ? list.map((p) => '<tr data-row="' + esc((p.name + ' ' + (p.brand || '') + ' ' + p.id).toLowerCase()) + '">' +
        '<td><div class="t-prod"><img src="' + esc(p.img) + '" alt=""><div><b>' + esc(p.name) + '</b><span>' + esc(p.brand || '') + ' — ' + esc(p.id) + '</span></div></div></td>' +
        '<td><span class="tag-pill">' + esc(A.catById(p.cat).name) + '</span></td>' +
        '<td class="num">' + fmt(p.price) + '</td>' +
        '<td>' + (A.discountPct(p) ? '<span style="color:#ff8ea3">' + toFa(A.discountPct(p)) + '٪</span>' : '<span style="color:var(--muted)">—</span>') + '</td>' +
        '<td>' + (num(p.stock) > 0 ? toFa(p.stock) : '<span style="color:#ff8ea3">۰</span>') + '</td>' +
        '<td><button class="toggle ' + (p.active !== false ? 'on' : '') + '" data-change="toggle-active" data-id="' + esc(p.id) + '" aria-label="فعال/غیرفعال"></button></td>' +
        '<td><div class="row-actions">' +
          '<button class="ra-btn" data-act="edit-product" data-id="' + esc(p.id) + '" title="ویرایش">' + icon('edit') + '</button>' +
          '<button class="ra-btn" data-act="dup-product" data-id="' + esc(p.id) + '" title="کپی">' + icon('copy') + '</button>' +
          '<button class="ra-btn danger" data-act="del-product" data-id="' + esc(p.id) + '" title="حذف">' + icon('trash') + '</button>' +
        '</div></td></tr>').join('')
        : '<tr><td colspan="7"><div class="empty-state" style="padding:34px">' + icon('box') + '<b>محصولی با این فیلترها نیست</b></div></td></tr>') +
      '</tbody></table></div></div></div>' +
      '<div class="admin-card"><div class="ac-body" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">' +
        '<span style="font-size:11.5px;color:var(--muted)">ابزارهای کاتالوگ:</span>' +
        '<button class="btn btn-sm btn-ghost" data-act="seed">' + icon('upload') + ' بارگذاری کاتالوگ نمونه</button>' +
        '<button class="btn btn-sm btn-danger" data-act="reset-catalog">' + icon('refresh') + ' بازنشانی کامل کاتالوگ</button>' +
      '</div></div>';
  }

  /* ---------- ویرایشگر محصول ---------- */
  const SPEC_DEF = {
    cpu: [['socket', 'سوکت', 'select', ['LGA1700', 'LGA1851', 'AM4', 'AM5']], ['cores', 'تعداد هسته', 'num'], ['threads', 'تعداد رشته', 'num'], ['tdp', 'توان حرارتی (وات)', 'num'], ['ramType', 'نوع حافظه', 'select', ['DDR4', 'DDR5']], ['baseClock', 'فرکانس پایه'], ['boostClock', 'فرکانس توربو'], ['cache', 'حافظه کش'], ['igpu', 'گرافیک مجتمع']],
    mb: [['socket', 'سوکت', 'select', ['LGA1700', 'LGA1851', 'AM4', 'AM5']], ['chipset', 'چیپست'], ['formFactor', 'فرم‌فاکتور', 'select', ['ATX', 'Micro-ATX', 'Mini-ITX']], ['ramType', 'نوع حافظه', 'select', ['DDR4', 'DDR5']], ['ramSlots', 'تعداد اسلات رم', 'num'], ['maxRam', 'حداکثر حافظه'], ['m2', 'تعداد اسلات M.2', 'num'], ['wifi', 'وای‌فای'], ['lan', 'شبکه']],
    ram: [['ramType', 'نوع حافظه', 'select', ['DDR4', 'DDR5']], ['capacity', 'ظرفیت'], ['sticks', 'تعداد ماژول'], ['speed', 'فرکانس (MHz)', 'num'], ['cl', 'تایمینگ'], ['voltage', 'ولتاژ'], ['rgb', 'نورپردازی']],
    vga: [['chip', 'تراشه گرافیکی'], ['vram', 'حافظه گرافیکی'], ['tdp', 'توان مصرفی (وات)', 'num'], ['length', 'طول کارت (میلی‌متر)', 'num'], ['power', 'اتصال برق'], ['ports', 'خروجی‌ها'], ['boostClock', 'فرکانس بوست']],
    storage: [['type', 'نوع', 'select', ['SSD NVMe', 'SSD SATA', 'HDD', 'هارد اکسترنال', 'فلش']], ['capacity', 'ظرفیت'], ['interface', 'رابط'], ['readSpeed', 'سرعت خواندن'], ['writeSpeed', 'سرعت نوشتن'], ['rpm', 'دور موتور'], ['formFactor', 'فرم‌فاکتور']],
    cooler: [['type', 'نوع', 'select', ['هوایی', 'مایع (AIO)']], ['sockets', 'سوکت‌های پشتیبانی', 'multi', ['LGA1700', 'LGA1200', 'AM4', 'AM5']], ['tdp', 'توان خنک‌سازی (وات)', 'num'], ['height', 'ارتفاع (میلی‌متر)', 'num'], ['radiator', 'رادیاتور'], ['fans', 'فن‌ها'], ['rgb', 'نورپردازی']],
    case: [['formFactors', 'فرم‌فاکتورهای پشتیبانی', 'multi', ['ATX', 'Micro-ATX', 'Mini-ITX']], ['maxVga', 'حداکثر طول گرافیک (mm)', 'num'], ['maxCooler', 'حداکثر ارتفاع کولر (mm)', 'num'], ['fans', 'فن‌ها'], ['glass', 'پنل شیشه‌ای'], ['psuSupport', 'پاور پشتیبانی‌شده']],
    psu: [['wattage', 'توان (وات)', 'num'], ['efficiency', 'راندمان', 'select', ['80Plus Bronze', '80Plus Gold', '80Plus Platinum', '80Plus 230V EU']], ['modular', 'ماژولار بودن', 'select', ['تمام ماژولار', 'نیمه ماژولار', 'غیر ماژولار']], ['fan', 'فن'], ['pcie8pin', 'تعداد کانکتور PCIe', 'num'], ['atxVersion', 'استاندارد ATX']],
    deco: [['type', 'نوع'], ['size', 'اندازه'], ['rgb', 'نورپردازی'], ['controller', 'کنترلر']],
    periph: [['type', 'نوع', 'select', ['کیبورد مکانیکال', 'ماوس', 'هدست', 'مانیتور', 'ماوس‌پد', 'دسته بازی', 'وبکم']], ['connection', 'اتصال'], ['resolution', 'رزولوشن'], ['refresh', 'نرخ نوسازی'], ['dpi', 'DPI'], ['switch', 'سوییچ'], ['weight', 'وزن']],
    network: [['type', 'نوع', 'select', ['روتر', 'سوییچ', 'اکستندر', 'کابل شبکه', 'اینژکتور PoE', 'اکسس پوینت']], ['speed', 'سرعت'], ['ports', 'پورت‌ها'], ['standard', 'استاندارد'], ['bands', 'باندها'], ['antennas', 'آنتن', 'num'], ['length', 'طول']]
  };

  function openEditor(id) {
    const isNew = !id;
    const p = isNew ? { id: '', name: '', brand: '', cat: (ST.cats[0] || {}).id || 'cpu', price: 0, oldPrice: 0, stock: 1, warranty: '۱۲ ماه گارانتی', rating: 4.5, sold: 0, img: 'img/box.webp', gallery: [], desc: '', features: [], tags: [], specs: {}, active: true } : JSON.parse(JSON.stringify(ST.products.find((x) => String(x.id) === String(id))));

    const box = A.openModal(
      '<div class="modal-head"><h3>' + icon('edit') + (isNew ? ' افزودن محصول جدید' : ' ویرایش محصول') + '</h3><button class="close-x" data-close>' + icon('x') + '</button></div>' +
      '<div class="modal-body"><form id="pForm">' +
        '<div class="editor-grid">' +
          '<div class="field full"><label>نام محصول <span class="req">*</span></label><input class="input" name="name" value="' + esc(p.name) + '" placeholder="مثلاً پردازنده اینتل Core i7-14700K" required></div>' +
          '<div class="field"><label>شناسه (انگلیسی، یکتا)</label><input class="input" name="id" value="' + esc(p.id) + '" ' + (isNew ? '' : 'readonly style="opacity:.6"') + ' placeholder="cpu-i7-14700k" dir="ltr"></div>' +
          '<div class="field"><label>برند</label><input class="input" name="brand" value="' + esc(p.brand) + '" list="brandList" placeholder="Intel"><datalist id="brandList">' +
            AHT_SEED.brands.map((b) => '<option>' + esc(b) + '</option>').join('') + '</datalist></div>' +
          '<div class="field"><label>دسته‌بندی <span class="req">*</span></label><select class="select" name="cat">' +
            ST.cats.map((c) => '<option value="' + c.id + '"' + (p.cat === c.id ? ' selected' : '') + '>' + esc(c.full || c.name) + '</option>').join('') + '</select></div>' +
          '<div class="field"><label>گارانتی</label><input class="input" name="warranty" value="' + esc(p.warranty || '') + '" placeholder="۳۶ ماه گارانتی"></div>' +
          '<div class="field"><label>قیمت (تومان) <span class="req">*</span></label><input class="input num" name="price" inputmode="numeric" value="' + (p.price ? fmt(p.price) : '') + '" placeholder="15800000" required></div>' +
          '<div class="field"><label>قیمت قبل از تخفیف</label><input class="input num" name="oldPrice" inputmode="numeric" value="' + (p.oldPrice ? fmt(p.oldPrice) : '') + '" placeholder="خالی = بدون تخفیف"><div class="hint">اگر پر شود، درصد تخفیف خودکار محاسبه و نشان داده می‌شود.</div></div>' +
          '<div class="field"><label>موجودی انبار</label><input class="input num" name="stock" inputmode="numeric" value="' + toFa(p.stock || 0) + '"></div>' +
          '<div class="field"><label>تعداد فروش (نمایشی)</label><input class="input num" name="sold" inputmode="numeric" value="' + toFa(p.sold || 0) + '"></div>' +
          '<div class="field"><label>امتیاز (۱ تا ۵)</label><input class="input" name="rating" value="' + esc(p.rating || 4.5) + '" dir="ltr"></div>' +
          '<div class="field full"><label>تصویر محصول</label>' +
            '<div style="display:flex;gap:10px;align-items:center">' +
              '<label class="img-drop" style="flex:1" id="imgDrop"><img src="' + esc(p.img) + '" id="imgPreview" alt=""><span>' + icon('upload') + ' کلیک کنید یا فایل تصویر را اینجا رها کنید (jpg/png/webp)</span><input type="file" id="imgFile" accept="image/*" hidden></label>' +
              '<input class="input" name="img" value="' + esc(p.img) + '" placeholder="img/product.webp" dir="ltr" style="flex:1;font-size:11.5px">' +
            '</div>' +
          '</div>' +
          '<div class="field full"><label>توضیحات</label><textarea class="textarea" name="desc" placeholder="توضیح کوتاه و فنی محصول">' + esc(p.desc || '') + '</textarea></div>' +
          '<div class="field"><label>نقاط قوت (هر خط یک مورد)</label><textarea class="textarea" name="features" style="min-height:76px">' + esc((p.features || []).join('\n')) + '</textarea></div>' +
          '<div class="field"><label>برچسب‌ها (با کاما جدا کنید)</label><input class="input" name="tags" value="' + esc((p.tags || []).join(', ')) + '" placeholder="پرفروش, پیشنهاد ما"><div class="hint">برچسب‌های پیشنهادی: پرفروش، پیشنهاد ما، اقتصادی، حرفه‌ای</div></div>' +
          '<div class="field full"><label style="display:flex;align-items:center;gap:8px"><input type="checkbox" name="active" ' + (p.active !== false ? 'checked' : '') + ' style="width:16px;height:16px;accent-color:#00d1ff"> نمایش این محصول در فروشگاه</label></div>' +
        '</div>' +
        '<div style="border-top:1px solid var(--line-soft);margin:14px 0 12px;padding-top:12px">' +
          '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:9px"><b style="font-size:12.5px">' + icon('sliders') + ' مشخصات فنی و سازگاری</b>' +
          '<span class="hint">این فیلدها در اسمبل هوشمند استفاده می‌شوند</span></div>' +
          '<div class="editor-grid" id="specDef"></div>' +
          '<div id="specExtra" style="margin-top:10px"></div>' +
          '<button type="button" class="btn btn-sm btn-ghost" id="addSpec" style="margin-top:8px">' + icon('plus') + ' افزودن مشخصه دلخواه</button>' +
        '</div>' +
      '</form></div>' +
      '<div class="modal-foot"><button class="btn" id="saveProduct">' + icon('save') + ' ذخیره محصول</button><button class="btn btn-ghost" data-close>انصراف</button><span class="err" id="pErr" style="margin-inline-start:auto"></span></div>', 'wide');

    const form = box.querySelector('#pForm');
    renderSpecFields(box, p);

    /* آپلود تصویر */
    box.querySelector('#imgFile').addEventListener('change', (e) => uploadImage(e.target.files[0], box));
    const drop = box.querySelector('#imgDrop');
    ['dragover', 'dragenter'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.style.borderColor = 'var(--brand)'; }));
    ['dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, () => { drop.style.borderColor = ''; }));
    drop.addEventListener('drop', (e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) uploadImage(f, box); });

    box.querySelector('#addSpec').addEventListener('click', () => addSpecRow(box, '', ''));
    box.querySelector('#saveProduct').addEventListener('click', () => saveProduct(box, p, isNew));
    box.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', A.closeModal));
    box.querySelector('select[name=cat]').addEventListener('change', () => {
      const current = collectSpecs(box);
      p.specs = current;
      renderSpecFields(box, p);
    });
  }

  function renderSpecFields(box, p) {
    const defs = SPEC_DEF[p.cat] || [];
    const spec = p.specs || {};
    box.querySelector('#specDef').innerHTML = defs.map(([k, label, type, opts]) => {
      const v = spec[k];
      if (type === 'select') {
        return '<div class="field"><label>' + label + '</label><select class="select" data-spec="' + k + '"><option value="">—</option>' +
          opts.map((o) => '<option' + (String(v) === String(o) ? ' selected' : '') + '>' + o + '</option>').join('') + '</select></div>';
      }
      if (type === 'multi') {
        const arr = Array.isArray(v) ? v.map(String) : [];
        return '<div class="field"><label>' + label + '</label><div style="display:flex;gap:10px;flex-wrap:wrap;padding-top:4px">' +
          opts.map((o) => '<label style="display:flex;align-items:center;gap:5px;font-size:11.5px"><input type="checkbox" data-multi="' + k + '" value="' + o + '"' + (arr.includes(o) ? ' checked' : '') + ' style="accent-color:#00d1ff">' + o + '</label>').join('') + '</div></div>';
      }
      return '<div class="field"><label>' + label + '</label><input class="input' + (type === 'num' ? ' num' : '') + '" data-spec="' + k + '" value="' + esc(v == null ? '' : v) + '"' + (type === 'num' ? ' inputmode="numeric"' : '') + '></div>';
    }).join('');

    /* مشخصه‌های دلخواه (کلیدهایی که در تعریف دسته نیستند) */
    const known = defs.map((d) => d[0]);
    const extra = Object.keys(spec).filter((k) => !known.includes(k));
    const wrap = box.querySelector('#specExtra');
    wrap.innerHTML = extra.length ? '<div class="specs-editor">' + extra.map((k) =>
      '<div class="spec-row"><input class="input" data-extra-k placeholder="کلید" value="' + esc(k) + '" dir="ltr"><input class="input" data-extra-v placeholder="مقدار" value="' + esc(Array.isArray(spec[k]) ? spec[k].join('،') : spec[k]) + '"><button type="button" class="ra-btn danger" data-del-extra>' + icon('trash') + '</button></div>').join('') + '</div>' : '';
    wrap.querySelectorAll('[data-del-extra]').forEach((b) => b.addEventListener('click', () => { b.closest('.spec-row').remove(); }));
  }

  function addSpecRow(box, k, v) {
    const wrap = box.querySelector('#specExtra');
    if (!wrap.querySelector('.specs-editor')) wrap.innerHTML = '<div class="specs-editor"></div>';
    const div = document.createElement('div');
    div.className = 'spec-row';
    div.innerHTML = '<input class="input" data-extra-k placeholder="کلید (انگلیسی)" dir="ltr" value="' + esc(k) + '"><input class="input" data-extra-v placeholder="مقدار" value="' + esc(v) + '"><button type="button" class="ra-btn danger" data-del-extra>' + icon('trash') + '</button>';
    wrap.querySelector('.specs-editor').appendChild(div);
    div.querySelector('[data-del-extra]').addEventListener('click', () => div.remove());
    div.querySelector('[data-extra-k]').focus();
  }

  function collectSpecs(box) {
    const out = {};
    box.querySelectorAll('[data-spec]').forEach((el) => {
      const k = el.dataset.spec; const v = el.value.trim();
      if (v !== '') out[k] = el.classList.contains('num') ? num(v) : v;
    });
    const multi = {};
    box.querySelectorAll('[data-multi]').forEach((el) => {
      const k = el.dataset.multi;
      if (!multi[k]) multi[k] = [];
      if (el.checked) multi[k].push(el.value);
    });
    Object.keys(multi).forEach((k) => { if (multi[k].length) out[k] = multi[k]; });
    box.querySelectorAll('.spec-row').forEach((row) => {
      const k = row.querySelector('[data-extra-k]').value.trim();
      const v = row.querySelector('[data-extra-v]').value.trim();
      if (k && v) out[k] = v.includes('،') ? v.split('،').map((s) => s.trim()) : v;
    });
    return out;
  }

  async function uploadImage(file, box) {
    if (!file) return;
    const drop = box.querySelector('#imgDrop');
    drop.innerHTML = '<span>در حال آپلود…</span>';
    try {
      const fd = new FormData();
      fd.append('file', file); fd.append('type', 'content'); fd.append('admin_token', ST.token);
      const r = await fetch('upload.php', { method: 'POST', body: fd });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || 'آپلود ناموفق');
      box.querySelector('[name=img]').value = j.url;
      drop.innerHTML = '<img src="' + j.url + '" alt=""><span>' + icon('check') + ' تصویر آپلود شد — برای تغییر کلیک کنید</span><input type="file" id="imgFile" accept="image/*" hidden>';
      drop.querySelector('#imgFile').addEventListener('change', (e) => uploadImage(e.target.files[0], box));
      A.toast('تصویر آپلود شد', 'ok');
    } catch (e) {
      drop.innerHTML = '<span style="color:#ff8ea3">آپلود ناموفق: ' + esc(e.message) + '</span><input type="file" id="imgFile" accept="image/*" hidden>';
      drop.querySelector('#imgFile').addEventListener('change', (ev) => uploadImage(ev.target.files[0], box));
    }
  }

  async function saveProduct(box, original, isNew) {
    const f = box.querySelector('#pForm');
    const err = box.querySelector('#pErr');
    const name = f.name.value.trim();
    const price = num(f.price.value);
    if (name.length < 3) { err.textContent = 'نام محصول را وارد کنید'; return; }
    if (!price) { err.textContent = 'قیمت محصول را وارد کنید'; return; }
    let id = (f.id.value.trim() || ('p' + Date.now())).replace(/[^a-zA-Z0-9_\-]/g, '-').toLowerCase();
    if (isNew && ST.products.some((x) => x.id === id)) id = id + '-' + Math.floor(Math.random() * 900 + 100);
    if (isNew && !f.id.value.trim()) id = (f.cat.value || 'p') + '-' + Math.floor(Math.random() * 90000 + 10000);

    const prod = {
      id: id,
      name: name,
      brand: f.brand.value.trim(),
      cat: f.cat.value,
      price: price,
      oldPrice: num(f.oldPrice.value) || 0,
      stock: num(f.stock.value),
      warranty: f.warranty.value.trim(),
      rating: Math.min(5, Math.max(1, parseFloat(toEn(f.rating.value)) || 4.5)),
      sold: num(f.sold.value),
      img: f.img.value.trim() || 'img/box.webp',
      gallery: original.gallery || [],
      desc: f.desc.value.trim(),
      features: f.features.value.split('\n').map((s) => s.trim()).filter(Boolean),
      tags: f.tags.value.split(',').map((s) => s.trim()).filter(Boolean),
      specs: collectSpecs(box),
      active: f.active.checked
    };
    if (prod.oldPrice && prod.oldPrice <= prod.price) prod.oldPrice = 0;

    if (isNew) ST.products.unshift(prod);
    else {
      const i = ST.products.findIndex((x) => String(x.id) === String(original.id));
      if (i > -1) ST.products[i] = prod; else ST.products.unshift(prod);
    }
    const ok = await persist('aht_parts', ST.products, isNew ? 'محصول جدید اضافه شد' : 'تغییرات محصول ذخیره شد');
    if (ok) { A.closeModal(); renderTab('products'); }
  }

  async function delProduct(id) {
    const p = ST.products.find((x) => String(x.id) === String(id));
    if (!confirm('محصول «' + (p ? p.name : id) + '» حذف شود؟ این عمل قابل بازگشت نیست.')) return;
    ST.products = ST.products.filter((x) => String(x.id) !== String(id));
    await persist('aht_parts', ST.products, 'محصول حذف شد');
    renderTab('products');
  }

  async function dupProduct(id) {
    const p = ST.products.find((x) => String(x.id) === String(id));
    if (!p) return;
    const copy = JSON.parse(JSON.stringify(p));
    copy.id = p.id + '-copy-' + Math.floor(Math.random() * 900 + 100);
    copy.name = p.name + ' (کپی)';
    copy.active = false;
    ST.products.unshift(copy);
    await persist('aht_parts', ST.products, 'نسخه کپی ساخته شد (غیرفعال)');
    openEditor(copy.id);
  }

  async function seedCatalog() {
    if (!confirm('کاتالوگ نمونه (۵۰+ قطعه) به محصولات فعلی اضافه شود؟ محصولات هم‌شناسه بازنویسی می‌شوند.')) return;
    const map = new Map(ST.products.map((p) => [String(p.id), p]));
    AHT_SEED.products.forEach((p) => map.set(String(p.id), p));
    ST.products = Array.from(map.values());
    await persist('aht_parts', ST.products, 'کاتالوگ نمونه بارگذاری شد');
    renderTab('products');
  }

  async function resetCatalog() {
    if (!confirm('همه محصولات حذف و کاتالوگ نمونه جایگزین شود؟')) return;
    ST.products = AHT_SEED.products.slice();
    await persist('aht_parts', ST.products, 'کاتالوگ بازنشانی شد');
    renderTab('products');
  }

  /* ---------- تخفیف‌ها ---------- */
  function viewDiscounts() {
    const deals = ST.products.filter((p) => A.discountPct(p) > 0).sort((a, b) => A.discountPct(b) - A.discountPct(a));
    const noDeal = ST.products.filter((p) => !A.discountPct(p));
    return '<div class="stats-grid" style="grid-template-columns:repeat(3,1fr)">' +
      '<div class="stat-card"><div class="sc-ico">' + icon('tag') + '</div><b>' + toFa(deals.length) + '</b><span>محصول تخفیف‌دار</span></div>' +
      '<div class="stat-card green"><div class="sc-ico">' + icon('zap') + '</div><b>' + toFa(deals.length ? Math.max(...deals.map(A.discountPct)) : 0) + '٪</b><span>بیشترین درصد تخفیف</span></div>' +
      '<div class="stat-card violet"><div class="sc-ico">' + icon('box') + '</div><b>' + toFa(noDeal.length) + '</b><span>بدون تخفیف</span></div></div>' +
      '<div class="admin-card"><div class="ac-head"><h3>' + icon('tag') + ' تخفیف‌های فعال</h3><span class="hint">درصد را وارد کنید و Enter بزنید</span></div>' +
      '<div class="ac-body flush"><div class="table-wrap"><table class="dt"><thead><tr><th>محصول</th><th>قیمت فعلی</th><th>قیمت قبل</th><th>درصد</th><th>تنظیم سریع</th><th></th></tr></thead><tbody>' +
        (deals.length ? deals.map((p) => '<tr>' +
          '<td><div class="t-prod"><img src="' + esc(p.img) + '" alt=""><div><b>' + esc(p.name.slice(0, 40)) + '</b><span>' + esc(A.catById(p.cat).name) + '</span></div></div></td>' +
          '<td class="num">' + fmt(p.price) + '</td><td class="num" style="text-decoration:line-through;color:var(--muted)">' + fmt(p.oldPrice) + '</td>' +
          '<td><b style="color:#ff8ea3">' + toFa(A.discountPct(p)) + '٪</b></td>' +
          '<td><input class="mini-input num" data-disc="' + esc(p.id) + '" placeholder="مثلاً ۱۵" style="width:76px" inputmode="numeric"></td>' +
          '<td><div class="row-actions"><button class="ra-btn danger" data-act="disc-clear" data-id="' + esc(p.id) + '" title="حذف تخفیف">' + icon('x') + '</button></div></td></tr>').join('')
          : '<tr><td colspan="6"><div class="empty-state" style="padding:30px">' + icon('tag') + '<b>تخفیفی فعال نیست</b><span>از لیست پایین برای محصولات تخفیف تعیین کنید</span></div></td></tr>') +
      '</tbody></table></div></div></div>' +
      '<div class="admin-card"><div class="ac-head"><h3>' + icon('plus') + ' تعیین تخفیف برای سایر محصولات</h3><input class="input" id="discSearch" placeholder="جستجوی محصول…" style="width:200px;padding:8px 11px;font-size:12px"></div>' +
      '<div class="ac-body flush"><div class="table-wrap"><table class="dt" id="discTable"><thead><tr><th>محصول</th><th>قیمت</th><th>درصد تخفیف</th><th></th></tr></thead><tbody>' +
        noDeal.map((p) => '<tr data-row="' + esc((p.name + ' ' + (p.brand || '')).toLowerCase()) + '"><td><div class="t-prod"><img src="' + esc(p.img) + '" alt=""><div><b>' + esc(p.name.slice(0, 40)) + '</b><span>' + esc(p.brand || '') + '</span></div></div></td>' +
          '<td class="num">' + fmt(p.price) + '</td>' +
          '<td><input class="mini-input num" data-disc="' + esc(p.id) + '" placeholder="٪" style="width:76px" inputmode="numeric"></td>' +
          '<td><div class="row-actions"><button class="ra-btn" data-act="disc-set" data-id="' + esc(p.id) + '" title="اعمال">' + icon('check') + '</button></div></td></tr>').join('') +
      '</tbody></table></div></div></div>';
  }

  async function setDiscount(id) {
    const input = qs('[data-disc="' + CSS.escape(id) + '"]');
    const pct = Math.min(90, Math.max(1, num(input ? input.value : 0)));
    if (!pct) { A.toast('درصد تخفیف را وارد کنید', 'err'); return; }
    const p = ST.products.find((x) => String(x.id) === String(id));
    if (!p) return;
    const now = num(p.price);
    p.oldPrice = Math.round(now / (1 - pct / 100));
    await persist('aht_parts', ST.products, toFa(pct) + '٪ تخفیف اعمال شد');
    renderTab('discounts');
  }
  async function clearDiscount(id) {
    const p = ST.products.find((x) => String(x.id) === String(id));
    if (!p) return;
    p.oldPrice = 0;
    await persist('aht_parts', ST.products, 'تخفیف حذف شد');
    renderTab('discounts');
  }

  /* ---------- سفارش‌ها ---------- */
  function orderRow(o) {
    const st = o.status || 'pending';
    const label = st === 'approved' ? 'تأیید شده' : st === 'canceled' ? 'لغو شده' : 'در انتظار';
    return '<div class="order-row">' +
      '<span class="or-code num">' + esc(o.code || '—') + '</span>' +
      '<div><div class="or-name">' + esc(((o.fname || '') + ' ' + (o.lname || '')).trim() || 'مشتری') + '</div><div class="or-meta num">' + esc(o.phone || '') + ' • ' + esc(o.province || '') + ' ' + esc(o.city || '') + '</div></div>' +
      '<span class="status-pill status-' + st + '">' + label + '</span>' +
      '<span class="or-meta">' + esc(o.date || '') + '</span>' +
      '<span class="or-total num">' + (o.total ? esc(o.total) : fmt(o.totalRaw) + ' تومان') + '</span>' +
      '<div class="row-actions" style="margin-inline-start:8px">' +
        '<button class="ra-btn" data-act="order-view" data-id="' + esc(o.code) + '" title="جزئیات">' + icon('info') + '</button>' +
        (st !== 'approved' ? '<button class="ra-btn" data-act="order-approve" data-id="' + esc(o.code) + '" title="تأیید">' + icon('check') + '</button>' : '') +
        (st !== 'canceled' ? '<button class="ra-btn" data-act="order-cancel" data-id="' + esc(o.code) + '" title="لغو">' + icon('x') + '</button>' : '') +
        '<button class="ra-btn danger" data-act="order-delete" data-id="' + esc(o.code) + '" title="حذف">' + icon('trash') + '</button>' +
      '</div></div>';
  }

  function viewOrders() {
    const list = ST.orders.slice().reverse();
    const pending = list.filter((o) => (o.status || 'pending') === 'pending');
    return '<div class="admin-card"><div class="ac-head">' +
      '<h3>' + icon('cart') + ' سفارش‌ها <span class="tag-pill">' + toFa(list.length) + '</span>' + (pending.length ? ' <span class="status-pill status-pending">' + toFa(pending.length) + ' در انتظار</span>' : '') + '</h3>' +
      '<div class="ac-tools"><button class="btn btn-sm btn-ghost" data-act="refresh-orders">' + icon('refresh') + ' به‌روزرسانی</button>' +
      '<button class="btn btn-sm btn-ghost" data-act="export-orders">' + icon('save') + ' خروجی CSV</button></div></div>' +
      '<div class="ac-body flush">' + (list.length ? list.map(orderRow).join('') : '<div class="empty-state" style="padding:44px">' + icon('cart') + '<b>هنوز سفارشی ثبت نشده</b><span>سفارش‌های ثبت‌شده از سایت اینجا نمایش داده می‌شوند</span></div>') + '</div></div>';
  }

  async function setOrder(code, status) {
    const o = ST.orders.find((x) => String(x.code) === String(code));
    if (!o) return;
    o.status = status;
    await persist('aht_orders', ST.orders, status === 'approved' ? 'سفارش تأیید شد' : status === 'canceled' ? 'سفارش لغو شد' : 'وضعیت به‌روز شد');
    renderTab('orders');
  }

  async function delOrder(code) {
    if (!confirm('سفارش ' + code + ' حذف شود؟')) return;
    ST.orders = ST.orders.filter((x) => String(x.code) !== String(code));
    await persist('aht_orders', ST.orders, 'سفارش حذف شد');
    renderTab('orders');
  }

  function viewOrder(code) {
    const o = ST.orders.find((x) => String(x.code) === String(code));
    if (!o) return;
    const items = Array.isArray(o.items) ? o.items : [];
    A.openModal('<div class="modal-head"><h3>' + icon('cart') + ' سفارش ' + esc(o.code) + '</h3><button class="close-x" data-close>' + icon('x') + '</button></div>' +
      '<div class="modal-body">' +
        '<table class="spec-table">' +
          row('مشتری', ((o.fname || '') + ' ' + (o.lname || '')).trim()) +
          row('موبایل', o.phone) + row('استان / شهر', (o.province || '') + ' ' + (o.city || '')) +
          row('آدرس', o.address) + row('کد پستی', o.postal || '—') +
          row('روش ارسال', o.shippingMethod === 'barbari' ? 'باربری' : 'تیپاکس') +
          row('تاریخ', o.date) + row('مبلغ', o.total || (fmt(o.totalRaw) + ' تومان')) +
          row('توضیح مشتری', o.note || '—') +
          row('وضعیت', o.status === 'approved' ? 'تأیید شده' : o.status === 'canceled' ? 'لغو شده' : 'در انتظار تأیید') +
        '</table>' +
        '<div style="margin-top:14px"><b style="font-size:12.5px">اقلام سفارش</b><ul style="margin-top:8px;display:flex;flex-direction:column;gap:6px">' +
          items.map((it) => '<li style="font-size:12px;color:var(--text-2);padding:7px 10px;background:rgba(255,255,255,.03);border:1px solid var(--line-soft);border-radius:9px">' + esc(typeof it === 'string' ? it : JSON.stringify(it)) + '</li>').join('') +
        '</ul></div>' +
      '</div>' +
      '<div class="modal-foot"><button class="btn btn-ok btn-sm" data-act="order-approve" data-id="' + esc(o.code) + '">تأیید سفارش</button>' +
      '<button class="btn btn-danger btn-sm" data-act="order-cancel" data-id="' + esc(o.code) + '">لغو</button>' +
      '<button class="btn btn-ghost btn-sm" data-close>بستن</button></div>');
    const box = qs('#modalBox');
    box.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', A.closeModal));
    box.querySelectorAll('[data-act]').forEach((b) => b.addEventListener('click', () => { A.closeModal(); setOrder(b.dataset.id, b.dataset.act === 'order-approve' ? 'approved' : 'canceled'); }));
    function row(k, v) { return '<tr><td>' + k + '</td><td>' + esc(v || '—') + '</td></tr>'; }
  }

  function exportOrders() {
    const rows = [['کد', 'نام', 'موبایل', 'استان', 'شهر', 'آدرس', 'مبلغ', 'وضعیت', 'تاریخ']];
    ST.orders.forEach((o) => rows.push([o.code, ((o.fname || '') + ' ' + (o.lname || '')).trim(), o.phone, o.province, o.city, o.address, o.totalRaw, o.status, o.date]));
    const csv = '\uFEFF' + rows.map((r) => r.map((c) => '"' + String(c == null ? '' : c).replace(/"/g, '""') + '"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'orders-' + Date.now() + '.csv'; a.click();
    A.toast('فایل CSV دانلود شد', 'ok');
  }

  /* ---------- دسته‌بندی ---------- */
  function viewCats() {
    const used = {};
    ST.products.forEach((p) => (used[p.cat] = (used[p.cat] || 0) + 1));
    return '<div class="admin-card"><div class="ac-head"><h3>' + icon('sliders') + ' دسته‌بندی‌ها</h3>' +
      '<div class="ac-tools"><button class="btn btn-sm" data-act="add-cat">' + icon('plus') + ' دسته جدید</button>' +
      '<button class="btn btn-sm btn-ghost" data-act="save-cats">' + icon('save') + ' ذخیره تغییرات</button></div></div>' +
      '<div class="ac-body"><div class="table-wrap"><table class="dt"><thead><tr><th>نام کوتاه</th><th>نام کامل</th><th>آیکون</th><th>ترتیب</th><th>تعداد محصول</th><th>فعال</th><th></th></tr></thead><tbody>' +
      ST.cats.map((c, i) => '<tr data-cat-row="' + i + '">' +
        '<td><input class="mini-input" data-cat="name" value="' + esc(c.name) + '" style="min-width:110px"></td>' +
        '<td><input class="mini-input" data-cat="full" value="' + esc(c.full || '') + '" style="min-width:150px"></td>' +
        '<td><input class="mini-input" data-cat="icon" value="' + esc(c.icon || 'box') + '" dir="ltr" style="width:92px"></td>' +
        '<td><input class="mini-input num" data-cat="order" value="' + toFa(c.order || i + 1) + '" style="width:64px"></td>' +
        '<td>' + toFa(used[c.id] || 0) + '</td>' +
        '<td><button class="toggle ' + (c.active !== false ? 'on' : '') + '" data-cat-toggle="' + i + '"></button></td>' +
        '<td><div class="row-actions"><button class="ra-btn danger" data-act="del-cat" data-id="' + esc(c.id) + '">' + icon('trash') + '</button></div></td>' +
      '</tr>').join('') + '</tbody></table></div>' +
      '<p class="hint" style="margin-top:10px">آیکون‌های مجاز: cpu, mb, ram, vga, ssd, cooler, case, psu, rgb, mouse, keyboard, monitor, wifi, router, box</p></div></div>';
  }

  function collectCats() {
    qsa('[data-cat-row]').forEach((row) => {
      const i = +row.dataset.catRow;
      const c = ST.cats[i];
      row.querySelectorAll('[data-cat]').forEach((inp) => {
        const k = inp.dataset.cat;
        c[k] = k === 'order' ? num(inp.value) : inp.value.trim();
      });
    });
    const toggles = qsa('[data-cat-toggle]');
    toggles.forEach((t) => { ST.cats[+t.dataset.catToggle].active = t.classList.contains('on'); });
    return ST.cats;
  }
  async function saveCats() {
    collectCats();
    await persist('aht_cats', ST.cats, 'دسته‌بندی‌ها ذخیره شد');
    renderTab('cats');
  }
  async function addCat() {
    const name = prompt('نام دسته جدید (مثلاً: قطعات صوتی)');
    if (!name) return;
    collectCats();
    const id = 'c' + Date.now().toString().slice(-5);
    ST.cats.push({ id: id, name: name, full: name, icon: 'box', active: true, order: ST.cats.length + 1 });
    await persist('aht_cats', ST.cats, 'دسته اضافه شد');
    renderTab('cats');
  }
  async function delCat(id) {
    const count = ST.products.filter((p) => p.cat === id).length;
    if (count && !confirm('این دسته ' + count + ' محصول دارد. با حذف دسته، محصولات بدون دسته می‌شوند. ادامه؟')) return;
    ST.cats = ST.cats.filter((c) => c.id !== id);
    await persist('aht_cats', ST.cats, 'دسته حذف شد');
    renderTab('cats');
  }

  /* ---------- اسلایدر ---------- */
  function viewSlides() {
    return '<div class="admin-card"><div class="ac-head"><h3>' + icon('image') + ' اسلایدهای صفحه اصلی</h3>' +
      '<div class="ac-tools"><button class="btn btn-sm btn-ghost" data-act="add-slide">' + icon('plus') + ' اسلاید جدید</button>' +
      '<button class="btn btn-sm" data-act="save-slides">' + icon('save') + ' ذخیره اسلایدر</button></div></div>' +
      '<div class="ac-body" id="slidesWrap">' +
      ST.slides.map((s, i) => '<div class="slide-editor" data-slide="' + i + '">' +
        '<h4><span class="num-badge">' + toFa(i + 1) + '</span> اسلاید ' + toFa(i + 1) +
          '<button class="ra-btn danger" data-act="del-slide" data-id="' + i + '" style="margin-inline-start:auto">' + icon('trash') + '</button></h4>' +
        '<div class="editor-grid">' +
          '<div class="field"><label>برچسب بالای عنوان</label><input class="input" data-sl="badge" value="' + esc(s.badge || '') + '"></div>' +
          '<div class="field"><label>متن دکمه</label><input class="input" data-sl="cta" value="' + esc(s.cta || '') + '"></div>' +
          '<div class="field full"><label>عنوان (می‌توانید بخشی را با &lt;em&gt; رنگی کنید)</label><input class="input" data-sl="title" value="' + esc(s.title || '') + '" dir="auto"></div>' +
          '<div class="field full"><label>متن توضیح</label><textarea class="textarea" data-sl="text" style="min-height:64px">' + esc(s.text || '') + '</textarea></div>' +
          '<div class="field"><label>لینک دکمه</label><input class="input" data-sl="link" value="' + esc(s.link || '') + '" dir="ltr"></div>' +
          '<div class="field"><label>تصویر</label><input class="input" data-sl="img" value="' + esc(s.img || '') + '" dir="ltr"></div>' +
          '<div class="field"><label>آمار ۱ (عدد)</label><input class="input" data-sl="stat1" value="' + esc(s.stat1 || '') + '"></div>' +
          '<div class="field"><label>آمار ۱ (توضیح)</label><input class="input" data-sl="stat1t" value="' + esc(s.stat1t || '') + '"></div>' +
          '<div class="field"><label>آمار ۲ (عدد)</label><input class="input" data-sl="stat2" value="' + esc(s.stat2 || '') + '"></div>' +
          '<div class="field"><label>آمار ۲ (توضیح)</label><input class="input" data-sl="stat2t" value="' + esc(s.stat2t || '') + '"></div>' +
        '</div></div>').join('') +
      '</div></div>';
  }
  function collectSlides() {
    qsa('[data-slide]').forEach((wrap) => {
      const i = +wrap.dataset.slide;
      const s = ST.slides[i];
      wrap.querySelectorAll('[data-sl]').forEach((inp) => (s[inp.dataset.sl] = inp.value));
    });
    return ST.slides;
  }
  async function saveSlides() { collectSlides(); await persist('aht_slides', ST.slides, 'اسلایدر ذخیره شد'); renderTab('slides'); }
  function addSlide() {
    collectSlides();
    ST.slides.push({ id: 's' + Date.now(), badge: 'جدید', title: 'عنوان اسلاید <em>جدید</em>', text: 'توضیحات اسلاید', cta: 'مشاهده', link: 'shop.html', img: 'img/hero-1.webp', stat1: '', stat1t: '', stat2: '', stat2t: '' });
    renderTab('slides');
  }
  function delSlide(i) {
    collectSlides();
    if (!confirm('این اسلاید حذف شود؟')) return;
    ST.slides.splice(+i, 1);
    persist('aht_slides', ST.slides, 'اسلاید حذف شد');
    renderTab('slides');
  }

  /* ---------- تنظیمات ---------- */
  function viewSettings() {
    const s = ST.settings;
    const fld = (k, label, opts) => {
      opts = opts || {};
      return '<div class="field' + (opts.full ? ' full' : '') + '"><label>' + label + '</label>' +
        (opts.area ? '<textarea class="textarea" data-st="' + k + '">' + esc(s[k] || '') + '</textarea>'
          : '<input class="input' + (opts.num ? ' num' : '') + '" data-st="' + k + '" value="' + esc(s[k] || '') + '"' + (opts.ltr ? ' dir="ltr"' : '') + '>') +
        (opts.hint ? '<div class="hint">' + opts.hint + '</div>' : '') + '</div>';
    };
    return '<div class="admin-card"><div class="ac-head"><h3>' + icon('wrench') + ' اطلاعات فروشگاه</h3>' +
      '<button class="btn btn-sm" data-act="save-settings">' + icon('save') + ' ذخیره تنظیمات</button></div>' +
      '<div class="ac-body"><div class="editor-grid">' +
        fld('siteName', 'نام فروشگاه') + fld('siteLatin', 'نام لاتین (زیر لوگو)', { ltr: true }) +
        fld('tagline', 'شعار') + fld('email', 'ایمیل', { ltr: true }) +
        fld('phone', 'تلفن ثابت') + fld('mobile', 'موبایل') +
        fld('hours', 'ساعات کاری') + fld('address', 'آدرس') +
        fld('instagram', 'اینستاگرام', { ltr: true }) + fld('telegram', 'تلگرام', { ltr: true }) +
        fld('about', 'درباره فروشگاه', { full: true, area: true }) +
        fld('announcement', 'متن اطلاع‌رسانی (نوار بالای سایت)', { full: true }) +
      '</div></div></div>' +
      '<div class="admin-card"><div class="ac-head"><h3>' + icon('truck') + ' ارسال و پرداخت</h3>' +
        '<button class="btn btn-sm" data-act="save-settings">' + icon('save') + ' ذخیره</button></div>' +
        '<div class="ac-body"><div class="editor-grid">' +
          fld('freeShipThreshold', 'سقف ارسال رایگان (تومان)', { num: true, hint: 'خرید بالای این مبلغ، ارسال رایگان می‌شود.' }) +
          fld('shipCost', 'هزینه ارسال (تومان)', { num: true }) +
          fld('cardNumber', 'شماره کارت', { ltr: true }) +
          fld('cardOwner', 'صاحب کارت') +
          fld('bankName', 'نام بانک') +
          fld('dealEndsAt', 'پایان شمارش معکوس تخفیف (ISO)', { ltr: true, hint: 'مثلاً 2026-12-01T23:59:59 — خالی = شمارش خودکار ۳۶ ساعته' }) +
        '</div></div></div>';
  }
  async function saveSettings() {
    qsa('[data-st]').forEach((inp) => {
      const k = inp.dataset.st;
      ST.settings[k] = inp.classList.contains('num') ? num(inp.value) : inp.value.trim();
    });
    await persist('aht_settings', ST.settings, 'تنظیمات ذخیره شد');
    A.applySettings();
  }

  /* ---------- بایگانی ---------- */
  function viewArchive() {
    const approved = ST.orders.filter((o) => o.status === 'approved');
    const canceled = ST.orders.filter((o) => o.status === 'canceled');
    const pending = ST.orders.filter((o) => (o.status || 'pending') === 'pending');
    const sales = approved.reduce((s, o) => s + num(o.totalRaw), 0);
    const avg = approved.length ? Math.round(sales / approved.length) : 0;
    const monthMap = {};
    approved.forEach((o) => {
      const d = o.dateISO ? new Date(o.dateISO) : new Date();
      const key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
      monthMap[key] = (monthMap[key] || 0) + num(o.totalRaw);
    });
    const months = Object.keys(monthMap).sort().slice(-8);
    const max = Math.max(1, ...months.map((m) => monthMap[m]));
    const bars = months.length ? months.map((m) => {
      const h = Math.round((monthMap[m] / max) * 100);
      return '<div class="bar-col"><b class="num">' + fmt(Math.round(monthMap[m] / 1000000)) + 'M</b><div class="bar" style="height:' + Math.max(4, h) + '%"></div><span>' + m + '</span></div>';
    }).join('') : '<div class="empty-state" style="flex:1">' + icon('chart') + '<b>داده‌ای برای نمایش نیست</b><span>با تأیید سفارش‌ها، نمودار فروش ساخته می‌شود</span></div>';

    /* پرفروش‌ترین برند بر اساس اقلام سفارش‌ها (تطبیق نام) */
    const brandSales = {};
    approved.forEach((o) => {
      (o.items || []).forEach((it) => {
        const text = typeof it === 'string' ? it : '';
        const p = ST.products.find((x) => text.startsWith(x.name));
        if (p) brandSales[p.brand || '—'] = (brandSales[p.brand || '—'] || 0) + num(p.price);
      });
    });
    const brandRows = Object.entries(brandSales).sort((a, b) => b[1] - a[1]).slice(0, 6);

    return '<div class="stats-grid">' +
      '<div class="stat-card green"><div class="sc-ico">' + icon('chart') + '</div><b class="num">' + fmt(sales) + '</b><span>فروش تأییدشده (تومان)</span></div>' +
      '<div class="stat-card"><div class="sc-ico">' + icon('cart') + '</div><b>' + toFa(approved.length) + '</b><span>سفارش تأییدشده</span></div>' +
      '<div class="stat-card orange"><div class="sc-ico">' + icon('tag') + '</div><b class="num">' + fmt(avg) + '</b><span>میانگین سبد خرید</span></div>' +
      '<div class="stat-card violet"><div class="sc-ico">' + icon('x') + '</div><b>' + toFa(canceled.length) + '</b><span>سفارش لغوشده</span></div>' +
      '</div>' +
      '<div class="admin-card"><div class="ac-head"><h3>' + icon('chart') + ' فروش ماهانه (میلیون تومان)</h3>' +
        '<span class="hint">' + toFa(pending.length) + ' سفارش در انتظار در فروش حساب نشده است</span></div>' +
        '<div class="ac-body"><div class="bars">' + bars + '</div></div></div>' +
      '<div class="admin-card"><div class="ac-head"><h3>' + icon('box') + ' برترین برندها</h3></div><div class="ac-body">' +
        (brandRows.length ? '<table class="dt"><thead><tr><th>برند</th><th>مجموع فروش (تومان)</th></tr></thead><tbody>' +
          brandRows.map(([b, v]) => '<tr><td><b>' + esc(b) + '</b></td><td class="num">' + fmt(v) + '</td></tr>').join('') + '</tbody></table>'
          : '<div class="empty-state" style="padding:26px">' + icon('info') + '<span>پس از تأیید سفارش‌ها، برترین برندها اینجا نمایش داده می‌شود</span></div>') +
      '</div></div>';
  }
})();
