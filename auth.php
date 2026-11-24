<?php
/**
 * سیستم احراز هویت متمرکز ولتا (مدیر و کاربران)
 * مدیریت امن نشست‌ها، ثبت‌نام و ورود سمت سرور با bcrypt
 */

require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

$DATA_DIR = __DIR__ . '/data/';
if (!is_dir($DATA_DIR)) {
    @mkdir($DATA_DIR, 0755, true);
}

$LOCK_FILE  = $DATA_DIR . '.auth_attempts.json';
$TOKEN_FILE = $DATA_DIR . '.admin_tokens.json';
$USERS_FILE = $DATA_DIR . 'aht_users.json';

function aht_client_ip() {
    return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

function aht_read_json_file($file) {
    if (!file_exists($file)) return [];
    $j = json_decode(@file_get_contents($file), true);
    return is_array($j) ? $j : [];
}

function aht_write_json_file($file, $data) {
    @file_put_contents($file, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);
}

$action = $_GET['action'] ?? $_POST['action'] ?? '';

// ══════════════════════════════════════════
// ۱. بررسی نشست مدیر (ADMIN CHECK)
// ══════════════════════════════════════════
if ($action === 'check') {
    $token = $_GET['token'] ?? $_POST['token'] ?? '';
    echo json_encode(['ok' => true, 'isAdmin' => aht_token_is_admin($token)]);
    exit;
}

// ══════════════════════════════════════════
// ۲. خروج مدیر (ADMIN LOGOUT)
// ══════════════════════════════════════════
if ($action === 'logout') {
    $token = $_GET['token'] ?? $_POST['token'] ?? '';
    $tokens = aht_read_json_file($TOKEN_FILE);
    if ($token !== '' && isset($tokens[$token])) {
        unset($tokens[$token]);
        aht_write_json_file($TOKEN_FILE, $tokens);
    }
    echo json_encode(['ok' => true]);
    exit;
}

// ══════════════════════════════════════════
// ۳. ورود مدیر (ADMIN LOGIN)
// ══════════════════════════════════════════
if ($action === 'login' || $action === 'admin_login') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['ok' => false, 'error' => 'روش درخواست مجاز نیست']);
        exit;
    }

    $ip = aht_client_ip();
    $attempts = aht_read_json_file($LOCK_FILE);
    $rec = $attempts['admin_' . $ip] ?? ['count' => 0, 'lockUntil' => 0];

    if (time() < ($rec['lockUntil'] ?? 0)) {
        $wait = ($rec['lockUntil'] ?? 0) - time();
        http_response_code(429);
        echo json_encode(['ok' => false, 'error' => 'تلاش‌های ناموفق زیاد بود. ' . $wait . ' ثانیه صبر کنید']);
        exit;
    }

    $phone = trim($_POST['phone'] ?? '');
    $pass  = (string)($_POST['pass'] ?? '');

    $sha = hash('sha256', $pass);
    if (defined('AHT_ADMIN_PASS_BCRYPT') && AHT_ADMIN_PASS_BCRYPT !== '') {
        $passOk = password_verify($sha, AHT_ADMIN_PASS_BCRYPT);
    } else {
        $passOk = hash_equals(AHT_ADMIN_PASS_SHA256, $sha);
    }
    $ok = ($phone !== '' && $pass !== '' && hash_equals(AHT_ADMIN_PHONE, $phone) && $passOk);

    if ($ok) {
        unset($attempts['admin_' . $ip]);
        aht_write_json_file($LOCK_FILE, $attempts);

        $token = bin2hex(random_bytes(32));
        $tokens = aht_read_json_file($TOKEN_FILE);
        $now = time();
        foreach ($tokens as $t => $exp) { if ($exp < $now) unset($tokens[$t]); }
        $tokens[$token] = $now + (60 * 60 * 24 * 7); // اعتبار ۷ روز
        aht_write_json_file($TOKEN_FILE, $tokens);

        echo json_encode([
            'ok' => true,
            'token' => $token,
            'user' => [
                'name' => 'مدیر سایت',
                'phone' => AHT_ADMIN_PHONE,
                'isAdmin' => true
            ]
        ]);
    } else {
        $rec['count'] = ($rec['count'] ?? 0) + 1;
        if ($rec['count'] >= 5) {
            $prev = $rec['lockSecs'] ?? 0;
            $secs = $prev > 0 ? min($prev * 2, 3600) : 300;
            $rec['lockUntil'] = time() + $secs;
            $rec['lockSecs'] = $secs;
            $rec['count'] = 0;
        }
        $attempts['admin_' . $ip] = $rec;
        aht_write_json_file($LOCK_FILE, $attempts);
        http_response_code(401);
        echo json_encode(['ok' => false, 'error' => 'شماره موبایل یا رمز عبور اشتباه است']);
    }
    exit;
}

