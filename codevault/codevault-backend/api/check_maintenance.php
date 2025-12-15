<?php
require_once "../config.php";

$frontend = "http://localhost:5173";

header("Access-Control-Allow-Origin: $frontend");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight requests and exit
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = new mysqli($host, $username, $password, $db_name);
if ($conn->connect_error) {
    echo json_encode(["maintenance" => false]);
    exit();
}

$res = $conn->query(
    "SELECT maintenance_mode FROM system_settings WHERE id = 1 LIMIT 1"
);

$row = $res?->fetch_assoc();
$maintenance = isset($row['maintenance_mode']) && $row['maintenance_mode'] == 1;

echo json_encode([
    "maintenance" => $maintenance
]);

$conn->close();
