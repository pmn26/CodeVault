<?php
$frontend = $_ENV['FRONTEND_ORIGIN'] ?? "http://localhost:5173";

if (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] === $frontend) {
    header("Access-Control-Allow-Origin: $frontend");
    header("Access-Control-Allow-Credentials: true");
}
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "../config.php";

/* ===============================
DB CONNECTION
================================ */
$conn = new mysqli($host, $username, $password, $db_name);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "DB error"]);
    exit();
}

/* ===============================
🚧 MAINTENANCE CHECK (GLOBAL)
================================ */
$maintenanceRes = $conn->query(
    "SELECT maintenance_mode FROM system_settings WHERE id = 1 LIMIT 1"
);

$maintenanceRow = $maintenanceRes?->fetch_assoc();
$maintenanceMode = isset($maintenanceRow['maintenance_mode'])
    && (int)$maintenanceRow['maintenance_mode'] === 1;

/* ===============================
INPUT
================================ */
$data = json_decode(file_get_contents("php://input"), true);
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? null;

if (!$email) {
    echo json_encode(["success" => false, "message" => "Email required"]);
    exit();
}

/* ===============================
FETCH USER
================================ */
$stmt = $conn->prepare(
    "SELECT id, name, password, role, verified FROM users WHERE email = ?"
);
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

/* ❌ USER NOT FOUND */
if ($stmt->num_rows === 0) {
    echo json_encode([
        "exists" => false,
        "maintenance" => $maintenanceMode,
        "message" => "User not found"
    ]);
    exit();
}

$stmt->bind_result($id, $name, $hashed_password, $role, $verified);
$stmt->fetch();

/* 🚧 BLOCK NON-ADMINS DURING MAINTENANCE */
if ($maintenanceMode && $role !== 'admin') {
    echo json_encode([
        "success" => false,
        "maintenance" => true,
        "message" => "System is currently under maintenance"
    ]);
    exit();
}

/* ===============================
PASSWORD CHECK
================================ */
$passwordValid = $password
    ? password_verify($password, $hashed_password)
    : false;

/* ===============================
SUCCESS RESPONSE
================================ */
echo json_encode([
    "exists" => true,
    "passwordValid" => $passwordValid,
    "verified" => (bool)$verified,
    "maintenance" => false,
    "user" => [
        "id" => $id,
        "name" => $name,
        "email" => $email,
        "role" => $role
    ]
]);

$stmt->close();
$conn->close();