// ══════════════════════════════════════════
// ۴. ثبت‌نام کاربر عادی (USER REGISTER)
// ══════════════════════════════════════════
if ($action === 'user_register') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['ok' => false, 'error' => 'روش درخواست مجاز نیست']);
        exit;
    }

    $fname = trim(strip_tags($_POST['fname'] ?? ''));
    $lname = trim(strip_tags($_POST['lname'] ?? ''));
    $phone = trim($_POST['phone'] ?? '');
    $pass  = (string)($_POST['pass'] ?? '');

    if ($fname === '' || $lname === '' || $phone === '' || $pass === '') {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'لطفاً تمامی فیلدها را تکمیل کنید']);
        exit;
    }

    if (!preg_match('/^09\d{9}$/', $phone)) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'شماره موبایل نامعتبر است (باید با ۰۹ شروع شود و ۱۱ رقم باشد)']);
        exit;
    }

    if (strlen($pass) < 6) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'رمز عبور باید حداقل ۶ کاراکتر باشد']);
        exit;
    }

    // اگر شماره همان شماره ادمین باشد، اجازه ثبت‌نام به عنوان کاربر عادی داده نمی‌شود
    if (hash_equals(AHT_ADMIN_PHONE, $phone)) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'این شماره مخصوص مدیریت است؛ لطفاً از بخش ورود وارد شوید']);
        exit;
    }

    $users = aht_read_json_file($USERS_FILE);
    foreach ($users as $u) {
        if (($u['phone'] ?? '') === $phone) {
            http_response_code(400);
            echo json_encode(['ok' => false, 'error' => 'این شماره قبلاً در سیستم ثبت شده است']);
            exit;
        }
    }

    $newUser = [
        'id' => time() * 1000 + random_int(100, 999),
        'fname' => $fname,
        'lname' => $lname,
        'phone' => $phone,
        'pass' => password_hash($pass, PASSWORD_BCRYPT),
        'joinedAt' => date('Y/m/d'),
        'avatar' => ''
    ];

    $users[] = $newUser;
    aht_write_json_file($USERS_FILE, $users);

    echo json_encode([
        'ok' => true,
        'user' => [
            'id' => $newUser['id'],
            'name' => $fname . ' ' . $lname,
            'fname' => $fname,
            'lname' => $lname,
            'phone' => $phone,
            'joinedAt' => $newUser['joinedAt'],
            'avatar' => '',
            'isAdmin' => false
        ]
    ]);
    exit;
}

// ══════════════════════════════════════════
// ۵. ورود کاربر عادی (USER LOGIN)
// ══════════════════════════════════════════
if ($action === 'user_login') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['ok' => false, 'error' => 'روش درخواست مجاز نیست']);
        exit;
    }

    $phone = trim($_POST['phone'] ?? '');
    $pass  = (string)($_POST['pass'] ?? '');

    if ($phone === '' || $pass === '') {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'شماره موبایل و رمز عبور را وارد کنید']);
        exit;
    }

    $ip = aht_client_ip();
    $attempts = aht_read_json_file($LOCK_FILE);
    $rec = $attempts['user_' . $ip] ?? ['count' => 0, 'lockUntil' => 0];

    if (time() < ($rec['lockUntil'] ?? 0)) {
        $wait = ($rec['lockUntil'] ?? 0) - time();
        http_response_code(429);
        echo json_encode(['ok' => false, 'error' => 'تلاش‌های ناموفق زیاد بود. ' . $wait . ' ثانیه صبر کنید']);
        exit;
    }

    $users = aht_read_json_file($USERS_FILE);
    $foundUser = null;
    $foundIndex = -1;

    foreach ($users as $idx => $u) {
        if (($u['phone'] ?? '') === $phone) {
            $foundUser = $u;
            $foundIndex = $idx;
            break;
        }
    }

    if (!$foundUser) {
        $rec['count'] = ($rec['count'] ?? 0) + 1;
        if ($rec['count'] >= 5) {
            $rec['lockUntil'] = time() + 300;
            $rec['count'] = 0;
        }
        $attempts['user_' . $ip] = $rec;
        aht_write_json_file($LOCK_FILE, $attempts);

        http_response_code(401);
        echo json_encode(['ok' => false, 'error' => 'شماره موبایل یا رمز عبور اشتباه است']);
        exit;
    }

    $storedHash = (string)($foundUser['pass'] ?? '');
    $passMatch = false;

    // تطبیق با bcrypt
    if (password_verify($pass, $storedHash)) {
        $passMatch = true;
    } else {
        // تطبیق با هش قدیمی SHA256 جهت حفظ سازگاری
        $sha = hash('sha256', $pass);
        if (hash_equals($storedHash, $sha) || hash_equals($storedHash, $pass)) {
            $passMatch = true;
            // ارتقای خودکار هش قدیمی به bcrypt
            $users[$foundIndex]['pass'] = password_hash($pass, PASSWORD_BCRYPT);
            aht_write_json_file($USERS_FILE, $users);
        }
    }

    if ($passMatch) {
        unset($attempts['user_' . $ip]);
        aht_write_json_file($LOCK_FILE, $attempts);

        $fname = $foundUser['fname'] ?? '';
        $lname = $foundUser['lname'] ?? '';
        echo json_encode([
            'ok' => true,
            'user' => [
                'id' => $foundUser['id'] ?? time(),
                'name' => trim($fname . ' ' . $lname) ?: 'کاربر ولتا',
                'fname' => $fname,
                'lname' => $lname,
                'phone' => $foundUser['phone'] ?? $phone,
                'joinedAt' => $foundUser['joinedAt'] ?? date('Y/m/d'),
                'avatar' => $foundUser['avatar'] ?? '',
                'isAdmin' => false
            ]
        ]);
    } else {
        $rec['count'] = ($rec['count'] ?? 0) + 1;
        if ($rec['count'] >= 5) {
            $rec['lockUntil'] = time() + 300;
            $rec['count'] = 0;
        }
        $attempts['user_' . $ip] = $rec;
        aht_write_json_file($LOCK_FILE, $attempts);

        http_response_code(401);
        echo json_encode(['ok' => false, 'error' => 'شماره موبایل یا رمز عبور اشتباه است']);
    }
    exit;
}

