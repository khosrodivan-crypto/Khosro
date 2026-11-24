(function () {
  const A = window.AHT;
  const { icon, fmt, toFa, esc, qs, qsa, num } = A;
  const PER_PAGE = 9;

  const F = {
    cats: [], brands: [], min: '', max: '', stock: false, deal: false,
    sort: 'pop', q: '', page: 1
  };

  document.addEventListener('DOMContentLoaded', async () => {
    await A.loadAll();
    A.mountChrome();
    A.bindProducts(document);
    const p = A.params();
    if (p.cat) F.cats = [p.cat];
    if (p.brand) F.brands = [p.brand];
    if (p.q) F.q = p.q;
    if (p.deal) F.deal = true;
    if (p.sort) F.sort = p.sort;
    F.page = Math.max(1, +(p.page || 1));
    buildFilters();
    bindEvents();
    render();
  });

  function catName() {
    if (F.cats.length === 1) return A.catById(F.cats[0]).full || F.cats[0];
    if (F.q) return 'نتایج جستجو: ' + F.q;
    if (F.deal) return 'تخفیف‌های ویژه';
    return 'همه محصولات';
  }

  function filtered() {
    let list = A.activeProducts().slice();
    if (F.cats.length) list = list.filter((x) => F.cats.includes(x.cat));
    if (F.brands.length) list = list.filter((x) => F.brands.includes(x.brand));
    if (F.q) {
      const q = F.q.toLowerCase();
      list = list.filter((x) => (x.name + ' ' + (x.brand || '') + ' ' + JSON.stringify(x.specs || '') + ' ' + (x.desc || '')).toLowerCase().includes(q));
    }
    if (F.min !== '') list = list.filter((x) => num(x.price) >= num(F.min));
    if (F.max !== '') list = list.filter((x) => num(x.price) <= num(F.max));
    if (F.stock) list = list.filter((x) => A.inStock(x));
    if (F.deal) list = list.filter((x) => A.discountPct(x) > 0);
    switch (F.sort) {
      case 'cheap': list.sort((a, b) => num(a.price) - num(b.price)); break;
      case 'exp': list.sort((a, b) => num(b.price) - num(a.price)); break;
      case 'off': list.sort((a, b) => A.discountPct(b) - A.discountPct(a)); break;
      case 'new': list.reverse(); break;
      default: list.sort((a, b) => (b.sold || 0) - (a.sold || 0));
    }
    return list;
  }

  function buildFilters() {
    const catWrap = qs('#fCats');
    const cats = A.S.cats.filter((c) => c.active !== false);
    const allCount = A.activeProducts().length;
    catWrap.innerHTML = '<label class="f-opt"><input type="radio" name="fcat" value=""' + (!F.cats.length ? ' checked' : '') + '> همه محصولات <span class="cnt">' + toFa(allCount) + '</span></label>' +
      cats.map((c) => {
        const n = A.activeProducts().filter((p) => p.cat === c.id).length;
        return '<label class="f-opt"><input type="radio" name="fcat" value="' + c.id + '"' + (F.cats[0] === c.id ? ' checked' : '') + '>' + esc(c.name) + ' <span class="cnt">' + toFa(n) + '</span></label>';
      }).join('');

    const brandCounts = {};
    A.activeProducts().forEach((p) => { if (p.brand) brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1; });
    const brands = Object.keys(brandCounts).sort((a, b) => brandCounts[b] - brandCounts[a]);
    qs('#fBrands').innerHTML = brands.map((b) =>
      '<label class="f-opt"><input type="checkbox" data-brand="' + esc(b) + '"' + (F.brands.includes(b) ? ' checked' : '') + '>' + esc(b) + ' <span class="cnt">' + toFa(brandCounts[b]) + '</span></label>').join('');

    qs('#quickPrices').innerHTML = [
      ['تا ۵ میلیون', '', 5000000],
      ['۵ تا ۱۵ میلیون', 5000000, 15000000],
      ['۱۵ تا ۴۰ میلیون', 15000000, 40000000],
      ['بالای ۴۰ میلیون', 40000000, '']
    ].map((r, i) => '<button class="chip" data-qp="' + i + '" data-min="' + r[1] + '" data-max="' + r[2] + '">' + r[0] + '</button>').join('');

    qs('#fStock').checked = F.stock;
    qs('#fDeal').checked = F.deal;
    qs('#sortBy').value = F.sort;
    qs('#fMin').value = F.min === '' ? '' : fmt(F.min);
    qs('#fMax').value = F.max === '' ? '' : fmt(F.max);
  }

  function bindEvents() {
    qs('#fCats').addEventListener('change', (e) => {
      const v = e.target.value;
      F.cats = v ? [v] : []; F.page = 1; render();
    });
    qs('#fBrands').addEventListener('change', () => {
      F.brands = qsa('#fBrands input:checked').map((i) => i.dataset.brand); F.page = 1; render();
    });
    qs('#fStock').addEventListener('change', (e) => { F.stock = e.target.checked; F.page = 1; render(); });
    qs('#fDeal').addEventListener('change', (e) => { F.deal = e.target.checked; F.page = 1; render(); });
    qs('#sortBy').addEventListener('change', (e) => { F.sort = e.target.value; render(); });
    let t;
    const priceHandler = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        F.min = qs('#fMin').value ? A.toEn(qs('#fMin').value).replace(/\D/g, '') : '';
        F.max = qs('#fMax').value ? A.toEn(qs('#fMax').value).replace(/\D/g, '') : '';
        F.page = 1; render();
      }, 420);
    };
    qs('#fMin').addEventListener('input', priceHandler);
    qs('#fMax').addEventListener('input', priceHandler);
    qs('#quickPrices').addEventListener('click', (e) => {
      const b = e.target.closest('[data-qp]'); if (!b) return;
      F.min = b.dataset.min; F.max = b.dataset.max;
      qs('#fMin').value = F.min ? fmt(F.min) : '';
      qs('#fMax').value = F.max ? fmt(F.max) : '';
      F.page = 1; render();
    });
    qs('#clearFilters').addEventListener('click', () => {
      F.cats = []; F.brands = []; F.min = ''; F.max = ''; F.stock = false; F.deal = false; F.q = ''; F.page = 1;
      history.replaceState(null, '', 'shop.html');
      buildFilters(); render();
    });
    qs('#openFilters').addEventListener('click', () => {
      qs('#filters').classList.toggle('open');
      qs('#overlay').classList.toggle('open', qs('#filters').classList.contains('open'));
    });
    qs('#overlay') && qs('#overlay').addEventListener('click', () => { qs('#filters').classList.remove('open'); qs('#overlay').classList.remove('open'); });
    qs('#pagination').addEventListener('click', (e) => {
      const b = e.target.closest('[data-page]'); if (!b) return;
      F.page = +b.dataset.page; render(); window.scrollTo({ top: 120, behavior: 'smooth' });
    });
    qs('#activeFilters').addEventListener('click', (e) => {
      const b = e.target.closest('[data-rm]'); if (!b) return;
      const [kind, val] = b.dataset.rm.split(':');
      if (kind === 'cat') F.cats = F.cats.filter((c) => c !== val);
      if (kind === 'brand') { F.brands = F.brands.filter((c) => c !== val); qsa('#fBrands input').forEach((i) => { if (i.dataset.brand === val) i.checked = false; }); }
      if (kind === 'q') F.q = '';
      if (kind === 'price') { F.min = ''; F.max = ''; qs('#fMin').value = ''; qs('#fMax').value = ''; }
      if (kind === 'deal') { F.deal = false; qs('#fDeal').checked = false; }
      F.page = 1; render();
    });
  }

  function render() {
    const list = filtered();
    const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
    if (F.page > pages) F.page = pages;
    const slice = list.slice((F.page - 1) * PER_PAGE, F.page * PER_PAGE);

    qs('#crumbCat').textContent = catName();
    document.title = catName() + ' | ' + (A.S.settings.siteName || 'ولتا');
    qs('#resultCount').innerHTML = list.length
      ? '<b style="color:#fff">' + toFa(list.length) + '</b> محصول یافت شد' + (list.length > PER_PAGE ? ' — صفحه ' + toFa(F.page) + ' از ' + toFa(pages) : '')
      : 'محصولی با این فیلترها پیدا نشد';

    qs('#shopGrid').innerHTML = slice.length ? slice.map(A.productCard).join('')
      : '<div class="empty-state" style="grid-column:1/-1;padding:60px 20px">' + icon('search') + '<b>محصولی یافت نشد</b><span>فیلترها را تغییر دهید یا عبارت دیگری جستجو کنید</span><button class="btn btn-soft btn-sm" id="emptyReset">حذف فیلترها</button></div>';
    const er = qs('#emptyReset'); if (er) er.addEventListener('click', () => qs('#clearFilters').click());

    /* چیپ‌های فیلتر فعال */
    const chips = [];
    F.cats.forEach((c) => chips.push(chip('cat:' + c, A.catById(c).name)));
    F.brands.forEach((b) => chips.push(chip('brand:' + b, b)));
    if (F.q) chips.push(chip('q:' + F.q, 'جستجو: ' + F.q));
    if (F.min || F.max) chips.push(chip('price:', (F.min ? 'از ' + fmt(F.min) : '') + (F.max ? ' تا ' + fmt(F.max) : '') + ' تومان'));
    if (F.deal) chips.push(chip('deal:1', 'تخفیف‌دار'));
    qs('#activeFilters').innerHTML = chips.join('');
    function chip(k, label) {
      return '<span class="chip">' + esc(label) + '<button data-rm="' + esc(k) + '" aria-label="حذف فیلتر">' + icon('x') + '</button></span>';
    }

    /* صفحه‌بندی */
    const pg = [];
    if (pages > 1) {
      for (let i = 1; i <= pages; i++) pg.push('<button class="page-btn' + (i === F.page ? ' active' : '') + '" data-page="' + i + '">' + toFa(i) + '</button>');
    }
    qs('#pagination').innerHTML = pg.join('');
  }
})();
