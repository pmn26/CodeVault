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

/* DB */
$conn = new mysqli($host, $username, $password, $db_name);
if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed",
        "error" => $conn->connect_error
    ]);
    exit();
}

/* Input */
$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data['maintenance_mode'])) {
    echo json_encode([
        "success" => false,
        "message" => "Missing maintenance_mode field"
    ]);
    exit();
}

$maintenance_mode = (int)$data['maintenance_mode'];

/* Update */
$stmt = $conn->prepare(
    "UPDATE system_settings SET maintenance_mode = ? WHERE id = 1"
);
$stmt->bind_param("i", $maintenance_mode);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Maintenance mode updated",
        "maintenance_mode" => $maintenance_mode
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Failed to update maintenance mode"
    ]);
}

$stmt->close();
$conn->close();
?>