// ══════════════════════════════════════════
// ۶. تغییر رمز کاربر (RESET PASSWORD)
// ══════════════════════════════════════════
if ($action === 'user_reset_pass') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['ok' => false, 'error' => 'روش درخواست مجاز نیست']);
        exit;
    }

    $phone = trim($_POST['phone'] ?? '');
    $newPass = (string)($_POST['new_pass'] ?? '');

    if ($phone === '' || strlen($newPass) < 6) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'رمز عبور جدید باید حداقل ۶ کاراکتر باشد']);
        exit;
    }

    $users = aht_read_json_file($USERS_FILE);
    $found = false;
    foreach ($users as $idx => $u) {
        if (($u['phone'] ?? '') === $phone) {
            $users[$idx]['pass'] = password_hash($newPass, PASSWORD_BCRYPT);
            $found = true;
            break;
        }
    }

    if (!$found) {
        http_response_code(404);
        echo json_encode(['ok' => false, 'error' => 'کاربری با این شماره یافت نشد']);
        exit;
    }

    aht_write_json_file($USERS_FILE, $users);
    echo json_encode(['ok' => true, 'message' => 'رمز عبور با موفقیت به‌روزرسانی شد']);
    exit;
}

// ══════════════════════════════════════════
// ۷. دریافت لیست کاربران (مخصوص مدیر با توکن)
// ══════════════════════════════════════════
if ($action === 'get_users') {
    $token = $_GET['admin_token'] ?? $_POST['admin_token'] ?? '';
    if (!aht_token_is_admin($token)) {
        http_response_code(403);
        echo json_encode(['ok' => false, 'error' => 'دسترسی غیرمجاز']);
        exit;
    }

    $users = aht_read_json_file($USERS_FILE);
    // حذف فیلد پسورد از خروجی
    $safeUsers = array_map(function($u) {
        unset($u['pass']);
        return $u;
    }, $users);

    echo json_encode(['ok' => true, 'users' => $safeUsers]);
    exit;
}

// ══════════════════════════════════════════
// ۸. حذف کاربر توسط مدیر (مخصوص مدیر با توکن)
// ══════════════════════════════════════════
if ($action === 'delete_user') {
    $token = $_POST['admin_token'] ?? '';
    if (!aht_token_is_admin($token)) {
        http_response_code(403);
        echo json_encode(['ok' => false, 'error' => 'دسترسی غیرمجاز']);
        exit;
    }

    $userId = $_POST['id'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $users = aht_read_json_file($USERS_FILE);
    $filtered = [];

    foreach ($users as $u) {
        if (($userId !== '' && (string)($u['id'] ?? '') === (string)$userId) ||
            ($phone !== '' && (string)($u['phone'] ?? '') === (string)$phone)) {
            continue;
        }
        $filtered[] = $u;
    }

    aht_write_json_file($USERS_FILE, $filtered);
    echo json_encode(['ok' => true]);
    exit;
}

http_response_code(400);
echo json_encode(['ok' => false, 'error' => 'دستور نامعتبر']);
