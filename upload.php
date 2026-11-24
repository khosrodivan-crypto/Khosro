<?php
/**
 * آپلود امن فایل برای سایت ولتا
 */

require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

@ini_set('memory_limit', '512M');
@ini_set('display_errors', '0');
error_reporting(E_ALL);
ini_set('log_errors', '1');

$UPLOAD_DIR = __DIR__ . '/uploads/';
$RECEIPT_DIR = __DIR__ . '/uploads/receipts/';

$MAX_SIZE_CONTENT = 25 * 1024 * 1024; // سقف محتوای سایت: ۲۵ مگابایت
$MAX_SIZE_RECEIPT = 5 * 1024 * 1024;  // سقف فیش واریزی: ۵ مگابایت

$ALLOWED_IMAGE_EXT = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
$ALLOWED_VIDEO_EXT = ['mp4', 'webm'];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'روش درخواست مجاز نیست']);
    exit;
}

// ── محدودسازی نرخ درخواست (Rate Limiting) ──
$DATA_DIR = __DIR__ . '/data/';
if (!is_dir($DATA_DIR)) { @mkdir($DATA_DIR, 0755, true); }
$rateFile = $DATA_DIR . '.upload_rate.json';
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateData = [];
if (file_exists($rateFile)) {
    $j = json_decode(@file_get_contents($rateFile), true);
    if (is_array($j)) $rateData = $j;
}
$now = time();
$rec = $rateData[$ip] ?? ['count' => 0, 'windowStart' => $now];
if ($now - $rec['windowStart'] > 600) { $rec = ['count' => 0, 'windowStart' => $now]; }
if ($rec['count'] >= 30) {
    http_response_code(429);
    echo json_encode(['ok' => false, 'error' => 'تعداد آپلودها زیاد بوده — لطفاً چند دقیقه دیگر امتحان کنید']);
    exit;
}
$rec['count']++;
$rateData[$ip] = $rec;
foreach ($rateData as $k => $v) { if ($now - ($v['windowStart'] ?? 0) > 3600) unset($rateData[$k]); }
@file_put_contents($rateFile, json_encode($rateData), LOCK_EX);

// ── بررسی احراز هویت بر اساس نوع آپلود ──
$uploadType = $_POST['type'] ?? 'content';
$adminToken = $_POST['admin_token'] ?? '';

// آپلود محتوای سایت (اسلایدر، محصولات، بنرها و ...) نیازمند توکن معتبر مدیریت یا کلید امن است
$secret = $_POST['secret'] ?? '';
$isSecretValid = defined('AHT_SHARED_SECRET') && $secret === AHT_SHARED_SECRET;
if ($uploadType !== 'receipt' && !aht_token_is_admin($adminToken) && !$isSecretValid) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'error' => 'دسترسی غیرمجاز — آپلود رسانه نیازمند ورود با حساب مدیر است']);
    exit;
}

// ── بررسی فایل ارسالی ──
if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'فایلی دریافت نشد یا خطایی در ارسال رخ داد']);
    exit;
}

$file = $_FILES['file'];
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

// ── اعتبارسنجی فیش واریزی ──
if ($uploadType === 'receipt') {
    if (!in_array($ext, $ALLOWED_IMAGE_EXT, true)) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'تصویر فیش باید با فرمت jpg, png یا webp باشد']);
        exit;
    }
    if ($file['size'] > $MAX_SIZE_RECEIPT) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'حجم تصویر فیش حداکثر ۵ مگابایت است']);
        exit;
    }
    if (!is_dir($RECEIPT_DIR)) {
        @mkdir($RECEIPT_DIR, 0755, true);
    }
    @file_put_contents($RECEIPT_DIR . '.htaccess', "Options -Indexes\nphp_flag engine off\n");

    $targetName = 'receipt_' . time() . '_' . random_int(1000, 9999) . '.' . $ext;
    $targetPath = $RECEIPT_DIR . $targetName;
    $url = 'uploads/receipts/' . $targetName;
} else {
    // ── اعتبارسنجی محتوای عمومی سایت ──
    $isVideo = in_array($ext, $ALLOWED_VIDEO_EXT, true);
    $isImage = in_array($ext, $ALLOWED_IMAGE_EXT, true);

    if (!$isVideo && !$isImage) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'فرمت فایل مجاز نیست']);
        exit;
    }
    if ($file['size'] > $MAX_SIZE_CONTENT) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'حجم فایل بیش از حد مجاز است']);
        exit;
    }
    if (!is_dir($UPLOAD_DIR)) {
        @mkdir($UPLOAD_DIR, 0755, true);
    }
    @file_put_contents($UPLOAD_DIR . '.htaccess',
        "Options -Indexes\nphp_flag engine off\n" .
        "<FilesMatch \"\\.(?i:php|phtml|php3|php4|php5|phar|pl|py|cgi|sh|exe)$\">\nRequire all denied\n</FilesMatch>\n");

    $targetName = 'f' . time() . '_' . random_int(1000, 9999) . '.' . $ext;
    $targetPath = $UPLOAD_DIR . $targetName;
    $url = 'uploads/' . $targetName;
}

// ── بررسی MIME تایپ واقعی ──
$realMime = '';
if (function_exists('finfo_open')) {
    $fi = finfo_open(FILEINFO_MIME_TYPE);
    if ($fi) { $realMime = (string)finfo_file($fi, $file['tmp_name']); finfo_close($fi); }
} elseif (function_exists('mime_content_type')) {
    $realMime = (string)mime_content_type($file['tmp_name']);
}

$allowedMimes = [
    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
    'video/mp4', 'video/webm'
];
if ($realMime !== '' && !in_array($realMime, $allowedMimes, true)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'محتوای فایل معتبر نیست']);
    exit;
}

if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'ذخیره فایل روی سرور ناموفق بود']);
    exit;
}
@chmod($targetPath, 0644);

echo json_encode([
    'ok' => true,
    'url' => $url
]);
