<?php
/**
 * ذخیره و بازیابی داده امن برای سایت ولتا
 */

require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$DATA_DIR = __DIR__ . '/data/';
if (!is_dir($DATA_DIR)) {
    if (!mkdir($DATA_DIR, 0755, true) && !is_dir($DATA_DIR)) {
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => 'ساخت پوشه data روی سرور ناموفق بود']);
        exit;
    }
}

// مسدودسازی دائمی دسترسی وب به پوشه data
@file_put_contents($DATA_DIR . '.htaccess',
    "Order deny,allow\nDeny from all\n<IfModule mod_authz_core.c>\nRequire all denied\n</IfModule>\nOptions -Indexes\nphp_flag engine off\n");

if (!function_exists('aht_cut')) {
    // برش امن رشته بدون وابستگی اجباری به افزونه mbstring
    function aht_cut($str, $len) {
        $str = (string)$str;
        if (function_exists('mb_substr')) return mb_substr($str, 0, $len, 'UTF-8');
        if (function_exists('iconv_substr')) return (string)iconv_substr($str, 0, $len, 'UTF-8');
        return substr($str, 0, $len);
    }
}

function safeKeyToPath($dir, $key){
    $clean = preg_replace('/[^a-zA-Z0-9_\-]/', '_', (string)$key);
    if ($clean === '') return null;
    return $dir . $clean . '.json';
}

$method = $_SERVER['REQUEST_METHOD'];

// ══════════════════════════════════════════
// عملیات خواندن (GET)
// ══════════════════════════════════════════
if ($method === 'GET') {
    $key = $_GET['key'] ?? '';
    $path = safeKeyToPath($DATA_DIR, $key);
    if (!$path) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'کلید نامعتبر است']);
        exit;
    }

    $isPrivateKey = in_array($key, $GLOBALS['AHT_PRIVATE_READ_KEYS'], true);
    $token = $_GET['admin_token'] ?? ($_GET['token'] ?? '');
    if ($isPrivateKey && !aht_token_is_admin($token)) {
        http_response_code(403);
        echo json_encode(['ok' => false, 'error' => 'دسترسی غیرمجاز — این بخش فقط برای مدیر سایت قابل مشاهده است']);
        exit;
    }

    // ★ همهٔ خواندن‌ها تازه باشند: مدیر بعد از ذخیره باید بلافاصله نسخهٔ جدید را ببیند
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    header('Pragma: no-cache');
    header('Expires: 0');

    if (!file_exists($path)) {
        echo json_encode(['ok' => true, 'value' => null]);
        exit;
    }
    $raw = @file_get_contents($path);
    $value = $raw !== false ? json_decode($raw, true) : null;
    $mtime = @filemtime($path);
    echo json_encode(['ok' => true, 'value' => $value, 'mtime' => $mtime ? (int)$mtime : 0]);
    exit;
}

