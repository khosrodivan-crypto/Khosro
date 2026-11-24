(function () {
  const A = window.AHT;
  const { icon, fmt, toFa, esc, qs, num } = A;

  document.addEventListener('DOMContentLoaded', async () => {
    await A.loadAll();
    A.mountChrome();
    A.bindProducts(document);
    const id = A.params().id;
    const p = id ? A.prodById(id) : null;
    if (!p) {
      qs('#pdpRoot').innerHTML = '<div class="empty-state" style="padding:70px 20px">' + icon('alert') + '<b>محصول پیدا نشد</b><span>ممکن است این کالا حذف شده یا لینک نادرست باشد</span><a class="btn btn-soft btn-sm" href="shop.html">بازگشت به فروشگاه</a></div>';
      qs('#pdpRelatedWrap').remove();
      return;
    }
    render(p);
  });

  const SPEC_LABELS = {
    socket: 'سوکت', cores: 'تعداد هسته', threads: 'تعداد رشته', tdp: 'توان حرارتی (وات)', ramType: 'نوع حافظه', baseClock: 'فرکانس پایه', boostClock: 'فرکانس توربو', cache: 'حافظه کش', igpu: 'گرافیک مجتمع',
    chipset: 'چیپست', formFactor: 'فرم‌فاکتور', ramSlots: 'اسلات حافظه', maxRam: 'حداکثر حافظه', m2: 'اسلات M.2', wifi: 'وای‌فای', lan: 'شبکه',
    capacity: 'ظرفیت', sticks: 'تعداد ماژول', speed: 'سرعت', cl: 'تایمینگ', voltage: 'ولتاژ', rgb: 'نورپردازی',
    chip: 'تراشه گرافیکی', vram: 'حافظه گرافیکی', length: 'طول کارت (میلی‌متر)', power: 'اتصال برق', ports: 'خروجی‌ها',
    type: 'نوع', interface: 'رابط', readSpeed: 'سرعت خواندن', writeSpeed: 'سرعت نوشتن', rpm: 'دور موتور',
    sockets: 'سوکت‌های پشتیبانی‌شده', height: 'ارتفاع', fans: 'فن‌ها', radiator: 'رادیاتور',
    formFactors: 'فرم‌فاکتورهای پشتیبانی‌شده', maxVga: 'حداکثر طول کارت گرافیک', maxCooler: 'حداکثر ارتفاع خنک‌کننده', glass: 'پنل شیشه‌ای', psuSupport: 'پاور پشتیبانی‌شده',
    wattage: 'توان (وات)', efficiency: 'راندمان', modular: 'ماژولار بودن', fan: 'فن', pcie8pin: 'کانکتور PCIe', atxVersion: 'استاندارد ATX',
    size: 'اندازه', controller: 'کنترلر', airflow: 'جریان هوا', noise: 'صدا', material: 'جنس',
    connection: 'اتصال', layout: 'چیدمان', switch: 'سوییچ', antiGhosting: 'ضد شبح', dpi: 'DPI', buttons: 'دکمه‌ها', battery: 'باتری', weight: 'وزن',
    sound: 'صدا', mic: 'میکروفن', impedance: 'امپدانس', resolution: 'رزولوشن', refresh: 'نرخ نوسازی', panel: 'پنل', response: 'زمان پاسخ',
    bands: 'باندها', standard: 'استاندارد', antennas: 'آنتن', managed: 'مدیریت‌پذیر', case: 'بدنه', category: 'دسته کابل', connector: 'کانکتور', shielding: 'شیلد',
    maxTdp: 'حداکثر توان', color: 'رنگ', warranty: 'گارانتی'
  };
  const label = (k) => SPEC_LABELS[k] || k;

  function val(v) {
    if (Array.isArray(v)) return v.join(' ، ');
    if (typeof v === 'number') return toFa(v);
    if (typeof v === 'boolean') return v ? 'دارد' : 'ندارد';
    return String(v).replace(/\d+/g, (d) => toFa(d));
  }

  function render(p) {
    const cat = A.catById(p.cat);
    const off = A.discountPct(p);
    const stock = num(p.stock);
    const gallery = [p.img].concat(p.gallery || []).filter(Boolean);
    document.title = p.name + ' | ' + (A.S.settings.siteName || 'ولتا');
    const md = qs('meta[name=description]'); if (md) md.setAttribute('content', (p.desc || p.name).slice(0, 158));

    qs('#pdpCrumbs').innerHTML =
      '<a href="index.html">خانه</a>' + sep() +
      '<a href="shop.html">فروشگاه</a>' + sep() +
      '<a href="shop.html?cat=' + p.cat + '">' + esc(cat.name) + '</a>' + sep() +
      '<span style="color:var(--text-2)">' + esc(p.name) + '</span>';
    function sep() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>'; }

    const specRows = Object.keys(p.specs || {}).filter((k) => p.specs[k] !== '' && p.specs[k] != null)
      .map((k) => '<tr><td>' + esc(label(k)) + '</td><td>' + esc(val(p.specs[k])) + '</td></tr>').join('');

    qs('#pdpRoot').innerHTML =
      '<div class="pdp">' +
        '<div>' +
          '<div class="pdp-gallery">' +
            '<div class="pdp-main-img"><img id="pdpMainImg" src="' + esc(gallery[0]) + '" alt="' + esc(p.name) + '"></div>' +
            (gallery.length > 1 ? '<div class="pdp-thumbs">' + gallery.map((g, i) => '<button class="pdp-thumb' + (i === 0 ? ' active' : '') + '" data-g="' + esc(g) + '"><img src="' + esc(g) + '" alt=""></button>').join('') + '</div>' : '') +
          '</div>' +
          '<div class="panel" style="margin-top:14px">' +
            '<div class="panel-head">' + icon('box') + ' مشخصات فنی</div>' +
            '<div class="panel-body" style="padding:0"><table class="spec-table">' + specRows + '</table></div>' +
          '</div>' +
          (p.desc ? '<div class="panel" style="margin-top:14px"><div class="panel-head">' + icon('info') + ' توضیحات محصول</div><div class="panel-body" style="font-size:13px;line-height:2.2;color:var(--text-2)">' + esc(p.desc) + '</div></div>' : '') +
        '</div>' +
        '<div class="pdp-info">' +
          '<div>' +
            '<div class="pdp-meta" style="margin-bottom:6px"><span class="pill pill-brand">' + esc(p.brand || '') + '</span><span>' + esc(cat.full || cat.name) + '</span></div>' +
            '<h1 class="pdp-title">' + esc(p.name) + '</h1>' +
            '<div class="pdp-meta" style="margin-top:8px">' +
              '<span class="rating">' + icon('star') + toFa((p.rating || 4.5).toFixed ? String(p.rating) : p.rating) + '</span>' +
              '<span>•</span><span>' + toFa(p.sold || 0) + ' فروش موفق</span>' +
              (p.warranty ? '<span>•</span><span style="color:#5ee0a5">' + esc(p.warranty) + '</span>' : '') +
            '</div>' +
          '</div>' +
          '<div class="pdp-price-box">' +
            '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">' +
              (stock > 0 ? '<span class="pill pill-ok">' + icon('check') + ' موجود در انبار</span>' : '<span class="pill pill-danger">ناموجود</span>') +
              (off ? '<span class="pdp-off">' + toFa(off) + '٪ تخفیف</span>' : '') +
            '</div>' +
            (off ? '<div class="pdp-old">' + fmt(p.oldPrice) + ' تومان</div>' : '') +
            '<div class="pdp-price">' + fmt(p.price) + ' <span class="cur">تومان</span></div>' +
            (stock > 0 && stock <= 5 ? '<div class="hint" style="color:var(--warn)">تنها ' + toFa(stock) + ' عدد در انبار باقی مانده</div>' : '') +
            '<div class="pdp-buy">' +
              '<button class="btn btn-lg" id="pdpAdd">' + icon('cart') + ' افزودن به سبد خرید</button>' +
              '<button class="icon-btn" id="pdpFav" title="علاقه‌مندی" style="width:46px;height:46px">' + icon('heart') + '</button>' +
            '</div>' +
            '<ul class="feature-list">' +
              '<li>' + icon('shield') + '<span>گارانتی اصالت و سلامت فیزیکی کالا</span></li>' +
              '<li>' + icon('truck') + '<span>ارسال سریع به سراسر کشور — رایگان بالای ' + fmt(A.S.settings.freeShipThreshold) + ' تومان</span></li>' +
              '<li>' + icon('headset') + '<span>مشاوره فنی رایگان قبل و بعد از خرید</span></li>' +
            '</ul>' +
          '</div>' +
          ((p.features || []).length ? '<div class="panel"><div class="panel-head">' + icon('zap') + ' نقاط قوت</div><div class="panel-body"><ul class="feature-list">' +
            p.features.map((f) => '<li>' + icon('check') + '<span>' + esc(f) + '</span></li>').join('') + '</ul></div></div>' : '') +
          '<a class="btn btn-ghost btn-block" href="build.html">' + icon('wrench') + ' این قطعه را در اسمبل هوشمند بگذار</a>' +
        '</div>' +
      '</div>';

    /* رفتارها */
    qs('#pdpAdd').addEventListener('click', () => A.cartAdd(p.id, 1));
    const favBtn = qs('#pdpFav');
    if (A.isFav(p.id)) favBtn.style.color = '#e0314f';
    favBtn.addEventListener('click', () => { A.toggleFav(p.id); favBtn.style.color = A.isFav(p.id) ? '#e0314f' : ''; });
    A.qsa('.pdp-thumb').forEach((t) => t.addEventListener('click', () => {
      qs('#pdpMainImg').src = t.dataset.g;
      A.qsa('.pdp-thumb').forEach((x) => x.classList.toggle('active', x === t));
    }));

    /* مشابه‌ها */
    const related = A.activeProducts().filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4);
    const rel = related.length ? related : A.activeProducts().filter((x) => x.id !== p.id).slice(0, 4);
    qs('#pdpRelated').innerHTML = rel.map(A.productCard).join('');

    /* داده ساختاریافته */
    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Product', name: p.name, image: location.origin + '/' + p.img,
      description: p.desc || p.name, brand: { '@type': 'Brand', name: p.brand || '' },
      sku: p.id,
      offers: { '@type': 'Offer', priceCurrency: 'IRR', price: num(p.price) * 10, availability: stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        seller: { '@type': 'Organization', name: A.S.settings.siteName } }
    });
    document.head.appendChild(ld);
  }
})();
