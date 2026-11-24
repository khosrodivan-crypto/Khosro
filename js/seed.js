/* =========================================================
   ولتا — کاتالوگ اولیه (Seed)
   این داده‌ها فقط یک‌بار (وقتی سرور خالی است) به‌عنوان پیش‌فرض
   بارگذاری می‌شوند و بعد از آن، همه‌چیز از پنل مدیریت خوانده می‌شود.
   ========================================================= */
window.AHT_SEED = (function () {
  const cats = [
    { id: 'cpu',     name: 'پردازنده',            full: 'پردازنده (CPU)',            icon: 'cpu',     active: true, order: 1 },
    { id: 'mb',      name: 'مادربرد',              full: 'مادربرد (Mainboard)',       icon: 'mb',      active: true, order: 2 },
    { id: 'ram',     name: 'حافظه رم',             full: 'حافظه رم (RAM)',            icon: 'ram',     active: true, order: 3 },
    { id: 'vga',     name: 'کارت گرافیک',          full: 'کارت گرافیک (VGA)',         icon: 'vga',     active: true, order: 4 },
    { id: 'storage', name: 'حافظه جانبی',          full: 'حافظه و ذخیره‌سازی',        icon: 'ssd',     active: true, order: 5 },
    { id: 'cooler',  name: 'خنک‌کننده',            full: 'خنک‌کننده پردازنده و کیس',  icon: 'cooler',  active: true, order: 6 },
    { id: 'case',    name: 'کیس',                  full: 'کیس و شاسی',                icon: 'case',    active: true, order: 7 },
    { id: 'psu',     name: 'منبع تغذیه',           full: 'منبع تغذیه (پاور)',         icon: 'psu',     active: true, order: 8 },
    { id: 'deco',    name: 'قطعات تزئینی',         full: 'قطعات تزئینی و RGB',        icon: 'rgb',     active: true, order: 9 },
    { id: 'periph',  name: 'تجهیزات جانبی',        full: 'تجهیزات جانبی',             icon: 'mouse',   active: true, order: 10 },
    { id: 'network', name: 'تجهیزات شبکه',         full: 'تجهیزات شبکه',              icon: 'wifi',    active: true, order: 11 }
  ];

  const brands = ['Intel', 'AMD', 'ASUS', 'MSI', 'Gigabyte', 'ASRock', 'Corsair', 'Kingston', 'Samsung', 'WD', 'Seagate', 'Cooler Master', 'DeepCool', 'NZXT', 'TP-Link', 'Logitech', 'Green', 'Lian Li'];

  const p = (o) => Object.assign({ active: true, rating: 4.6, sold: 0, gallery: [], tags: [] }, o);

  const products = [
    /* ---------------- پردازنده ---------------- */
    p({ id: 'cpu-i5-14400f', name: 'پردازنده اینتل Core i5-14400F — ۱۰ هسته‌ای', brand: 'Intel', cat: 'cpu', price: 9450000, oldPrice: 10300000, stock: 14, img: 'img/cpu-2.webp', warranty: '۳۶ ماه گارانتی', rating: 4.7, sold: 62, tags: ['پرفروش'],
      desc: 'پردازنده ۱۰ هسته‌ای (۶ هسته عملکردی + ۴ هسته بهینه) با فرکانس توربو ۴.۷ گیگاهرتز، انتخابی متعادل برای گیمینگ ۱۰۸۰p و کارهای روزمره. بدون گرافیک مجتمع.',
      specs: { socket: 'LGA1700', cores: 10, threads: 16, tdp: 65, ramType: 'DDR5', baseClock: '2.5GHz', boostClock: '4.7GHz', cache: '20MB', igpu: 'ندارد' },
      features: ['۶ هسته عملکردی + ۴ هسته بهینه', 'پشتیبانی از حافظه DDR5 و DDR4', 'مناسب گیمینگ ۱۰۸۰p', 'بدون نیاز به خنک‌کننده گران‌قیمت'] }),

    p({ id: 'cpu-i5-14600k', name: 'پردازنده اینتل Core i5-14600K — قابل اورکلاک', brand: 'Intel', cat: 'cpu', price: 15800000, oldPrice: 17400000, stock: 9, img: 'img/cpu-2.webp', warranty: '۳۶ ماه گارانتی', rating: 4.8, sold: 48, tags: ['پیشنهاد ما'],
      desc: 'بهترین انتخاب میان‌رده گیمینگ؛ ۱۴ هسته با فرکانس توربو ۵.۳ گیگاهرتز و ضریب باز برای اورکلاک. برای استفاده کامل به خنک‌کننده تاوَر و مادربرد سری Z نیاز دارد.',
      specs: { socket: 'LGA1700', cores: 14, threads: 20, tdp: 125, ramType: 'DDR5', baseClock: '3.5GHz', boostClock: '5.3GHz', cache: '24MB', igpu: 'Intel UHD 770' },
      features: ['۱۴ هسته و ۲۰ رشته', 'ضریب باز (Unlocked)', 'گرافیک مجتمع UHD 770', 'نیازمند خنک‌کننده ۱۵۰ وات به بالا'] }),

    p({ id: 'cpu-i7-14700k', name: 'پردازنده اینتل Core i7-14700K — ۲۰ هسته‌ای', brand: 'Intel', cat: 'cpu', price: 27900000, stock: 6, img: 'img/cpu-1.webp', warranty: '۳۶ ماه گارانتی', rating: 4.9, sold: 31, tags: ['پرفروش'],
      desc: '۲۰ هسته (۸ عملکردی + ۱۲ بهینه) با فرکانس توربو ۵.۶ گیگاهرتز؛ برای رندر، تدوین و گیمینگ هم‌زمان. توان حرارتی بالا، خنک‌کننده مایع ۲۴۰ میلی‌متری توصیه می‌شود.',
      specs: { socket: 'LGA1700', cores: 20, threads: 28, tdp: 125, ramType: 'DDR5', baseClock: '3.4GHz', boostClock: '5.6GHz', cache: '33MB', igpu: 'Intel UHD 770' },
      features: ['۸ هسته عملکردی + ۱۲ هسته بهینه', 'فرکانس توربو تا ۵.۶ گیگاهرتز', 'مناسب رندر و استریم', 'خنک‌کننده مایع توصیه می‌شود'] }),

    p({ id: 'cpu-i9-14900k', name: 'پردازنده اینتل Core i9-14900K — پرچم‌دار', brand: 'Intel', cat: 'cpu', price: 41500000, oldPrice: 44900000, stock: 3, img: 'img/cpu-1.webp', warranty: '۳۶ ماه گارانتی', rating: 4.9, sold: 12, tags: ['حرفه‌ای'],
      desc: 'پرچم‌دار سوکت LGA1700 با ۲۴ هسته و فرکانس ۶ گیگاهرتز. برای بالاترین عملکرد تک‌رشته‌ای و چندرشته‌ای؛ نیازمند خنک‌کننده مایع ۳۶۰ و پاور ۸۵۰ وات به بالا.',
      specs: { socket: 'LGA1700', cores: 24, threads: 32, tdp: 125, ramType: 'DDR5', baseClock: '3.2GHz', boostClock: '6.0GHz', cache: '36MB', igpu: 'Intel UHD 770' },
      features: ['۲۴ هسته و ۳۲ رشته', 'فرکانس توربو ۶ گیگاهرتز', 'مناسب رندر سنگین و ۴K', 'خنک‌کننده مایع ۳۶۰ الزامی'] }),

    p({ id: 'cpu-r5-5600', name: 'پردازنده AMD Ryzen 5 5600 — اقتصادی گیمینگ', brand: 'AMD', cat: 'cpu', price: 5350000, stock: 21, img: 'img/cpu-3.webp', warranty: '۳۶ ماه گارانتی', rating: 4.6, sold: 88, tags: ['اقتصادی'],
      desc: '۶ هسته و ۱۲ رشته با معماری Zen 3 روی سوکت AM4؛ مقرون‌به‌صرفه‌ترین پردازنده گیمینگ ۱۰۸۰p با مادربردهای ارزان B450/B550.',
      specs: { socket: 'AM4', cores: 6, threads: 12, tdp: 65, ramType: 'DDR4', baseClock: '3.5GHz', boostClock: '4.4GHz', cache: '32MB', igpu: 'ندارد' },
      features: ['۶ هسته / ۱۲ رشته', 'سازگار با مادربردهای AM4 قدیمی', 'مصرف کم ۶۵ وات', 'خنک‌کننده استوک همراه'] }),

    p({ id: 'cpu-r5-7600', name: 'پردازنده AMD Ryzen 5 7600 — نسل جدید AM5', brand: 'AMD', cat: 'cpu', price: 11200000, oldPrice: 12400000, stock: 11, img: 'img/cpu-3.webp', warranty: '۳۶ ماه گارانتی', rating: 4.7, sold: 39, tags: [],
      desc: '۶ هسته Zen 4 روی پلتفرم AM5 با پشتیبانی DDR5 و PCIe 5.0. مسیر ارتقای بلندمدت و راندمان انرژی عالی.',
      specs: { socket: 'AM5', cores: 6, threads: 12, tdp: 65, ramType: 'DDR5', baseClock: '3.8GHz', boostClock: '5.1GHz', cache: '32MB', igpu: 'AMD Radeon Graphics' },
      features: ['معماری Zen 4 و پلتفرم AM5', 'گرافیک مجتمع RDNA2', 'پشتیبانی DDR5 و PCIe 5.0', 'راندمان انرژی بالا'] }),

    p({ id: 'cpu-r7-7800x3d', name: 'پردازنده AMD Ryzen 7 7800X3D — پادشاه گیمینگ', brand: 'AMD', cat: 'cpu', price: 23400000, stock: 5, img: 'img/cpu-3.webp', warranty: '۳۶ ماه گارانتی', rating: 5.0, sold: 27, tags: ['پرفروش'],
      desc: 'با حافظه کش سه‌بعدی ۱۰۴ مگابایتی، سریع‌ترین پردازنده گیمینگ پلتفرم AM5 با مصرف بهینه. محبوب‌ترین انتخاب سیستم‌های گیمینگ حرفه‌ای.',
      specs: { socket: 'AM5', cores: 8, threads: 16, tdp: 120, ramType: 'DDR5', baseClock: '4.2GHz', boostClock: '5.0GHz', cache: '104MB', igpu: 'AMD Radeon Graphics' },
      features: ['کش سه‌بعدی ۱۰۴ مگابایتی', 'بهترین فریم‌ریت گیمینگ', 'مصرف بهینه', 'خنک‌کننده هوایی کافی است'] }),

    p({ id: 'cpu-r9-7950x', name: 'پردازنده AMD Ryzen 9 7950X — ۱۶ هسته‌ای', brand: 'AMD', cat: 'cpu', price: 38900000, stock: 2, img: 'img/cpu-3.webp', warranty: '۳۶ ماه گارانتی', rating: 4.8, sold: 8, tags: ['حرفه‌ای'],
      desc: '۱۶ هسته و ۳۲ رشته برای رندر، مهندسی و ورک‌استیشن. تا ۵.۷ گیگاهرتز و پشتیبانی کامل DDR5.',
      specs: { socket: 'AM5', cores: 16, threads: 32, tdp: 170, ramType: 'DDR5', baseClock: '4.5GHz', boostClock: '5.7GHz', cache: '80MB', igpu: 'AMD Radeon Graphics' },
      features: ['۱۶ هسته / ۳۲ رشته', 'مناسب رندر و ورک‌استیشن', 'فرکانس تا ۵.۷ گیگاهرتز', 'نیازمند خنک‌کننده مایع ۲۸۰+'] }),

    /* ---------------- مادربرد ---------------- */
    p({ id: 'mb-b760m-a', name: 'مادربرد ایسوس PRIME B760M-A WIFI DDR5', brand: 'ASUS', cat: 'mb', price: 8900000, oldPrice: 9600000, stock: 12, img: 'img/mb-1.webp', warranty: '۳۶ ماه گارانتی', rating: 4.5, sold: 34, tags: [],
      desc: 'مادربرد Micro-ATX سوکت LGA1700 با پشتیبانی DDR5، وای‌فای ۶ و دو اسلات M.2. انتخاب متعادل برای سیستم‌های نسل ۱۳ و ۱۴ اینتل.',
      specs: { socket: 'LGA1700', chipset: 'B760', formFactor: 'Micro-ATX', ramType: 'DDR5', ramSlots: 4, maxRam: '128GB', m2: 2, wifi: 'دارد', lan: '2.5GbE' },
      features: ['سوکت LGA1700 (نسل ۱۲/۱۳/۱۴)', '۴ اسلات DDR5 تا ۱۲۸ گیگابایت', 'وای‌فای ۶ و بلوتوث', '۲ اسلات M.2 Gen4'] }),

    p({ id: 'mb-b650-tomahawk', name: 'مادربرد ام‌اس‌آی MAG B650 TOMAHAWK WIFI', brand: 'MSI', cat: 'mb', price: 14200000, stock: 8, img: 'img/mb-2.webp', warranty: '۳۶ ماه گارانتی', rating: 4.8, sold: 22, tags: ['پیشنهاد ما'],
      desc: 'مادربرد ATX سوکت AM5 با مدار تغذیه قوی، DDR5 و وای‌فای ۶E. پایه‌ای مطمئن برای Ryzen 7000/9000.',
      specs: { socket: 'AM5', chipset: 'B650', formFactor: 'ATX', ramType: 'DDR5', ramSlots: 4, maxRam: '128GB', m2: 3, wifi: 'دارد', lan: '2.5GbE' },
      features: ['سوکت AM5 (Ryzen 7000/8000/9000)', '۱۴+۲+۱ فاز تغذیه', '۳ اسلات M.2 Gen4', 'وای‌فای ۶E'] }),

    p({ id: 'mb-x670-aorus', name: 'مادربرد گیگابایت X670 AORUS ELITE AX', brand: 'Gigabyte', cat: 'mb', price: 19800000, stock: 4, img: 'img/mb-2.webp', warranty: '۳۶ ماه گارانتی', rating: 4.7, sold: 11, tags: [],
      desc: 'مادربرد ATX رده بالا با چیپست X670، پشتیبانی PCIe 5.0 و چهار اسلات M.2؛ مناسب پردازنده‌های پرچم‌دار Ryzen 9.',
      specs: { socket: 'AM5', chipset: 'X670', formFactor: 'ATX', ramType: 'DDR5', ramSlots: 4, maxRam: '192GB', m2: 4, wifi: 'دارد', lan: '2.5GbE' },
      features: ['چیپست X670 با PCIe 5.0', '۴ اسلات M.2 (یکی Gen5)', 'مدار تغذیه ۱۶+۲+۲', 'وای‌فای ۶E'] }),

    p({ id: 'mb-b550m-ds3h', name: 'مادربرد گیگابایت B550M DS3H — اقتصادی', brand: 'Gigabyte', cat: 'mb', price: 4350000, stock: 18, img: 'img/mb-3.webp', warranty: '۲۴ ماه گارانتی', rating: 4.3, sold: 57, tags: ['اقتصادی'],
      desc: 'مادربرد Micro-ATX سوکت AM4 با پشتیبانی DDR4؛ گزینه اقتصادی برای Ryzen 5000 و سیستم‌های اداری/گیمینگ سبک.',
      specs: { socket: 'AM4', chipset: 'B550', formFactor: 'Micro-ATX', ramType: 'DDR4', ramSlots: 4, maxRam: '128GB', m2: 1, wifi: 'ندارد', lan: '1GbE' },
      features: ['سوکت AM4', '۴ اسلات DDR4', 'یک اسلات M.2', 'قیمت اقتصادی'] }),

    p({ id: 'mb-z790-p', name: 'مادربرد ایسوس PRIME Z790-P WIFI DDR5', brand: 'ASUS', cat: 'mb', price: 17600000, oldPrice: 18900000, stock: 6, img: 'img/mb-1.webp', warranty: '۳۶ ماه گارانتی', rating: 4.6, sold: 15, tags: [],
      desc: 'مادربرد ATX چیپست Z790 با قابلیت اورکلاک، PCIe 5.0 و پشتیبانی کامل از DDR5؛ برای Core i7 و i9 نسل ۱۳/۱۴.',
      specs: { socket: 'LGA1700', chipset: 'Z790', formFactor: 'ATX', ramType: 'DDR5', ramSlots: 4, maxRam: '192GB', m2: 3, wifi: 'دارد', lan: '2.5GbE' },
      features: ['اورکلاک پردازنده و حافظه', 'PCIe 5.0 x16', '۳ اسلات M.2', 'خنک‌کننده VRM اختصاصی'] }),

    p({ id: 'mb-b650m-hdv', name: 'مادربرد ایس‌راک B650M-HDV/M.2 DDR5', brand: 'ASRock', cat: 'mb', price: 7300000, stock: 15, img: 'img/mb-3.webp', warranty: '۱۸ ماه گارانتی', rating: 4.2, sold: 26, tags: ['اقتصادی'],
      desc: 'ارزان‌ترین راه ورود به پلتفرم AM5 با DDR5 و اسلات M.2؛ مناسب Ryzen 5.',
      specs: { socket: 'AM5', chipset: 'B650', formFactor: 'Micro-ATX', ramType: 'DDR5', ramSlots: 2, maxRam: '96GB', m2: 2, wifi: 'ندارد', lan: '1GbE' },
      features: ['ورود اقتصادی به AM5', '۲ اسلات DDR5', '۲ اسلات M.2', 'PCIe 5.0 x16'] }),

    /* ---------------- رم ---------------- */
    p({ id: 'ram-fury-16-5600', name: 'رم کینگستون FURY Beast 16GB DDR5 5600', brand: 'Kingston', cat: 'ram', price: 4650000, oldPrice: 5100000, stock: 24, img: 'img/ram-2.webp', warranty: 'مادام‌العمر', rating: 4.7, sold: 73, tags: ['پرفروش'],
      desc: 'یک ماژول ۱۶ گیگابایتی DDR5 با فرکانس ۵۶۰۰ مگاهرتز و تایمینگ CL36؛ مناسب ارتقای سریع سیستم‌های تک‌کاناله.',
      specs: { ramType: 'DDR5', capacity: '16GB', sticks: '1×16GB', speed: 5600, cl: 'CL36', voltage: '1.25V', rgb: 'ندارد' },
      features: ['DDR5 5600MT/s', 'هیت‌سینک آلومینیومی', 'پروفایل EXPO/XMP', 'گارانتی مادام‌العمر'] }),

    p({ id: 'ram-trident-32-6000', name: 'رم جی‌اسکیل Trident Z5 RGB 32GB DDR5 6000 CL30', brand: 'G.Skill', cat: 'ram', price: 9700000, stock: 7, img: 'img/ram-1.webp', warranty: 'مادام‌العمر', rating: 4.9, sold: 41, tags: ['حرفه‌ای'],
      desc: 'کیت دوکاناله ۲×۱۶ گیگابایت DDR5 با فرکانس ۶۰۰۰ و تایمینگ CL30؛ عملکرد بهینه در گیمینگ و رندر با نورپردازی RGB.',
      specs: { ramType: 'DDR5', capacity: '32GB', sticks: '2×16GB', speed: 6000, cl: 'CL30', voltage: '1.35V', rgb: 'دارد' },
      features: ['کیت دوکاناله ۲×۱۶ گیگ', 'CL30 با چیپ Hynix', 'نورپردازی RGB قابل کنترل', 'پروفایل XMP 3.0'] }),

    p({ id: 'ram-vengeance-16-3200', name: 'رم کورسیر Vengeance LPX 16GB DDR4 3200', brand: 'Corsair', cat: 'ram', price: 3250000, stock: 30, img: 'img/ram-4.webp', warranty: 'مادام‌العمر', rating: 4.5, sold: 96, tags: ['اقتصادی'],
      desc: 'کیت ۲×۸ گیگابایت DDR4 با ارتفاع کم؛ سازگار با تمام مادربردهای AM4 و LGA1200/1700 (نسخه DDR4).',
      specs: { ramType: 'DDR4', capacity: '16GB', sticks: '2×8GB', speed: 3200, cl: 'CL16', voltage: '1.35V', rgb: 'ندارد' },
      features: ['کیت دوکاناله ۲×۸', 'ارتفاع کم (سازگار با کولر بزرگ)', 'XMP 2.0', 'مناسب سیستم‌های اقتصادی'] }),

    p({ id: 'ram-adata-8-3200', name: 'رم ای‌دیتا Premier 8GB DDR4 3200', brand: 'ADATA', cat: 'ram', price: 1450000, stock: 44, img: 'img/ram-2.webp', warranty: 'مادام‌العمر', rating: 4.1, sold: 120, tags: ['اقتصادی'],
      desc: 'ماژول تک‌کاناله ۸ گیگابایتی DDR4 برای سیستم‌های اداری و ارتقای حافظه.',
      specs: { ramType: 'DDR4', capacity: '8GB', sticks: '1×8GB', speed: 3200, cl: 'CL22', voltage: '1.2V', rgb: 'ندارد' },
      features: ['تک ماژول ۸ گیگ', 'مصرف کم ۱.۲ ولت', 'مناسب اداری', 'قیمت اقتصادی'] }),

    p({ id: 'ram-fury-64-6000', name: 'رم کینگستون FURY Renegade 64GB DDR5 6000', brand: 'Kingston', cat: 'ram', price: 19800000, stock: 3, img: 'img/ram-1.webp', warranty: 'مادام‌العمر', rating: 4.8, sold: 9, tags: ['حرفه‌ای'],
      desc: 'کیت ۲×۳۲ گیگابایت برای ورک‌استیشن و رندر سنگین با فرکانس ۶۰۰۰ و تایمینگ پایین.',
      specs: { ramType: 'DDR5', capacity: '64GB', sticks: '2×32GB', speed: 6000, cl: 'CL32', voltage: '1.35V', rgb: 'دارد' },
      features: ['۶۴ گیگابایت ظرفیت', 'CL32', 'هیت‌سینک RGB', 'مناسب رندر و مجازی‌سازی'] }),

    /* ---------------- کارت گرافیک ---------------- */
    p({ id: 'vga-rtx4060-8g', name: 'کارت گرافیک ایسوس RTX 4060 Dual 8GB OC', brand: 'ASUS', cat: 'vga', price: 21500000, oldPrice: 23900000, stock: 10, img: 'img/vga-1.webp', warranty: '۳۶ ماه گارانتی', rating: 4.6, sold: 45, tags: ['پرفروش'],
      desc: 'کارت گرافیک ۸ گیگابایتی با معماری Ada، پشتیبانی DLSS 3 و مصرف تنها ۱۱۵ وات؛ بهترین انتخاب ۱۰۸۰p با پاور ۵۵۰ وات.',
      specs: { chip: 'GeForce RTX 4060', vram: '8GB GDDR6', tdp: 115, length: 227, power: '8-pin', ports: 'HDMI 2.1 + 3×DP 1.4', boostClock: '2505MHz' },
      features: ['DLSS 3 و Ray Tracing', 'مصرف کم ۱۱۵ وات', 'مناسب ۱۰۸۰p با نرخ بالا', 'پاور ۵۵۰ وات کافی است'] }),

    p({ id: 'vga-rtx4070s-12g', name: 'کارت گرافیک گیگابایت RTX 4070 SUPER Windforce 12GB', brand: 'Gigabyte', cat: 'vga', price: 44500000, stock: 5, img: 'img/vga-2.webp', warranty: '۳۶ ماه گارانتی', rating: 4.8, sold: 21, tags: ['پیشنهاد ما'],
      desc: 'کارت گرافیک ۱۲ گیگابایتی برای گیمینگ ۱۴۴۰p با تنظیمات بالا؛ سه فن Windforce و مصرف ۲۲۰ وات.',
      specs: { chip: 'GeForce RTX 4070 SUPER', vram: '12GB GDDR6X', tdp: 220, length: 300, power: '16-pin', ports: 'HDMI 2.1 + 3×DP 1.4', boostClock: '2475MHz' },
      features: ['مناسب ۱۴۴۰p با ۱۴۴ فریم', '۱۲ گیگابایت GDDR6X', 'سه فن Windforce', 'پاور ۷۵۰ وات توصیه می‌شود'] }),

    p({ id: 'vga-rtx4090-24g', name: 'کارت گرافیک ایسوس ROG RTX 4090 24GB', brand: 'ASUS', cat: 'vga', price: 118000000, stock: 1, img: 'img/vga-3.webp', warranty: '۳۶ ماه گارانتی', rating: 5.0, sold: 4, tags: ['حرفه‌ای'],
      desc: 'قدرتمندترین کارت گرافیک نسل Ada برای ۴K، هوش مصنوعی و رندر سه‌بعدی. نیازمند پاور ۱۰۰۰ وات و کیس بزرگ.',
      specs: { chip: 'GeForce RTX 4090', vram: '24GB GDDR6X', tdp: 450, length: 358, power: '16-pin', ports: 'HDMI 2.1 + 3×DP 1.4', boostClock: '2610MHz' },
      features: ['۲۴ گیگابایت حافظه', 'مناسب ۴K و AI', 'سیستم خنک‌کننده سه‌فن بزرگ', 'پاور ۱۰۰۰ وات الزامی'] }),

    p({ id: 'vga-rx6600-8g', name: 'کارت گرافیک سافایر RX 6600 8GB', brand: 'AMD', cat: 'vga', price: 11200000, stock: 13, img: 'img/vga-4.webp', warranty: '۲۴ ماه گارانتی', rating: 4.3, sold: 52, tags: ['اقتصادی'],
      desc: 'کارت گرافیک اقتصادی ۸ گیگابایتی برای گیمینگ ۱۰۸۰p با مصرف ۱۳۲ وات و پاور ۵۰۰ وات.',
      specs: { chip: 'Radeon RX 6600', vram: '8GB GDDR6', tdp: 132, length: 240, power: '8-pin', ports: 'HDMI 2.1 + 3×DP 1.4', boostClock: '2491MHz' },
      features: ['۸ گیگابایت GDDR6', 'مناسب ۱۰۸۰p', 'پشتیبانی FSR', 'قیمت اقتصادی'] }),

    p({ id: 'vga-rx7800xt-16g', name: 'کارت گرافیک سافایر RX 7800 XT 16GB', brand: 'AMD', cat: 'vga', price: 37900000, oldPrice: 40500000, stock: 4, img: 'img/vga-5.webp', warranty: '۲۴ ماه گارانتی', rating: 4.6, sold: 17, tags: [],
      desc: '۱۶ گیگابایت حافظه برای ۱۴۴۰p؛ رقیب جدی RTX 4070 با توان مصرفی ۲۶۳ وات.',
      specs: { chip: 'Radeon RX 7800 XT', vram: '16GB GDDR6', tdp: 263, length: 320, power: '2×8-pin', ports: 'HDMI 2.1 + 3×DP 2.1', boostClock: '2430MHz' },
      features: ['۱۶ گیگابایت حافظه', 'مناسب ۱۴۴۰p', 'FSR 3 و Anti-Lag', 'سه فن خنک‌کننده'] }),

    /* ---------------- حافظه ---------------- */
    p({ id: 'ssd-980-1tb', name: 'حافظه SSD سامسونگ 980 NVMe 1TB', brand: 'Samsung', cat: 'storage', price: 5450000, oldPrice: 5900000, stock: 19, img: 'img/ssd-1.webp', warranty: '۶۰ ماه گارانتی', rating: 4.8, sold: 84, tags: ['پرفروش'],
      desc: 'اس‌اس‌دی NVMe با سرعت خواندن ۳۵۰۰ مگابایت بر ثانیه؛ مناسب نصب ویندوز و برنامه‌های سنگین.',
      specs: { type: 'SSD NVMe', capacity: '1TB', interface: 'PCIe 3.0 x4', readSpeed: '3500MB/s', writeSpeed: '3000MB/s', formFactor: 'M.2 2280' },
      features: ['سرعت خواندن ۳۵۰۰ مگابایت', 'فرم‌فاکتور M.2 2280', '۵ سال گارانتی', 'مناسب ویندوز و بازی'] }),

    p({ id: 'ssd-nv2-500', name: 'حافظه SSD کینگستون NV2 NVMe 500GB', brand: 'Kingston', cat: 'storage', price: 2350000, stock: 35, img: 'img/ssd-2.webp', warranty: '۳۶ ماه گارانتی', rating: 4.4, sold: 110, tags: ['اقتصادی'],
      desc: 'ارزان‌ترین راه ارتقای سیستم به NVMe؛ سرعت خواندن تا ۳۵۰۰ مگابایت بر ثانیه.',
      specs: { type: 'SSD NVMe', capacity: '500GB', interface: 'PCIe 4.0 x4', readSpeed: '3500MB/s', writeSpeed: '2100MB/s', formFactor: 'M.2 2280' },
      features: ['PCIe 4.0', '۵۰۰ گیگابایت', 'بدون کابل‌کشی', 'قیمت اقتصادی'] }),

    p({ id: 'ssd-sn850x-2tb', name: 'حافظه SSD وسترن دیجیتال SN850X Black 2TB', brand: 'WD', cat: 'storage', price: 12800000, stock: 6, img: 'img/ssd-1.webp', warranty: '۶۰ ماه گارانتی', rating: 4.9, sold: 28, tags: ['حرفه‌ای'],
      desc: 'اس‌اس‌دی Gen4 مخصوص گیمینگ با سرعت خواندن ۷۳۰۰ مگابایت؛ مناسب PS5 و سیستم‌های رده بالا.',
      specs: { type: 'SSD NVMe', capacity: '2TB', interface: 'PCIe 4.0 x4', readSpeed: '7300MB/s', writeSpeed: '6600MB/s', formFactor: 'M.2 2280' },
      features: ['سرعت ۷۳۰۰ مگابایت', '۲ ترابایت ظرفیت', 'سازگار با PS5', 'هیت‌سینک اختیاری'] }),

    p({ id: 'hdd-barracuda-2tb', name: 'هارد دیسک سی‌گیت Barracuda 2TB', brand: 'Seagate', cat: 'storage', price: 3350000, stock: 22, img: 'img/hdd-1.webp', warranty: '۲۴ ماه گارانتی', rating: 4.3, sold: 64, tags: [],
      desc: 'هارد ۷۲۰۰ دور برای آرشیو فیلم، عکس و فایل‌های حجیم.',
      specs: { type: 'HDD', capacity: '2TB', interface: 'SATA III', readSpeed: '190MB/s', rpm: '7200', formFactor: '3.5 اینچ' },
      features: ['۲ ترابایت ظرفیت', '۷۲۰۰ دور در دقیقه', '۶۴ مگابایت کش', 'مناسب آرشیو'] }),

    p({ id: 'hdd-wd-blue-1tb', name: 'هارد دیسک وسترن دیجیتال Blue 1TB', brand: 'WD', cat: 'storage', price: 2150000, stock: 26, img: 'img/hdd-2.webp', warranty: '۲۴ ماه گارانتی', rating: 4.2, sold: 71, tags: ['اقتصادی'],
      desc: 'هارد ۱ ترابایتی ۷۲۰۰ دور؛ انتخاب مطمئن برای ذخیره‌سازی روزمره.',
      specs: { type: 'HDD', capacity: '1TB', interface: 'SATA III', readSpeed: '150MB/s', rpm: '7200', formFactor: '3.5 اینچ' },
      features: ['۱ ترابایت', '۷۲۰۰ دور', 'مصرف کم', 'گارانتی ۲۴ ماه'] }),

    p({ id: 'st-external-2tb', name: 'هارد اکسترنال سی‌گیت One Touch 2TB', brand: 'Seagate', cat: 'storage', price: 4900000, oldPrice: 5400000, stock: 9, img: 'img/hdd-1.webp', warranty: '۲۴ ماه گارانتی', rating: 4.5, sold: 33, tags: [],
      desc: 'حافظه جانبی قابل حمل با رابط USB-C و پشتیبانی از ویندوز و مک؛ مناسب بکاپ.',
      specs: { type: 'هارد اکسترنال', capacity: '2TB', interface: 'USB 3.2 Type-C', readSpeed: '120MB/s', formFactor: '۲.۵ اینچ' },
      features: ['قابل حمل', 'USB-C', 'نرم‌افزار بکاپ', 'سازگار با ویندوز و مک'] }),

    /* ---------------- خنک‌کننده ---------------- */
    p({ id: 'cool-ak620', name: 'خنک‌کننده هوایی دیپ‌کول AK620 — دوفن', brand: 'DeepCool', cat: 'cooler', price: 4250000, stock: 12, img: 'img/cooler-2.webp', warranty: '۲۴ ماه گارانتی', rating: 4.8, sold: 40, tags: ['پیشنهاد ما'],
      desc: 'کولر هوایی دوبرجی با ۶ هیت‌پایپ و دو فن ۱۲۰ میلی‌متری؛ توان خنک‌سازی تا ۲۶۰ وات و سازگار با سوکت‌های اینتل و AMD.',
      specs: { type: 'هوایی', sockets: ['LGA1700', 'LGA1200', 'AM4', 'AM5'], tdp: 260, height: 160, fans: '2×120mm', rgb: 'ندارد' },
      features: ['توان خنک‌سازی ۲۶۰ وات', '۶ هیت‌پایپ مسی', 'دو فن ۱۲۰ میلی‌متری', 'سازگار با AM4/AM5/LGA1700'] }),

    p({ id: 'cool-ml240', name: 'خنک‌کننده مایع کولرمستر ML240L ARGB', brand: 'Cooler Master', cat: 'cooler', price: 6150000, oldPrice: 6700000, stock: 8, img: 'img/aio-1.webp', warranty: '۲۴ ماه گارانتی', rating: 4.5, sold: 29, tags: [],
      desc: 'واترکولر ۲۴۰ میلی‌متری با پمپ کم‌صدا و دو فن ARGB؛ مناسب پردازنده‌های تا ۲۰۰ وات.',
      specs: { type: 'مایع (AIO)', sockets: ['LGA1700', 'LGA1200', 'AM4', 'AM5'], tdp: 200, radiator: '240mm', fans: '2×120mm ARGB', rgb: 'دارد' },
      features: ['رادیاتور ۲۴۰ میلی‌متری', 'نورپردازی ARGB', 'پمپ کم‌صدا', 'نصب آسان'] }),

    p({ id: 'cool-nhd15', name: 'خنک‌کننده هوایی ناکتوا NH-D15 — بی‌صدا', brand: 'Noctua', cat: 'cooler', price: 9800000, stock: 4, img: 'img/cooler-4.webp', warranty: '۷۲ ماه گارانتی', rating: 4.9, sold: 14, tags: ['حرفه‌ای'],
      desc: 'افسانه خنک‌کننده‌های هوایی؛ دوبرجی با دو فن NF-A15 و توان ۲۵۰ وات. ارتفاع ۱۶۵ میلی‌متری، نیازمند کیس عریض.',
      specs: { type: 'هوایی', sockets: ['LGA1700', 'LGA1200', 'AM4', 'AM5'], tdp: 250, height: 165, fans: '2×140mm', rgb: 'ندارد' },
      features: ['دو فن ۱۴۰ میلی‌متری', 'بسیار کم‌صدا', '۶ سال گارانتی', 'توان ۲۵۰ وات'] }),

    p({ id: 'cool-galahad360', name: 'خنک‌کننده مایع لیان‌لی Galahad II 360 ARGB', brand: 'Lian Li', cat: 'cooler', price: 12900000, stock: 3, img: 'img/aio-2.webp', warranty: '۳۶ ماه گارانتی', rating: 4.8, sold: 11, tags: ['حرفه‌ای'],
      desc: 'واترکولر ۳۶۰ میلی‌متری با نمایشگر دما و سه فن ARGB؛ برای Core i9 و Ryzen 9 پیشنهاد می‌شود.',
      specs: { type: 'مایع (AIO)', sockets: ['LGA1700', 'AM5', 'AM4'], tdp: 320, radiator: '360mm', fans: '3×120mm ARGB', rgb: 'دارد' },
      features: ['رادیاتور ۳۶۰', 'نمایشگر دمای CPU', 'سه فن ARGB', 'توان ۳۲۰ وات'] }),

    p({ id: 'cool-stock', name: 'خنک‌کننده استوک اینتل LGA1700', brand: 'Intel', cat: 'cooler', price: 850000, stock: 40, img: 'img/cooler-1.webp', warranty: '۱۲ ماه گارانتی', rating: 3.9, sold: 57, tags: ['اقتصادی'],
      desc: 'کولر استوک اصلی اینتل برای پردازنده‌های ۶۵ واتی؛ گزینه ارزان برای سیستم‌های اداری.',
      specs: { type: 'هوایی', sockets: ['LGA1700', 'LGA1200'], tdp: 65, height: 47, fans: '1×80mm', rgb: 'ندارد' },
      features: ['مناسب پردازنده‌های ۶۵ وات', 'نصب آسان', 'کم‌حجم', 'قیمت اقتصادی'] }),

    /* ---------------- کیس ---------------- */
    p({ id: 'case-green-x3', name: 'کیس گرین X3 با درب شیشه‌ای', brand: 'Green', cat: 'case', price: 3950000, stock: 14, img: 'img/case-1.webp', warranty: '۱۲ ماه گارانتی', rating: 4.3, sold: 38, tags: ['اقتصادی'],
      desc: 'کیس میدتاور با پنل شیشه‌ای، سه فن ARGB و پشتیبانی از مادربرد ATX و کارت گرافیک تا ۳۳۰ میلی‌متر.',
      specs: { formFactors: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxVga: 330, maxCooler: 160, fans: '3×120mm ARGB', glass: 'دارد', psuSupport: 'ATX' },
      features: ['پنل شیشه‌ای', '۳ فن ARGB همراه', 'پشتیبانی ATX', 'جریان هوای مناسب'] }),

    p({ id: 'case-cm-masterbox', name: 'کیس کولرمستر MasterBox TD500 Mesh', brand: 'Cooler Master', cat: 'case', price: 5450000, oldPrice: 5900000, stock: 9, img: 'img/case-2.webp', warranty: '۲۴ ماه گارانتی', rating: 4.6, sold: 27, tags: [],
      desc: 'کیس مشبک با سه فن ARGB و جریان هوای بالا؛ مناسب سیستم‌های گیمینگ میان‌رده.',
      specs: { formFactors: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxVga: 410, maxCooler: 165, fans: '3×120mm ARGB', glass: 'دارد', psuSupport: 'ATX' },
      features: ['پنل مشبک پرجریان', '۳ فن ARGB', 'پشتیبانی کارت گرافیک ۴۱۰ میلی‌متر', 'فیلتر گرد و غبار'] }),

    p({ id: 'case-hyte-y60', name: 'کیس هایت Y60 با پنل شیشه‌ای پانوراما', brand: 'HYTE', cat: 'case', price: 9750000, stock: 5, img: 'img/case-3.webp', warranty: '۲۴ ماه گارانتی', rating: 4.8, sold: 16, tags: ['پیشنهاد ما'],
      desc: 'کیس پانوراما با طراحی زیگنار؛ نمایش کامل قطعات و پشتیبانی از کارت گرافیک عمودی و رادیاتور ۳۶۰.',
      specs: { formFactors: ['ATX', 'Micro-ATX'], maxVga: 375, maxCooler: 165, fans: 'بدون فن', glass: 'دارد', psuSupport: 'ATX' },
      features: ['شیشه پانوراما', 'نمایش کامل قطعات', 'پشتیبانی رادیاتور ۳۶۰', 'طراحی خاص و مدرن'] }),

    p({ id: 'case-tuf-gt301', name: 'کیس ایسوس TUF Gaming GT301', brand: 'ASUS', cat: 'case', price: 8900000, stock: 6, img: 'img/case-1.webp', warranty: '۲۴ ماه گارانتی', rating: 4.5, sold: 19, tags: [],
      desc: 'کیس گیمینگ با سه فن ARGB، نگهدارنده هدفون و پشتیبانی از کارت گرافیک ۳۲۰ میلی‌متری.',
      specs: { formFactors: ['ATX', 'Micro-ATX', 'Mini-ITX'], maxVga: 320, maxCooler: 160, fans: '3×120mm ARGB', glass: 'دارد', psuSupport: 'ATX' },
      features: ['سه فن ARGB', 'طراحی TUF', 'فیلتر گرد و غبار', 'کابل‌کشی تمیز'] }),

    /* ---------------- پاور ---------------- */
    p({ id: 'psu-green-650', name: 'منبع تغذیه گرین GP650B-EUD 650W', brand: 'Green', cat: 'psu', price: 3450000, stock: 18, img: 'img/psu-1.webp', warranty: '۲۴ ماه گارانتی', rating: 4.2, sold: 47, tags: ['اقتصادی'],
      desc: 'پاور ۶۵۰ وات با استاندارد 80Plus Bronze و محافظت‌های کامل؛ مناسب سیستم‌های میان‌رده.',
      specs: { wattage: 650, efficiency: '80Plus Bronze', modular: 'نیمه ماژولار', fan: '120mm', pcie8pin: 2, atxVersion: 'ATX 2.4' },
      features: ['۶۵۰ وات واقعی', 'استاندارد Bronze', 'فن ۱۲ سانتی', 'محافظت OVP/OPP/SCP'] }),

    p({ id: 'psu-cm-750', name: 'منبع تغذیه کولرمستر MWE 750 Gold V2', brand: 'Cooler Master', cat: 'psu', price: 5850000, oldPrice: 6400000, stock: 11, img: 'img/psu-2.webp', warranty: '۶۰ ماه گارانتی', rating: 4.6, sold: 31, tags: ['پیشنهاد ما'],
      desc: 'پاور ۷۵۰ وات طلایی با خازن‌های ژاپنی و حالت بدون فن در بار کم؛ مناسب کارت گرافیک تا RTX 4070.',
      specs: { wattage: 750, efficiency: '80Plus Gold', modular: 'تمام ماژولار', fan: '140mm', pcie8pin: 2, atxVersion: 'ATX 3.0' },
      features: ['استاندارد Gold', 'تمام ماژولار', 'ATX 3.0', '۵ سال گارانتی'] }),

    p({ id: 'psu-corsair-850', name: 'منبع تغذیه کورسیر RM850e 850W Gold', brand: 'Corsair', cat: 'psu', price: 12400000, stock: 4, img: 'img/psu-2.webp', warranty: '۹۶ ماه گارانتی', rating: 4.9, sold: 12, tags: ['حرفه‌ای'],
      desc: 'پاور ۸۵۰ وات Gold ATX 3.1 با کابل 12V-2×6؛ آماده برای کارت‌های گرافیک نسل جدید.',
      specs: { wattage: 850, efficiency: '80Plus Gold', modular: 'تمام ماژولار', fan: '140mm', pcie8pin: 4, atxVersion: 'ATX 3.1' },
      features: ['۸۵۰ وات واقعی', 'کابل 12V-2×6', 'حالت Zero RPM', '۸ سال گارانتی'] }),

    p({ id: 'psu-green-450', name: 'منبع تغذیه گرین GP450A-EUD 450W', brand: 'Green', cat: 'psu', price: 1950000, stock: 25, img: 'img/psu-1.webp', warranty: '۱۸ ماه گارانتی', rating: 4.0, sold: 63, tags: ['اقتصادی'],
      desc: 'پاور ۴۵۰ وات مناسب سیستم‌های اداری و بدون کارت گرافیک مستقل.',
      specs: { wattage: 450, efficiency: '80Plus 230V EU', modular: 'غیر ماژولار', fan: '120mm', pcie8pin: 1, atxVersion: 'ATX 2.4' },
      features: ['۴۵۰ وات', 'کم‌مصرف', 'مناسب اداری', 'قیمت اقتصادی'] }),

    /* ---------------- قطعات تزئینی ---------------- */
    p({ id: 'deco-fan-kit-3', name: 'پک ۳ عددی فن ARGB NZXT F120 RGB', brand: 'NZXT', cat: 'deco', price: 3250000, oldPrice: 3600000, stock: 12, img: 'img/fan-1.webp', warranty: '۲۴ ماه گارانتی', rating: 4.7, sold: 35, tags: ['پرفروش'],
      desc: 'سه فن ۱۲۰ میلی‌متری RGB با کنترلر و قابلیت همگام‌سازی با مادربرد؛ جریان هوای بالا و صدای کم.',
      specs: { type: 'فن ۱۲۰ میلی‌متری', size: '120mm', rgb: 'ARGB', controller: 'دارد', airflow: '50 CFM', noise: '22 dBA' },
      features: ['پک ۳ عددی', 'کنترلر ARGB همراه', 'قابل نصب روی رادیاتور', 'صدای بسیار کم'] }),

    p({ id: 'deco-led-strip', name: 'نوار نورپردازی ARGB مغناطیسی ۵۰ سانتی', brand: 'DeepCool', cat: 'deco', price: 690000, stock: 30, img: 'img/fan-2.webp', warranty: '۱۲ ماه گارانتی', rating: 4.2, sold: 58, tags: ['اقتصادی'],
      desc: 'نوار LED آدرس‌پذیر با چسب مغناطیسی و اتصال ۳ پین ARGB؛ هماهنگ با نرم‌افزار مادربرد.',
      specs: { type: 'نوار LED', size: '50cm', rgb: 'ARGB 5V', controller: 'ندارد (اتصال به مادربرد)', power: '5V 3-pin' },
      features: ['نصب مغناطیسی', 'ARGB پنج ولت', 'قابل برش', 'همگام با مادربرد'] }),

    p({ id: 'deco-gpu-holder', name: 'پایه نگهدارنده کارت گرافیک RGB', brand: 'Cooler Master', cat: 'deco', price: 890000, stock: 16, img: 'img/fan-1.webp', warranty: '۶ ماه گارانتی', rating: 4.1, sold: 22, tags: [],
      desc: 'پایه آلومینیومی با نور RGB برای جلوگیری از خم شدن کارت گرافیک‌های سنگین.',
      specs: { type: 'پایه گرافیک', size: 'قابل تنظیم ۷۰-۱۲۰ میلی‌متر', rgb: 'RGB', material: 'آلومینیوم' },
      features: ['ارتفاع قابل تنظیم', 'نور RGB', 'بدنه آلومینیومی', 'نصب ساده'] }),

    p({ id: 'deco-aio-extension', name: 'کابل توسعه ARGB سه‌راهی', brand: 'DeepCool', cat: 'deco', price: 290000, stock: 40, img: 'img/fan-2.webp', warranty: '۶ ماه گارانتی', rating: 4.0, sold: 41, tags: ['اقتصادی'],
      desc: 'کابل تقسیم‌کننده ARGB سه‌راهی برای اتصال چند فن و نوار نور به یک هدر مادربرد.',
      specs: { type: 'کابل ARGB', size: '30cm', rgb: 'ARGB 5V', controller: 'ندارد' },
      features: ['سه خروجی', 'سازگار با هدر ۳ پین ۵ ولت', 'طول ۳۰ سانتی', 'قیمت مناسب'] }),

    /* ---------------- تجهیزات جانبی ---------------- */
    p({ id: 'per-kb-mech', name: 'کیبورد مکانیکال گیمینگ RGB با سوییچ قرمز', brand: 'Logitech', cat: 'periph', price: 3450000, oldPrice: 3800000, stock: 15, img: 'img/kb-1.webp', warranty: '۱۸ ماه گارانتی', rating: 4.6, sold: 49, tags: ['پرفروش'],
      desc: 'کیبورد مکانیکال با بدنه فلزی، نورپردازی RGB و سوییچ‌های قرمز خطی؛ مناسب گیمینگ و تایپ.',
      specs: { type: 'کیبورد مکانیکال', connection: 'USB-C', layout: 'TKL', switch: 'Red Linear', rgb: 'دارد', antiGhosting: 'دارد' },
      features: ['سوییچ قرمز خطی', 'بدنه فلزی', 'RGB قابل تنظیم', 'کابل جدا شدنی'] }),

    p({ id: 'per-mouse-gaming', name: 'ماوس گیمینگ بی‌سیم ۱۶۰۰۰ DPI', brand: 'Logitech', cat: 'periph', price: 2650000, stock: 20, img: 'img/kb-2.webp', warranty: '۱۸ ماه گارانتی', rating: 4.5, sold: 66, tags: [],
      desc: 'ماوس بی‌سیم سبک با سنسور ۱۶۰۰۰ DPI و باتری ۷۰ ساعته.',
      specs: { type: 'ماوس', connection: 'بی‌سیم 2.4G', dpi: '16000', buttons: 6, battery: '70 ساعت', weight: '74 گرم' },
      features: ['سنسور ۱۶۰۰۰ DPI', 'وزن ۷۴ گرم', 'باتری ۷۰ ساعته', 'پایه‌های تفلونی'] }),

    p({ id: 'per-headset-7.1', name: 'هدست گیمینگ ۷.۱ کانال با میکروفن', brand: 'Logitech', cat: 'periph', price: 4150000, oldPrice: 4650000, stock: 11, img: 'img/headset-2.webp', warranty: '۲۴ ماه گارانتی', rating: 4.4, sold: 37, tags: [],
      desc: 'هدست سربازگشتی با صدای ۷.۱ مجازی، میکروفن نویزگیر و بالشتک مموری‌فوم.',
      specs: { type: 'هدست', connection: 'USB / 3.5mm', sound: '7.1 Surround', mic: 'نویزگیر', impedance: '32 اهم', weight: '290 گرم' },
      features: ['صدای ۷.۱ مجازی', 'میکروفن جداشدنی', 'مموری‌فوم', 'سازگار با PC و کنسول'] }),

    p({ id: 'per-headset-bt', name: 'هدست بی‌سیم بلوتوث با کم‌ترین تأخیر', brand: 'Logitech', cat: 'periph', price: 6350000, stock: 6, img: 'img/headset-1.webp', warranty: '۲۴ ماه گارانتی', rating: 4.7, sold: 14, tags: ['پیشنهاد ما'],
      desc: 'هدست بی‌سیم با اتصال دوگانه بلوتوث و دانگل، باتری ۴۰ ساعته و درایور ۴۰ میلی‌متری.',
      specs: { type: 'هدست', connection: 'بلوتوث + دانگل', sound: 'Stereo', mic: 'دارد', battery: '۴۰ ساعت', weight: '265 گرم' },
      features: ['اتصال دوگانه', 'باتری ۴۰ ساعته', 'درایور ۴۰ میلی‌متری', 'سبک و راحت'] }),

    p({ id: 'per-monitor-27-144', name: 'مانیتور گیمینگ ۲۷ اینچ QHD ۱۸۰Hz', brand: 'ASUS', cat: 'periph', price: 17900000, oldPrice: 19500000, stock: 7, img: 'img/monitor-2.webp', warranty: '۳۶ ماه گارانتی', rating: 4.8, sold: 23, tags: ['پرفروش'],
      desc: 'مانیتور ۲۷ اینچ IPS با رزولوشن ۲۵۶۰×۱۴۴۰، نرخ نوسازی ۱۸۰ هرتز و پوشش ۱۰۰٪ sRGB.',
      specs: { type: 'مانیتور', size: '27 اینچ', resolution: '2560×1440', refresh: '180Hz', panel: 'IPS', response: '1ms GTG', ports: 'DP + 2×HDMI' },
      features: ['QHD ۱۸۰ هرتز', 'پنل IPS', 'FreeSync Premium', 'پایه قابل تنظیم'] }),

    p({ id: 'per-monitor-24-165', name: 'مانیتور گیمینگ ۲۴ اینچ Full HD ۱۶۵Hz', brand: 'MSI', cat: 'periph', price: 8950000, stock: 9, img: 'img/monitor-1.webp', warranty: '۲۴ ماه گارانتی', rating: 4.4, sold: 42, tags: ['اقتصادی'],
      desc: 'مانیتور ۲۴ اینچ با نرخ ۱۶۵ هرتز و زمان پاسخ ۱ میلی‌ثانیه؛ انتخاب اقتصادی گیمینگ.',
      specs: { type: 'مانیتور', size: '24 اینچ', resolution: '1920×1080', refresh: '165Hz', panel: 'IPS', response: '1ms MPRT', ports: 'DP + HDMI' },
      features: ['۱۶۵ هرتز', '۱ میلی‌ثانیه', 'پنل IPS', 'قیمت اقتصادی'] }),

    p({ id: 'per-mousepad-xl', name: 'ماوس‌پد گیمینگ XL با لبه دوخت', brand: 'Corsair', cat: 'periph', price: 690000, stock: 33, img: 'img/kb-2.webp', warranty: '۶ ماه گارانتی', rating: 4.3, sold: 51, tags: ['اقتصادی'],
      desc: 'ماوس‌پد بزرگ ۹۰×۴۰ سانتی با سطح میکرو-تکسچر و زیره ضدلغزش.',
      specs: { type: 'ماوس‌پد', size: '900×400mm', thickness: '4mm', surface: 'میکرو-تکسچر', edge: 'دوخت‌شده' },
      features: ['ابعاد XL', 'لبه دوخت‌شده', 'زیره ضدلغزش', 'قابل شست‌وشو'] }),

    /* ---------------- تجهیزات شبکه ---------------- */
    p({ id: 'net-router-ax23', name: 'روتر بی‌سیم TP-Link Archer AX23 Wi-Fi 6', brand: 'TP-Link', cat: 'network', price: 2950000, oldPrice: 3300000, stock: 14, img: 'img/router-1.webp', warranty: '۳۶ ماه گارانتی', rating: 4.6, sold: 58, tags: ['پرفروش'],
      desc: 'روتر دو باند Wi-Fi 6 با سرعت کل ۱۸۰۰ مگابیت و ۴ آنتن؛ مناسب خانه و دفتر کوچک.',
      specs: { type: 'روتر', speed: '1800Mbps', bands: 'دوباند', ports: '4×LAN + 1×WAN', standard: 'Wi-Fi 6 (802.11ax)', antennas: 4 },
      features: ['Wi-Fi 6 دوباند', '۴ پورت گیگابیت', 'کنترل والدین', 'نصب آسان با اپلیکیشن'] }),

    p({ id: 'net-router-ax55', name: 'روتر TP-Link Archer AX55 Wi-Fi 6 AX3000', brand: 'TP-Link', cat: 'network', price: 5450000, stock: 6, img: 'img/router-2.webp', warranty: '۳۶ ماه گارانتی', rating: 4.7, sold: 21, tags: ['پیشنهاد ما'],
      desc: 'روتر AX3000 با پردازنده دو هسته‌ای و پشتیبانی از OneMesh برای پوشش کامل منزل.',
      specs: { type: 'روتر', speed: '3000Mbps', bands: 'دوباند', ports: '4×LAN + 1×WAN', standard: 'Wi-Fi 6 (802.11ax)', antennas: 4 },
      features: ['سرعت ۳۰۰۰ مگابیت', 'OneMesh', 'پردازنده دو هسته‌ای', 'VPN Server'] }),

    p({ id: 'net-switch-8', name: 'سوییچ ۸ پورت گیگابیت دسکتاپی', brand: 'TP-Link', cat: 'network', price: 1850000, stock: 17, img: 'img/switch-1.webp', warranty: '۳۶ ماه گارانتی', rating: 4.5, sold: 44, tags: [],
      desc: 'سوییچ ۸ پورت ۱۰/۱۰۰/۱۰۰۰ با بدنه فلزی و طراحی بدون فن؛ مناسب شبکه‌های کوچک.',
      specs: { type: 'سوییچ', ports: '8×Gigabit', speed: '1000Mbps', managed: 'غیر مدیریتی', case: 'فلزی', fan: 'بدون فن' },
      features: ['۸ پورت گیگابیت', 'بدنه فلزی', 'بدون فن و بی‌صدا', 'نصب Plug & Play'] }),

    p({ id: 'net-extender', name: 'ریپیتر و اکستندر وای‌فای TP-Link RE200', brand: 'TP-Link', cat: 'network', price: 1250000, stock: 22, img: 'img/router-1.webp', warranty: '۲۴ ماه گارانتی', rating: 4.1, sold: 39, tags: ['اقتصادی'],
      desc: 'اکستندر دیواری دوباند AC750 برای افزایش پوشش وای‌فای در نقاط کور خانه.',
      specs: { type: 'اکستندر', speed: '750Mbps', bands: 'دوباند', standard: 'Wi-Fi 5 (802.11ac)', antennas: 2 },
      features: ['افزایش پوشش وای‌فای', 'نصب با یک دکمه', 'پورت اترنت', 'چراغ نشانگر سیگنال'] }),

    p({ id: 'net-cable-cat6', name: 'کابل شبکه CAT6 شیلددار — ۲۰ متر', brand: 'TP-Link', cat: 'network', price: 590000, stock: 45, img: 'img/switch-1.webp', warranty: '۱۲ ماه گارانتی', rating: 4.2, sold: 62, tags: ['اقتصادی'],
      desc: 'کابل CAT6 با کانکتور RJ45 آماده، مناسب اتصال پایدار تا ۱ گیگابیت.',
      specs: { type: 'کابل شبکه', category: 'CAT6', length: '۲۰ متر', connector: 'RJ45', shielding: 'دارد' },
      features: ['طول ۲۰ متر', 'کانکتور RJ45 نصب‌شده', 'شیلددار', 'انتقال تا ۱ گیگابیت'] }),

    p({ id: 'net-poe-injector', name: 'اینژکتور PoE تک‌پورت ۴۸ ولت', brand: 'TP-Link', cat: 'network', price: 890000, stock: 12, img: 'img/router-2.webp', warranty: '۱۸ ماه گارانتی', rating: 4.0, sold: 18, tags: [],
      desc: 'تأمین برق دوربین و اکسس‌پوینت از طریق کابل شبکه، بدون نیاز به آداپتور محلی.',
      specs: { type: 'اینژکتور PoE', ports: '1×PoE + 1×LAN', power: '48V / 0.5A', standard: '802.3af', speed: 'Gigabit' },
      features: ['استاندارد 802.3af', 'سرعت گیگابیت', 'نصب ساده', 'محافظ اضافه‌جریان'] })
  ];

  const slides = [
    { id: 's1', badge: 'سیستم اسمبل‌شده آماده ارسال', title: 'سیستم گیمینگ رؤیایی‌ات را <em>همین امروز</em> ببند', text: 'با اسمبل هوشمند ولتا قطعات سازگار را انتخاب کن، قیمت نهایی را همان لحظه ببین و بدون نگرانی از ناسازگاری سفارش بده.', cta: 'شروع اسمبل هوشمند', link: 'build.html', img: 'img/hero-1.webp', stat1: '+۱۲۰۰', stat1t: 'سیستم اسمبل‌شده', stat2: '۲۴ ماه', stat2t: 'گارانتی قطعات' },
    { id: 's2', badge: 'تخفیف ویژه هفته', title: 'کارت گرافیک و پردازنده با <em>تخفیف‌های داغ</em>', text: 'منتخب کارت‌های گرافیک و پردازنده‌های نسل جدید با قیمت مستقیم و گارانتی معتبر شرکتی؛ تا پایان موجودی.', cta: 'مشاهده تخفیف‌ها', link: 'shop.html?deal=1', img: 'img/hero-2.webp', stat1: 'تا ۲۵٪', stat1t: 'تخفیف نقدی', stat2: '+۳۱', stat2t: 'استان تحت پوشش' },
    { id: 's3', badge: 'تجهیزات شبکه و جانبی', title: 'شبکه خانه و دفترت را <em>حرفه‌ای</em> بچین', text: 'روتر، سوییچ، اکستندر و کابل شبکه از برندهای معتبر با مشاوره فنی رایگان پیش از خرید.', cta: 'ورود به تجهیزات شبکه', link: 'shop.html?cat=network', img: 'img/hero-3.webp', stat1: 'ارسال سریع', stat1t: 'تهران و شهرستان', stat2: 'پشتیبانی', stat2t: '۷ روز هفته' }
  ];

  const settings = {
    siteName: 'ولتا',
    siteLatin: 'VOLTA',
    tagline: 'فروشگاه تخصصی سخت‌افزار',
    phone: '۰۳۵-۴۴۵۵۶۶۷۷',
    mobile: '۰۹۱۲۳۴۵۶۷۸۹',
    email: 'info@volta-pc.ir',
    address: 'تهران، خیابان ولیعصر، بالاتر از پارک ساعی، پلاک ۱۲۴۰، طبقهٔ دوم',
    hours: 'شنبه تا پنجشنبه، ۱۰ تا ۱۹',
    instagram: 'https://instagram.com/volta.pc',
    telegram: 'https://t.me/volta_pc',
    whatsapp: '',
    about: 'ولتا از سال ۱۳۹۲ با یک میز کار و چند پیچ‌گوشتی شروع شد؛ امروز کارگاه اسمبل، آزمایشگاه تست ۷۲ ساعته و تیمی ۱۸ نفره داریم. قطعهٔ اصل با گارانتی شرکتی، قیمت شفاف و مشاوره‌ای که به نفع سیستم شماست — نه به نفع فاکتور.',
    freeShipThreshold: 3000000,
    shipCost: 120000,
    cardNumber: '۵۸۹۴-۶۳۱۲-۲۲۰۶-۶۶۰۷',
    cardOwner: 'محمد دیوان خسروشاهی',
    bankName: 'بانک توسعه صادرات',
    dealEndsAt: '',
    announcement: 'ارسال رایگان سفارش‌های بالای ۳ میلیون تومان — ۷ روز ضمانت تست و بازگشت کالا',
    heroImage: 'img/hero-1.webp'
  };

  return { cats, brands, products, slides, settings, version: '1.0.0' };
})();
