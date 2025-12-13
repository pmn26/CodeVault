<?php
require_once __DIR__ . '/vendor/autoload.php';

use Cloudinary\Cloudinary;
use Dotenv\Dotenv;

// Load .env file from parent directory
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// ========== DATABASE CONNECTION ==========
$host = $_ENV['DB_HOST'] ?? "localhost";
$username = $_ENV['DB_USER'] ?? "root";
$password = $_ENV['DB_PASS'] ?? "";
$db_name = $_ENV['DB_NAME'] ?? "codevault";

$conn = new mysqli($host, $username, $password, $db_name);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// ========== CLOUDINARY CONFIG ==========
$cloudinary = new Cloudinary([
    'cloud' => [
        'cloud_name' => $_ENV['CLOUDINARY_CLOUD_NAME'] ?? '',
        'api_key'    => $_ENV['CLOUDINARY_API_KEY'] ?? '',
        'api_secret' => $_ENV['CLOUDINARY_API_SECRET'] ?? '',
    ],
    'url' => ['secure' => true]
]);

$cloudinary_base_url = "https://res.cloudinary.com/dwkvfoc1p/raw/upload/";

// ========== GMAIL / OTP EMAIL CONFIG ==========
$mailHost = $_ENV['MAIL_HOST'] ?? 'smtp.gmail.com';
$mailPort = $_ENV['MAIL_PORT'] ?? 587;
$mailUser = $_ENV['MAIL_USER'] ?? '';
$mailPass = $_ENV['MAIL_PASS'] ?? '';
$mailSecure = $_ENV['MAIL_SMTP_SECURE'] ?? 'tls';
$mailFrom = $_ENV['MAIL_FROM'] ?? $mailUser;
$mailFromName = $_ENV['MAIL_FROM_NAME'] ?? 'Your App Name';

// ========== FRONTEND ORIGIN (for CORS) ==========
$frontendOrigin = $_ENV['FRONTEND_ORIGIN'] ?? 'http://localhost:5174';

// ========== OTP SETTINGS ==========
$otpExpireMinutes = $_ENV['OTP_EXPIRE_MINUTES'] ?? 10;
?>
