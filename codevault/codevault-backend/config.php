<?php
require_once __DIR__ . '/vendor/autoload.php';

use Cloudinary\Cloudinary;
use Dotenv\Dotenv;

// Load .env from parent directory
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// MySQL connection
$host = "localhost";
$username = "root";
$password = "";
$db_name = "codevault";

$conn = new mysqli($host, $username, $password, $db_name);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Cloudinary setup
$cloudinary = new Cloudinary([
    'cloud' => [
        'cloud_name' => $_ENV['CLOUDINARY_CLOUD_NAME'],
        'api_key'    => $_ENV['CLOUDINARY_API_KEY'],
        'api_secret' => $_ENV['CLOUDINARY_API_SECRET'],
    ],
    'url' => [
        'secure' => true
    ]
]);

$cloudinary_base_url = "https://res.cloudinary.com/dwkvfoc1p/raw/upload/";
