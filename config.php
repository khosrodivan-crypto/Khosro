<?php
/**
 * تنظیمات امنیتی مشترک سایت ولتا (نسخه امن و استاندارد)
 * این فایل سمت سرور اجرا می‌شود و هرگز به مرورگر فرستاده نمی‌شود.
 */

// ── کلید مشترک داخلی نوشتن/آپلود ──
define('AHT_SHARED_SECRET', 'c2fb81fa5ea2bb86a83251867cdb58c94064e0fefaa5cf0e');

// ── اطلاعات ورود مدیر ──
define('AHT_ADMIN_PHONE', '09915726881');
define('AHT_ADMIN_PASS_SHA256', '43af23c562e4ec8a6ed28f1a6200ce4282f72a702388b4c0861213988bb24d0b');
define('AHT_ADMIN_PASS_BCRYPT', '$2y$12$VzLrXA0d2GyYsC1kipGNP.GbaHl9rO.um/mWE/7X7FX/hCLX5OSCq');

// ── کلیدهایی که محتوای سایت یا اطلاعات حساس هستند و فقط مدیر لاگین‌شده حق نوشتن مستقیم روی آنها را دارد ──
$GLOBALS['AHT_ADMIN_ONLY_WRITE_KEYS'] = [
    'aht_parts', 'aht_cats', 'aht_slides', 'aht_settings',
    'aht_products', 'aht_hero', 'aht_about', 'aht_contact',
    'aht_banner', 'aht_gallery', 'aht_slider_v2', 'aht_site_font',
    'aht_messages', 'bh_home', 'aht_users', 'aht_orders'
];

// ── کلیدهایی که اطلاعات خصوصی هستند و فقط مدیر لاگین‌شده حق خواندن مستقیم آنها را دارد ──
$GLOBALS['AHT_PRIVATE_READ_KEYS'] = [
    'aht_users', 'aht_orders', 'aht_contact_messages', 'aht_support'
];

/**
 * بررسی اعتبار توکن مدیریت
 */
function aht_token_is_admin($token) {
    $token = (string)$token;
    if ($token === '') return false;
    $file = __DIR__ . '/data/.admin_tokens.json';
    if (!file_exists($file)) return false;
    $tokens = json_decode(@file_get_contents($file), true);
    if (!is_array($tokens) || !isset($tokens[$token])) return false;
    return $tokens[$token] >= time();
}

// ── تنظیمات درگاه زرین‌پال ──
// زمان اتصال نهایی درگاه: مرچنت کد ۳۶ رقمی خود را اینجا بگذارید و AHT_ZARINPAL_SANDBOX را false کنید
define('AHT_ZARINPAL_MERCHANT_ID', 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
define('AHT_ZARINPAL_SANDBOX', true);

/**
 * ثبت یا به‌روزرسانی امن سفارش در data/aht_orders.json سمت سرور با قفل فایل
 */
function aht_append_order(array $order) {
    $dir = __DIR__ . '/data/';
    if (!is_dir($dir)) { @mkdir($dir, 0755, true); }
    $path = $dir . 'aht_orders.json';
    $orders = [];
    if (file_exists($path)) {
        $raw = @file_get_contents($path);
        $decoded = $raw !== false ? json_decode($raw, true) : null;
        if (is_array($decoded)) $orders = $decoded;
    }
    $targetCode = (string)($order['code'] ?? ($order['order_id'] ?? ''));
    $found = false;
    if ($targetCode !== '') {
        foreach ($orders as $k => $o) {
            $existingCode = (string)($o['code'] ?? ($o['order_id'] ?? ''));
            if ($existingCode === $targetCode) {
                $orders[$k] = array_merge($o, $order);
                $found = true;
                break;
            }
        }
    }
    if (!$found) {
        $orders[] = $order;
    }
    @file_put_contents($path, json_encode($orders, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);
    return true;
}