// ══════════════════════════════════════════
// عملیات نوشتن (POST)
// ══════════════════════════════════════════
if ($method === 'POST') {
    $action = $_POST['action'] ?? '';
    $key    = $_POST['key'] ?? '';

    // ۰. خواندن داده با POST — POST هیچ‌گاه توسط مرورگر، پراکسی یا کش سرور (LiteSpeed/nginx) کش نمی‌شود
    if ($action === 'get') {
        $path = safeKeyToPath($DATA_DIR, $key);
        if (!$path) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'error' => 'کلید نامعتبر است']);
            exit;
        }
        $isPrivateKey = in_array($key, $GLOBALS['AHT_PRIVATE_READ_KEYS'], true);
        $token = $_POST['admin_token'] ?? ($_POST['token'] ?? '');
        if ($isPrivateKey && !aht_token_is_admin($token)) {
            http_response_code(403);
            echo json_encode(['ok' => false, 'error' => 'دسترسی غیرمجاز — این بخش فقط برای مدیر سایت قابل مشاهده است']);
            exit;
        }
        header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
        header('Pragma: no-cache');
        header('Expires: 0');
        if (!file_exists($path)) {
            echo json_encode(['ok' => true, 'value' => null, 'mtime' => 0]);
            exit;
        }
        $raw = @file_get_contents($path);
        $value = $raw !== false ? json_decode($raw, true) : null;
        $mtime = @filemtime($path);
        echo json_encode(['ok' => true, 'value' => $value, 'mtime' => $mtime ? (int)$mtime : 0]);
        exit;
    }

    // POST با action ناشناخته = خطا (جلوگیری از نوشتن مقدار null با یک action اشتباه)
    if ($action !== '' && $action !== 'append_order' && $action !== 'append_review' && $action !== 'track_order'
        && $key !== 'aht_orders_append' && $key !== 'aht_reviews_append') {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'action نامعتبر است']);
        exit;
    }

    // ۱. ثبت امن سفارش مشتری (Append Order) بدون نیاز به توکن مدیریت
    if ($action === 'append_order' || $key === 'aht_orders_append') {
        $rawOrder = $_POST['order'] ?? ($_POST['value'] ?? '');
        $orderData = is_array($rawOrder) ? $rawOrder : json_decode($rawOrder, true);
        if (!is_array($orderData)) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'error' => 'اطلاعات سفارش نامعتبر است']);
            exit;
        }

        // پاکسازی فیلدهای متنی جهت جلوگیری از XSS
        $orderCode = (string)($orderData['code'] ?? ($orderData['id'] ?? ('AHT-' . time())));
        $orderCode = preg_replace('/[^a-zA-Z0-9_\-]/', '', $orderCode);
        $nameParts = explode(' ', trim((string)($orderData['name'] ?? '')), 2);
        $sanitizedOrder = [
            'code'        => $orderCode,
            'fname'       => strip_tags(trim((string)($orderData['fname'] ?? ($nameParts[0] ?? '')))),
            'lname'       => strip_tags(trim((string)($orderData['lname'] ?? ($nameParts[1] ?? '')))),
            'phone'       => preg_replace('/[^0-9]/', '', (string)($orderData['phone'] ?? '')),
            'city'        => strip_tags(trim((string)($orderData['city'] ?? ''))),
            'province'    => strip_tags(trim((string)($orderData['province'] ?? ''))),
            'address'     => strip_tags(trim((string)($orderData['address'] ?? ''))),
            'postal'      => preg_replace('/[^0-9]/', '', (string)($orderData['postal'] ?? '')),
            'items'       => [],
            'note'        => aht_cut(strip_tags(trim((string)($orderData['note'] ?? ''))), 500),
            'total'       => strip_tags(trim((string)($orderData['total'] ?? ''))),
            'totalRaw'    => intval($orderData['totalRaw'] ?? 0),
            'date'        => strip_tags(trim((string)($orderData['date'] ?? date('Y/m/d')))),
            'dateISO'     => (string)($orderData['dateISO'] ?? date('c')),
            'status'      => preg_replace('/[^a-z_]/', '', (string)($orderData['status'] ?? 'pending')),
            'payMethod'   => preg_replace('/[^a-z_]/', '', (string)($orderData['payMethod'] ?? 'card')),
            'receiptImg'  => strip_tags(trim((string)($orderData['receiptImg'] ?? ''))),
            'shippingMethod' => (preg_replace('/[^a-z_]/', '', (string)($orderData['shippingMethod'] ?? 'tipax')) === 'barbari') ? 'barbari' : 'tipax',
        ];

        // اقلام سفارش: هر قلم حداکثر ۲۰۰ کاراکتر، بدون تگ HTML، حداکثر ۵۰ قلم
        $rawItems = $orderData['items'] ?? [];
        if (is_array($rawItems)) {
            $cleanItems = [];
            foreach (array_slice($rawItems, 0, 50) as $it) {
                if (is_string($it)) {
                    $t = aht_cut(strip_tags(trim($it)), 200);
                    if ($t !== '') $cleanItems[] = $t;
                }
            }
            $sanitizedOrder['items'] = $cleanItems;
        }

        aht_append_order($sanitizedOrder);
        echo json_encode(['ok' => true, 'code' => $sanitizedOrder['code']]);
        exit;
    }

    // ۲. ثبت امن نظر مشتری (Append Review) با پاکسازی کامل تگ‌های HTML
    if ($action === 'append_review' || $key === 'aht_reviews_append') {
        $rawReview = $_POST['review'] ?? ($_POST['value'] ?? '');
        $revData = is_array($rawReview) ? $rawReview : json_decode($rawReview, true);
        $prodId = intval($revData['productId'] ?? ($revData['product_id'] ?? ($_POST['product_id'] ?? 0)));
        if (!is_array($revData) || $prodId <= 0) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'error' => 'اطلاعات نظر نامعتبر است']);
            exit;
        }
        $reviewsPath = $DATA_DIR . 'aht_reviews.json';
        $allReviews = [];
        if (file_exists($reviewsPath)) {
            $allReviews = json_decode(@file_get_contents($reviewsPath), true) ?: [];
        }

        $newRev = [
            'id'         => time() * 1000 + random_int(10, 99),
            'productId'  => $prodId,
            'author'     => strip_tags(trim((string)($revData['author'] ?? 'مشتری ولتا'))),
            'rating'     => min(5, max(1, intval($revData['rating'] ?? 5))),
            'text'       => strip_tags(trim((string)($revData['text'] ?? ''))),
            'date'       => date('Y/m/d'),
            'status'     => 'approved',
            'adminReply' => null
        ];

        if (!isset($allReviews[$prodId])) {
            $allReviews[$prodId] = [];
        }
        $allReviews[$prodId][] = $newRev;
        @file_put_contents($reviewsPath, json_encode($allReviews, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);

        echo json_encode(['ok' => true, 'review' => $newRev]);
        exit;
    }

    // ۲.۵ پیگیری سفارش با کد (عمومی — فقط وضعیت، بدون اطلاعات خصوصی)
    if ($action === 'track_order') {
        $code = preg_replace('/[^a-zA-Z0-9_\-]/', '', (string)($_POST['code'] ?? ($_GET['code'] ?? '')));
        if ($code === '') {
            http_response_code(400);
            echo json_encode(['ok' => false, 'error' => 'کد پیگیری را وارد کنید']);
            exit;
        }
        $ordersPath = $DATA_DIR . 'aht_orders.json';
        $orders = [];
        if (file_exists($ordersPath)) {
            $decoded = json_decode(@file_get_contents($ordersPath), true);
            if (is_array($decoded)) $orders = $decoded;
        }
        foreach ($orders as $o) {
            if ((string)($o['code'] ?? '') === $code) {
                $statusLabels = ['pending' => 'در انتظار تأیید', 'approved' => 'تأیید شده', 'canceled' => 'لغو شده'];
                echo json_encode([
                    'ok'      => true,
                    'found'   => true,
                    'code'    => $code,
                    'status'  => (string)($o['status'] ?? 'pending'),
                    'statusLabel' => $statusLabels[(string)($o['status'] ?? 'pending')] ?? 'در حال بررسی',
                    'date'    => (string)($o['date'] ?? ''),
                    'total'   => (string)($o['total'] ?? ''),
                    'count'   => is_array($o['items'] ?? null) ? count($o['items']) : 0
                ], JSON_UNESCAPED_UNICODE);
                exit;
            }
        }
        echo json_encode(['ok' => true, 'found' => false, 'error' => 'سفارشی با این کد پیدا نشد'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // ۳. بررسی کلیدهای مدیریت
    $path = safeKeyToPath($DATA_DIR, $key);
    if (!$path) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'کلید نامعتبر است']);
        exit;
    }

    // کلیدهای محتوای سایت یا اطلاعات حساس با توکن معتبر ادمین یا کلید امن مشترک قابل نوشتن هستند
    $postToken = $_POST['admin_token'] ?? ($_POST['token'] ?? '');
    $secret = $_POST['secret'] ?? '';
    $isSecretValid = defined('AHT_SHARED_SECRET') && $secret !== '' && hash_equals(AHT_SHARED_SECRET, (string)$secret);
    $isAdmin = aht_token_is_admin($postToken) || $isSecretValid;

    if (in_array($key, $GLOBALS['AHT_ADMIN_ONLY_WRITE_KEYS'], true) && !$isAdmin) {
        http_response_code(403);
        echo json_encode(['ok' => false, 'error' => 'دسترسی غیرمجاز — برای تغییر این بخش باید با حساب مدیر وارد شده باشید']);
        exit;
    }

    $value = $_POST['value'] ?? 'null';
    $decoded = json_decode($value, true);
    if ($decoded === null && trim($value) !== 'null') {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'مقدار ارسالی JSON معتبر نیست']);
        exit;
    }

    if (@file_put_contents($path, $value, LOCK_EX) === false) {
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => 'ذخیره روی سرور ناموفق بود']);
        exit;
    }

    echo json_encode(['ok' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['ok' => false, 'error' => 'روش درخواست مجاز نیست']);
