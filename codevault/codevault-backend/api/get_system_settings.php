<?php
$frontend = $_ENV['FRONTEND_ORIGIN'] ?? "http://localhost:5173";

if (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] === $frontend) {
    header("Access-Control-Allow-Origin: $frontend");
    header("Access-Control-Allow-Credentials: true");
}

header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "../config.php";

$conn = new mysqli($host, $username, $password, $db_name);
if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed",
        "error" => $conn->connect_error
    ]);
    exit();
}

/* 🔧 AUTO-CREATE ROW IF MISSING */
$check = $conn->query("SELECT maintenance_mode FROM system_settings WHERE id = 1");

if (!$check) {
    echo json_encode([
        "success" => false,
        "message" => "Query failed",
        "error" => $conn->error
    ]);
    exit();
}

if ($check->num_rows === 0) {
    $conn->query(
        "INSERT INTO system_settings (id, maintenance_mode) VALUES (1, 0)"
    );

    echo json_encode([
        "success" => true,
        "maintenance_mode" => 0
    ]);
    exit();
}

$row = $check->fetch_assoc();

echo json_encode([
    "success" => true,
    "maintenance_mode" => (int)$row['maintenance_mode']
]);

$conn->close();
