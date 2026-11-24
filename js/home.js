(function () {
  const A = window.AHT;
  const { icon, fmt, toFa, esc, qs } = A;

  document.addEventListener('DOMContentLoaded', async () => {
    await A.loadAll();
    A.mountChrome();
    A.bindProducts(document);
    renderHero();
    renderCats();
    renderDeals();
    renderTabs('pop');
    renderBrands();
    bindTabs();
  });

  /* ---------- اسلایدر ---------- */
  let slideIdx = 0, slideTimer = null, slideCount = 0;
  function renderHero() {
    const track = qs('#heroTrack'), dots = qs('#heroDots');
    const slides = A.S.slides.slice(0, 4);
    slideCount = slides.length;
    track.innerHTML = slides.map((s) => (
      '<div class="hero-slide">' +
        '<div class="hero-copy">' +
          '<span class="hero-eyebrow"><span class="live"></span>' + esc(s.badge || '') + '</span>' +
          '<h1>' + (s.title || '') + '</h1>' +
          '<p>' + esc(s.text || '') + '</p>' +
          '<div class="hero-cta">' +
            '<a class="btn btn-lg" href="' + esc(s.link || 'shop.html') + '">' + esc(s.cta || 'مشاهده') + ' ' + icon('arrowLeft') + '</a>' +
            '<a class="btn btn-ghost btn-lg" href="build.html">' + icon('wrench') + ' اسمبل هوشمند</a>' +
          '</div>' +
          '<div class="hero-stats">' +
            '<div class="hero-stat"><b>' + esc(s.stat1 || '') + '</b><span>' + esc(s.stat1t || '') + '</span></div>' +
            '<div class="hero-stat"><b>' + esc(s.stat2 || '') + '</b><span>' + esc(s.stat2t || '') + '</span></div>' +
          '</div>' +
        '</div>' +
        '<div class="hero-visual"><img src="' + esc(s.img) + '" alt="' + esc(s.badge || '') + '" ' + (slides.indexOf(s) ? 'loading="lazy"' : '') + '></div>' +
      '</div>'
    )).join('');
    dots.innerHTML = slides.map((_, i) => '<button class="hero-dot' + (i === 0 ? ' active' : '') + '" data-slide="' + i + '" aria-label="اسلاید ' + (i + 1) + '"></button>').join('');
    go(0);
    startAuto();
    qs('#heroPrev').addEventListener('click', () => { go(slideIdx - 1); startAuto(); });
    qs('#heroNext').addEventListener('click', () => { go(slideIdx + 1); startAuto(); });
    dots.addEventListener('click', (e) => { const b = e.target.closest('[data-slide]'); if (b) { go(+b.dataset.slide); startAuto(); } });
  }
  function go(i) {
    if (!slideCount) return;
    slideIdx = (i + slideCount) % slideCount;
    qs('#heroTrack').style.transform = 'translateX(' + (slideIdx * 100) + '%)';
    A.qsa('.hero-dot').forEach((d, k) => d.classList.toggle('active', k === slideIdx));
  }
  function startAuto() { clearInterval(slideTimer); slideTimer = setInterval(() => go(slideIdx + 1), 6500); }

  /* ---------- دسته‌بندی‌ها ---------- */
  function renderCats() {
    const grid = qs('#catGrid');
    const cats = A.S.cats.filter((c) => c.active !== false).sort((a, b) => (a.order || 0) - (b.order || 0));
    grid.innerHTML = cats.map((c) => {
      const count = A.activeProducts().filter((p) => p.cat === c.id).length;
      return '<a class="cat-card" href="shop.html?cat=' + c.id + '">' +
        (count ? '<span class="cat-count">' + toFa(count) + '</span>' : '') +
        '<span class="cat-ico">' + icon(c.icon || 'box') + '</span>' +
        '<b>' + esc(c.name) + '</b><span>' + esc((c.full || '').replace(/\(.*\)/, '').trim() || c.name) + '</span></a>';
    }).join('');
  }

  /* ---------- تخفیف‌ها ---------- */
  function renderDeals() {
    const deals = A.activeProducts().filter((p) => A.discountPct(p) > 0)
      .sort((a, b) => A.discountPct(b) - A.discountPct(a)).slice(0, 8);
    qs('#dealGrid').innerHTML = deals.length ? deals.map(A.productCard).join('')
      : '<div class="empty-state" style="grid-column:1/-1">' + icon('tag') + '<b>در حال حاضر تخفیف فعالی ثبت نشده</b></div>';
    startCountdown();
  }

  function startCountdown() {
    const el = qs('#dealCountdown');
    let end = A.S.settings.dealEndsAt ? new Date(A.S.settings.dealEndsAt).getTime() : 0;
    if (!end || isNaN(end) || end < Date.now()) {
      end = +localStorage.getItem('aht_deal_end') || 0;
      if (!end || end < Date.now()) { end = Date.now() + 36 * 3600 * 1000; localStorage.setItem('aht_deal_end', end); }
    }
    const pad = (n) => toFa(String(n).padStart(2, '0'));
    const tick = () => {
      let d = Math.max(0, end - Date.now());
      const days = Math.floor(d / 864e5); d -= days * 864e5;
      const h = Math.floor(d / 36e5); d -= h * 36e5;
      const m = Math.floor(d / 6e4); d -= m * 6e4;
      const s = Math.floor(d / 1e3);
      el.innerHTML =
        box(days, 'روز') + box(h, 'ساعت') + box(m, 'دقیقه') + box(s, 'ثانیه');
    };
    const box = (v, l) => '<div class="cd-box"><b>' + pad(v) + '</b><span>' + l + '</span></div>';
    tick(); setInterval(tick, 1000);
  }

  /* ---------- تب‌ها ---------- */
  function renderTabs(kind) {
    let list;
    if (kind === 'new') list = A.activeProducts().slice().reverse();
    else if (kind === 'prof') list = A.activeProducts().filter((p) => (p.tags || []).includes('حرفه‌ای') || A.num(p.price) > 15000000);
    else list = A.activeProducts().slice().sort((a, b) => (b.sold || 0) - (a.sold || 0));
    qs('#homeProducts').innerHTML = list.slice(0, 8).map(A.productCard).join('');
  }
  function bindTabs() {
    qs('#homeTabs').addEventListener('click', (e) => {
      const b = e.target.closest('[data-tab]'); if (!b) return;
      A.qsa('#homeTabs .tab').forEach((t) => t.classList.toggle('active', t === b));
      renderTabs(b.dataset.tab);
    });
  }

  /* ---------- برندها ---------- */
  function renderBrands() {
    const brands = A.S.brands.slice(0, 16);
    qs('#brandStrip').innerHTML = brands.map((b) => '<a class="brand-chip" href="shop.html?brand=' + encodeURIComponent(b) + '">' + esc(b) + '</a>').join('');
  }
})();
