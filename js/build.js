(function () {
  const A = window.AHT;
  const { icon, fmt, toFa, esc, qs, num } = A;

  const STEPS = [
    { slot: 'cpu', title: 'پردازنده (CPU)', desc: 'قلب سیستم؛ سوکت و توان حرارتی آن، انتخاب مادربرد و خنک‌کننده را تعیین می‌کند.', cat: 'cpu', req: true },
    { slot: 'mb', title: 'مادربرد', desc: 'قطعات سازگار با سوکت پردازندهٔ انتخابی نمایش داده می‌شوند.', cat: 'mb', req: true },
    { slot: 'ram', title: 'حافظه رم', desc: 'فقط رم‌های هم‌نوع با مادربرد (DDR4 / DDR5) قابل انتخاب هستند.', cat: 'ram', req: true },
    { slot: 'vga', title: 'کارت گرافیک', desc: 'اختیاری — اگر پردازنده گرافیک مجتمع دارد می‌توانید این مرحله را رد کنید.', cat: 'vga', req: false },
    { slot: 'cooler', title: 'خنک‌کننده پردازنده', desc: 'سازگاری سوکت و توان خنک‌سازی با پردازنده بررسی می‌شود.', cat: 'cooler', req: true },
    { slot: 'storage', title: 'حافظه و ذخیره‌سازی', desc: 'اس‌اس‌دی یا هارد برای نصب سیستم‌عامل و فایل‌ها.', cat: 'storage', req: true },
    { slot: 'psu', title: 'منبع تغذیه (پاور)', desc: 'توان مورد نیاز سیستم محاسبه و پاورهای کافی برجسته می‌شوند.', cat: 'psu', req: true },
    { slot: 'case', title: 'کیس', desc: 'فرم‌فاکتور مادربرد، طول کارت گرافیک و ارتفاع کولر بررسی می‌شود.', cat: 'case', req: true },
    { slot: 'deco', title: 'قطعات تزئینی و RGB (اختیاری)', desc: 'فن، نوار نور و پایه گرافیک برای زیباتر شدن سیستم.', cat: 'deco', req: false },
    { slot: 'periph', title: 'تجهیزات جانبی (اختیاری)', desc: 'مانیتور، کیبورد، ماوس و هدست.', cat: 'periph', req: false },
    { slot: 'network', title: 'تجهیزات شبکه (اختیاری)', desc: 'روتر، سوییچ و اکسترندر وای‌فای.', cat: 'network', req: false }
  ];
  const B = { cpu: null, mb: null, ram: null, vga: null, cooler: null, storage: null, psu: null, case: null, deco: null, periph: null, network: null };
  let cur = 0, showAll = false;

  document.addEventListener('DOMContentLoaded', async () => {
    await A.loadAll();
    A.mountChrome();
    A.bindProducts(document);
    parseUrl();
    renderWhy();
    bindPresets();
    bindStatic();
    render();
  });

  /* ---------- سازگاری ---------- */
  function pick(slot) { const v = B[slot]; return v ? A.prodById(v) : null; }

  function powerNeed() {
    const cpu = pick('cpu'), vga = pick('vga');
    let w = 60; // مادربرد، رم، حافظه و فن‌ها
    if (cpu) w += num(cpu.specs.tdp) || 65;
    if (vga) w += num(vga.specs.tdp) || 150;
    return Math.round(w * 1.25);
  }

  function checks() {
    const out = [];
    const cpu = pick('cpu'), mb = pick('mb'), ram = pick('ram'), cool = pick('cooler'), cs = pick('case'), psu = pick('psu'), vga = pick('vga');
    if (cpu && mb) {
      const ok = String(cpu.specs.socket) === String(mb.specs.socket);
      out.push({ s: ok ? 'ok' : 'err', t: ok ? 'سوکت پردازنده و مادربرد هم‌خوان است (' + cpu.specs.socket + ')' : 'سوکت ' + cpu.specs.socket + ' با مادربرد ' + mb.specs.socket + ' سازگار نیست' });
    }
    if (mb && ram) {
      const ok = String(mb.specs.ramType) === String(ram.specs.ramType);
      out.push({ s: ok ? 'ok' : 'err', t: ok ? 'نوع حافظه با مادربرد هم‌خوان است (' + ram.specs.ramType + ')' : 'رم ' + ram.specs.ramType + ' در مادربرد ' + mb.specs.ramType + ' نصب نمی‌شود' });
    }
    if (cpu && cool) {
      const sockets = cool.specs.sockets || [];
      const sokOk = sockets.map(String).includes(String(cpu.specs.socket));
      out.push({ s: sokOk ? 'ok' : 'err', t: sokOk ? 'خنک‌کننده از سوکت ' + cpu.specs.socket + ' پشتیبانی می‌کند' : 'خنک‌کننده با سوکت ' + cpu.specs.socket + ' سازگار نیست' });
      const cap = num(cool.specs.tdp), need = num(cpu.specs.tdp);
      if (cap && need) out.push({ s: cap >= need ? 'ok' : 'warn', t: cap >= need ? 'توان خنک‌سازی ' + toFa(cap) + ' وات برای پردازنده ' + toFa(need) + ' وات کافی است' : 'توان خنک‌سازی ' + toFa(cap) + ' وات کمتر از ' + toFa(need) + ' وات پردازنده است' });
    }
    if (mb && cs) {
      const ff = (cs.specs.formFactors || []).map(String);
      const ok = ff.includes(String(mb.specs.formFactor));
      out.push({ s: ok ? 'ok' : 'err', t: ok ? 'کیس از فرم‌فاکتور ' + mb.specs.formFactor + ' پشتیبانی می‌کند' : 'کیس ' + mb.specs.formFactor + ' مادربرد را نمی‌پذیرد' });
    }
    if (cs && vga) {
      const maxL = num(cs.specs.maxVga), len = num(vga.specs.length);
      if (maxL && len) out.push({ s: maxL >= len ? 'ok' : 'err', t: maxL >= len ? 'طول کارت گرافیک (' + toFa(len) + 'mm) در کیس جا می‌شود' : 'کارت گرافیک ' + toFa(len) + 'mm از فضای ' + toFa(maxL) + 'mm کیس بزرگ‌تر است' });
    }
    if (cs && cool) {
      const maxH = num(cs.specs.maxCooler), h = num(cool.specs.height);
      if (maxH && h) out.push({ s: maxH >= h ? 'ok' : 'warn', t: maxH >= h ? 'ارتفاع خنک‌کننده (' + toFa(h) + 'mm) با کیس سازگار است' : 'ارتفاع کولر ' + toFa(h) + 'mm از ' + toFa(maxH) + 'mm کیس بیشتر است' });
    }
    if (psu) {
      const need = powerNeed(), w = num(psu.specs.wattage);
      out.push({ s: w >= need ? 'ok' : 'err', t: w >= need ? 'پاور ' + toFa(w) + ' وات برای نیاز ' + toFa(need) + ' وات کافی است' : 'پاور ' + toFa(w) + ' وات کمتر از نیاز ' + toFa(need) + ' وات است' });
    }
    return out;
  }

  const hardErrors = () => checks().filter((c) => c.s === 'err').length;

  /* ---------- فیلتر گزینه‌ها ---------- */
  function optionsFor(step) {
    let list = A.activeProducts().filter((p) => p.cat === step.cat);
    if (showAll) return list;
    const cpu = pick('cpu'), mb = pick('mb'), cs = pick('case');
    if (step.slot === 'mb' && cpu) list = list.filter((p) => String(p.specs.socket) === String(cpu.specs.socket));
    if (step.slot === 'ram') {
      const type = (mb && mb.specs.ramType) || (cpu && cpu.specs.ramType);
      if (type) list = list.filter((p) => String(p.specs.ramType) === String(type));
    }
    if (step.slot === 'cooler' && cpu) list = list.filter((p) => (p.specs.sockets || []).map(String).includes(String(cpu.specs.socket)));
    if (step.slot === 'case' && mb) list = list.filter((p) => (p.specs.formFactors || []).map(String).includes(String(mb.specs.formFactor)));
    if (step.slot === 'psu') {
      const need = powerNeed();
      list = list.slice().sort((a, b) => (num(b.specs.wattage) >= need ? 1 : 0) - (num(a.specs.wattage) >= need ? 1 : 0));
    }
    if (step.slot === 'vga' && cs) list = list.slice().sort((a, b) => (num(b.specs.length) <= num(cs.specs.maxVga) ? 1 : 0) - (num(a.specs.length) <= num(cs.specs.maxVga) ? 1 : 0));
    return list;
  }

  /* ---------- رندر ---------- */
  function render() {
    /* نوار مراحل */
    qs('#buildProgress').innerHTML = STEPS.map((s, i) => {
      const done = !!B[s.slot];
      return '<button class="bp-step' + (done ? ' done' : '') + (i === cur ? ' active' : '') + '" data-step="' + i + '">' +
        '<span class="n">' + (done ? '✓' : toFa(i + 1)) + '</span>' + esc(s.title.replace(/\s*\(.*\)\s*/, '')) + '</button>';
    }).join('');

    const step = STEPS[cur];
    const list = optionsFor(step);
    const sel = B[step.slot];
    const selP = sel ? A.prodById(sel) : null;
    const cat = A.catById(step.cat);

    qs('#buildPanel').innerHTML =
      '<h3>' + icon(cat.icon || 'box') + ' ' + esc(step.title) + (step.req ? '' : ' <span class="pill pill-brand" style="font-size:10px">اختیاری</span>') + '</h3>' +
      '<p class="bp-desc">' + esc(step.desc) + '</p>' +
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px;flex-wrap:wrap">' +
        '<span style="font-size:11.5px;color:var(--muted)">' + toFa(list.length) + ' گزینه' + (showAll ? ' (نمایش همه، بدون فیلتر سازگاری)' : ' سازگار با انتخاب‌های شما') + '</span>' +
        '<div style="display:flex;gap:6px">' +
          '<button class="btn btn-sm btn-ghost" id="toggleAll">' + icon('sliders') + (showAll ? 'فیلتر سازگاری' : 'نمایش همه قطعات') + '</button>' +
          (selP ? '<button class="btn btn-sm btn-outline" id="clearSlot">' + icon('x') + ' حذف انتخاب</button>' : '') +
        '</div>' +
      '</div>' +
      (list.length ? '<div class="build-options">' + list.map((p) => {
        const isSel = String(sel) === String(p.id);
        const bad = num(p.stock) <= 0;
        return '<div class="build-opt' + (isSel ? ' selected' : '') + (bad ? ' disabled' : '') + '" data-pick="' + esc(p.id) + '">' +
          '<span class="tick">' + icon('check') + '</span>' +
          '<img src="' + esc(p.img) + '" alt="' + esc(p.name) + '" loading="lazy">' +
          '<div class="bo-body"><b>' + esc(p.name) + '</b>' +
          '<div class="bo-spec">' + esc(specLine(p)) + '</div>' +
          '<div class="bo-price">' + fmt(p.price) + ' تومان</div></div></div>';
      }).join('') + '</div>'
        : '<div class="empty-state" style="padding:34px">' + icon('info') + '<b>گزینه‌ای با این فیلترها نیست</b><span>دکمه «نمایش همه قطعات» را بزنید</span></div>') +
      '<div style="display:flex;justify-content:space-between;gap:10px;margin-top:16px">' +
        '<button class="btn btn-ghost" id="prevStep"' + (cur === 0 ? ' disabled' : '') + '>' + icon('chevronR') + ' مرحله قبل</button>' +
        '<button class="btn" id="nextStep" style="margin-inline-start:auto">مرحله بعد ' + icon('chevronL') + '</button>' +
      '</div>';

    renderSummary();
    renderAll();
    syncUrl();
  }

  function specLine(p) {
    const s = p.specs || {};
    const bits = [];
    if (p.cat === 'cpu') bits.push(s.socket, toFa(s.cores) + ' هسته', toFa(s.tdp) + ' وات');
    else if (p.cat === 'mb') bits.push(s.socket, s.ramType, s.formFactor);
    else if (p.cat === 'ram') bits.push(s.capacity, s.ramType, toFa(s.speed) + 'MHz');
    else if (p.cat === 'vga') bits.push(s.vram, toFa(s.tdp) + ' وات');
    else if (p.cat === 'storage') bits.push(s.capacity, s.interface);
    else if (p.cat === 'cooler') bits.push(s.type, 'تا ' + toFa(s.tdp) + ' وات');
    else if (p.cat === 'psu') bits.push(toFa(s.wattage) + ' وات', s.efficiency);
    else if (p.cat === 'case') bits.push((s.formFactors || []).join('/'), 'گرافیک تا ' + toFa(s.maxVga));
    else bits.push(p.brand);
    return bits.filter((b) => b !== undefined && b !== null && b !== '' && b !== 'undefined').join(' • ');
  }

  function bindStatic() {
    const panel = qs('#buildPanel');
    panel.addEventListener('click', (e) => {
      const pickEl = e.target.closest('[data-pick]');
      if (pickEl) {
        const p = A.prodById(pickEl.dataset.pick);
        if (!p) return;
        const slot = STEPS[cur].slot;
        B[slot] = String(B[slot]) === String(p.id) ? null : p.id;
        pruneAfter();
        render();
        return;
      }
      if (e.target.closest('#prevStep')) { cur = Math.max(0, cur - 1); render(); }
      else if (e.target.closest('#nextStep')) {
        if (cur === STEPS.length - 1) { openSummaryModal(); return; }
        cur = Math.min(STEPS.length - 1, cur + 1); render();
      }
      else if (e.target.closest('#toggleAll')) { showAll = !showAll; render(); }
      else if (e.target.closest('#clearSlot')) { B[STEPS[cur].slot] = null; render(); }
    });

    qs('#buildSummary').addEventListener('click', (e) => {
      const c = e.target.closest('[data-clear]');
      if (c) { B[c.dataset.clear] = null; render(); return; }
      if (e.target.closest('#addBuild')) addBuildToCart();
      if (e.target.closest('#copyBuild')) copyLink();
      if (e.target.closest('#resetBuild')) { Object.keys(B).forEach((k) => (B[k] = null)); cur = 0; render(); }
    });

    document.addEventListener('click', (e) => {
      if (e.target.closest('#mAddBuild')) { addBuildToCart(); A.closeModal(); }
      if (e.target.closest('#mCopyBuild')) copyLink();
    });
  }

  function openSummaryModal() {
    const box = A.openModal(summaryModal());
  }

  function pruneAfter() {
    const cpu = pick('cpu'), mb = pick('mb');
    if (cpu && B.mb && String(pick('mb').specs.socket) !== String(cpu.specs.socket)) B.mb = null;
    if (mb && B.ram && String(pick('ram').specs.ramType) !== String(mb.specs.ramType)) B.ram = null;
    if (cpu && B.cooler && !(pick('cooler').specs.sockets || []).map(String).includes(String(cpu.specs.socket))) B.cooler = null;
    if (mb && B.case && !(pick('case').specs.formFactors || []).map(String).includes(String(mb.specs.formFactor))) B.case = null;
  }

  function summaryModal() {
    return '<div class="modal-head"><h3>' + icon('check') + ' سیستم شما آماده است</h3><button class="close-x" data-close>' + icon('x') + '</button></div>' +
      '<div class="modal-body"><p style="font-size:12.5px;color:var(--text-2);line-height:2">می‌خواهید این سیستم را به سبد خرید اضافه کنید یا فقط لیست قطعات را ذخیره/ارسال کنید؟</p>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px"><button class="btn" id="mAddBuild">' + icon('cart') + ' افزودن کل سیستم به سبد</button>' +
      '<button class="btn btn-ghost" id="mCopyBuild">' + icon('copy') + ' کپی لینک سیستم</button></div></div>';
  }

  function renderSummary() {
    const chosen = STEPS.filter((s) => B[s.slot]);
    const rows = STEPS.map((s) => {
      const p = pick(s.slot);
      return '<div class="bs-row' + (p ? ' filled' : '') + '">' +
        '<span class="bs-slot">' + esc(s.title.replace(/\s*\(.*\)\s*/, '').slice(0, 12)) + '</span>' +
        '<span class="bs-name">' + (p ? esc(p.name) : (s.req ? 'انتخاب نشده' : 'اختیاری')) + '</span>' +
        (p ? '<span class="bs-price">' + fmt(p.price) + '</span><button class="bs-clear" data-clear="' + s.slot + '" aria-label="حذف">' + icon('x') + '</button>' : '') +
        '</div>';
    }).join('');

    const total = STEPS.reduce((sum, s) => { const p = pick(s.slot); return sum + (p ? num(p.price) : 0); }, 0);
    const need = powerNeed();
    const psuCap = pick('psu') ? num(pick('psu').specs.wattage) : 0;
    const ratio = psuCap ? Math.min(100, Math.round((need / psuCap) * 100)) : 0;
    const ch = checks();
    const errs = ch.filter((c) => c.s === 'err').length;
    const reqLeft = STEPS.filter((s) => s.req && !B[s.slot]).length;

    qs('#buildSummary').innerHTML =
      '<div class="bs-head"><h3>' + icon('dashboard') + ' سیستم شما</h3><span class="pill ' + (errs ? 'pill-danger' : (reqLeft ? 'pill-warn' : 'pill-ok')) + '">' +
        (errs ? toFa(errs) + ' ناسازگاری' : (reqLeft ? toFa(reqLeft) + ' قطعه باقی‌مانده' : 'کامل و سازگار')) + '</span></div>' +
      '<div class="bs-list">' + rows + '</div>' +
      '<div class="compat">' +
        (ch.length ? ch.slice(0, 5).map((c) => '<div class="compat-item ' + c.s + '">' + icon(c.s === 'err' ? 'alert' : c.s === 'warn' ? 'info' : 'check') + '<span>' + esc(c.t) + '</span></div>').join('')
          : '<div class="compat-item">' + icon('info') + '<span>برای دیدن بررسی سازگاری، قطعات را انتخاب کنید</span></div>') +
        '<div style="margin-top:8px;font-size:10.5px;color:var(--muted);display:flex;justify-content:space-between"><span>توان مصرفی تخمینی: ' + toFa(need) + ' وات</span>' + (psuCap ? '<span>پاور: ' + toFa(psuCap) + ' وات</span>' : '') + '</div>' +
        '<div class="power-bar"><i style="width:' + (psuCap ? ratio : 0) + '%"></i></div>' +
      '</div>' +
      '<div class="bs-total">' +
        '<div class="t-row"><span>تعداد قطعات</span><span>' + toFa(chosen.length) + ' مورد</span></div>' +
        '<div class="t-row"><span>هزینه ارسال</span><span>' + (total >= num(A.S.settings.freeShipThreshold) ? 'رایگان' : fmt(A.S.settings.shipCost) + ' تومان') + '</span></div>' +
        '<div class="t-row final"><span>قیمت نهایی</span><span class="val num">' + fmt(total) + ' تومان</span></div>' +
      '</div>' +
      '<div class="bs-foot">' +
        '<button class="btn btn-block" id="addBuild"' + (errs || !chosen.length ? ' disabled' : '') + '>' + icon('cart') + ' افزودن سیستم به سبد</button>' +
        '<div style="display:flex;gap:7px">' +
          '<button class="btn btn-sm btn-ghost" style="flex:1" id="copyBuild">' + icon('copy') + ' لینک</button>' +
          '<button class="btn btn-sm btn-ghost" style="flex:1" id="resetBuild">' + icon('refresh') + ' پاک‌کردن</button>' +
        '</div>' +
        (errs ? '<div class="hint" style="color:#ff8ea3">تا رفع ناسازگاری‌ها امکان افزودن به سبد نیست</div>' : '') +
      '</div>';
  }

  function buildParts() {
    return STEPS.filter((s) => B[s.slot]).map((s) => { const p = pick(s.slot); return { slot: s.slot, id: p.id, name: p.name, price: num(p.price), img: p.img }; });
  }
  function addBuildToCart() {
    const parts = buildParts();
    if (!parts.length) return;
    if (hardErrors()) { A.toast('ابتدا ناسازگاری‌ها را برطرف کنید', 'err'); return; }
    A.cartAddBuild({ parts: parts, total: parts.reduce((s, p) => s + p.price, 0), power: powerNeed() });
  }
  function copyLink() {
    const url = location.origin + location.pathname + '?' + buildQuery();
    navigator.clipboard && navigator.clipboard.writeText(url).then(() => A.toast('لینک سیستم کپی شد', 'ok'), () => A.toast('کپی نشد', 'err'));
  }
  function buildQuery() {
    const b = STEPS.filter((s) => B[s.slot]).map((s) => s.slot + ':' + B[s.slot]).join(',');
    return 'b=' + encodeURIComponent(b);
  }
  function syncUrl() { try { history.replaceState(null, '', location.pathname + '?' + buildQuery()); } catch (e) { } }
  function parseUrl() {
    const raw = A.params().b; if (!raw) return;
    decodeURIComponent(raw).split(',').forEach((pair) => {
      const [slot, id] = pair.split(':');
      if (B.hasOwnProperty(slot) && A.prodById(id)) B[slot] = id;
    });
    const lastFilled = STEPS.reduce((last, s, i) => (B[s.slot] ? i : last), 0);
    cur = Math.min(STEPS.length - 1, lastFilled + 1);
  }

  function renderAll() {
    const cats = A.S.cats.filter((c) => ['cpu', 'mb', 'ram', 'vga', 'storage', 'cooler', 'case', 'psu'].includes(c.id));
    qs('#buildAll').innerHTML = '<div class="panel"><div class="panel-head">' + icon('box') + ' همه قطعات انتخاب‌شده</div><div class="panel-body" style="display:flex;flex-wrap:wrap;gap:8px">' +
      cats.map((c) => {
        const p = STEPS.filter((s) => s.cat === c.id).map((s) => pick(s.slot)).filter(Boolean)[0];
        return '<span class="chip" style="' + (p ? '' : 'opacity:.55') + '">' + esc(c.name) + ': ' + (p ? esc(p.name.slice(0, 26)) + '…' : 'انتخاب نشده') + '</span>';
      }).join('') + '</div></div>';
  }

  function renderWhy() {
    const items = [
      { i: 'shield', t: 'بررسی خودکار سازگاری', d: 'سوکت پردازنده، نوع رم، فرم‌فاکتور مادربرد، طول گرافیک و ارتفاع کولر همه بررسی می‌شوند.' },
      { i: 'zap', t: 'محاسبه توان مصرفی', d: 'توان مورد نیاز سیستم را قبل از خرید می‌بینید تا پاور مناسب انتخاب کنید.' },
      { i: 'tag', t: 'قیمت نهایی شفاف', d: 'جمع کل قطعات و هزینه ارسال همان لحظه محاسبه می‌شود.' },
      { i: 'wrench', t: 'اسمبل توسط کارشناس', d: 'می‌توانید قطعات را جدا بخرید یا درخواست اسمبل و تست کامل بدهید.' },
      { i: 'refresh', t: 'امکان ویرایش هر مرحله', d: 'هر قطعه را می‌توانید تغییر دهید؛ سیستم هشدارهای ناسازگاری را دوباره بررسی می‌کند.' },
      { i: 'copy', t: 'اشتراک‌گذاری سیستم', d: 'لینک سیستم خود را برای دوستان یا مشاور فنی ارسال کنید.' }
    ];
    qs('#whyBuild').innerHTML = items.map((x) => '<div class="card" style="padding:16px"><div style="display:flex;align-items:center;gap:9px;margin-bottom:7px"><span style="width:34px;height:34px;border-radius:10px;display:grid;place-items:center;background:rgba(0,209,255,.1);color:var(--brand)">' + icon(x.i) + '</span><b style="font-size:13px">' + x.t + '</b></div><p style="font-size:11.5px;color:var(--muted);line-height:2">' + x.d + '</p></div>').join('');
  }

  function bindPresets() {
    qs('#presetWrap').addEventListener('click', (e) => {
      const b = e.target.closest('[data-preset]'); if (!b) return;
      const kind = b.dataset.preset;
      const pickCheap = (cat) => A.activeProducts().filter((p) => p.cat === cat).sort((x, y) => num(x.price) - num(y.price))[0];
      const pickTop = (cat) => A.activeProducts().filter((p) => p.cat === cat).sort((x, y) => num(y.price) - num(x.price))[0];
      const pickMid = (cat) => {
        const list = A.activeProducts().filter((p) => p.cat === cat).sort((x, y) => num(x.price) - num(y.price));
        return list[Math.floor(list.length / 2)] || list[0];
      };
      const chooser = kind === 'eco' ? pickCheap : kind === 'pro' ? pickTop : pickMid;
      Object.keys(B).forEach((k) => (B[k] = null));
      ['cpu', 'mb', 'ram', 'vga', 'cooler', 'storage', 'psu', 'case'].forEach((slot) => {
        const p = pickBestCompatible(slot, chooser);
        if (p) B[slot] = p.id;
      });
      cur = STEPS.length - 1;
      render();
      A.toast('سیستم پیشنهادی بارگذاری شد — می‌توانید هر قطعه را عوض کنید', 'ok');
    });
  }

  /* انتخاب بهترین گزینه سازگار با شرایط فعلی */
  function pickBestCompatible(slot, chooser) {
    const step = STEPS.find((s) => s.slot === slot);
    const base = chooser(slot) || null;
    let pool = A.activeProducts().filter((p) => p.cat === step.cat && num(p.stock) > 0);
    const cpu = pick('cpu'), mb = pick('mb'), cs = pick('case');
    if (slot === 'cpu') return base || pool[0];
    if (slot === 'mb' && cpu) pool = pool.filter((p) => String(p.specs.socket) === String(cpu.specs.socket));
    if (slot === 'ram') {
      const t = mb ? mb.specs.ramType : (cpu ? cpu.specs.ramType : null);
      if (t) pool = pool.filter((p) => String(p.specs.ramType) === String(t));
    }
    if (slot === 'cooler' && cpu) pool = pool.filter((p) => (p.specs.sockets || []).map(String).includes(String(cpu.specs.socket)) && num(p.specs.tdp) >= num(cpu.specs.tdp));
    if (slot === 'case' && mb) pool = pool.filter((p) => (p.specs.formFactors || []).map(String).includes(String(mb.specs.formFactor)));
    if (!pool.length) pool = A.activeProducts().filter((p) => p.cat === step.cat);
    pool.sort((a, b) => num(a.price) - num(b.price));
    const target = chooser(slot);
    if (target && pool.some((p) => p.id === target.id)) return target;
    return pool[0];
  }
})();
