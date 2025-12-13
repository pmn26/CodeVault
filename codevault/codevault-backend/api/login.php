<?php
$frontend = $_ENV['FRONTEND_ORIGIN'] ?? "http://localhost:5174";

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

$conn = new mysqli($host, $username, $password, $db_name);
if ($conn->connect_error) {
    echo json_encode(["message" => "Database connection failed", "error" => $conn->connect_error]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data['email'])) {
    echo json_encode(["message" => "Missing required fields"]);
    exit();
}

$email = trim($data['email']);
$password = $data['password'] ?? null;

$stmt = $conn->prepare("SELECT id, name, password, role, verified FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 0) {
    echo json_encode(["exists" => false, "message" => "User not found"]);
    $stmt->close();
    $conn->close();
    exit();
}

$stmt->bind_result($id, $name, $hashed_password, $role, $verified);
$stmt->fetch();

$passwordValid = $password ? password_verify($password, $hashed_password) : false;

echo json_encode([
    "exists" => true,
    "passwordValid" => $passwordValid,
    "verified" => (bool)$verified,
    "user" => [
        "id" => $id,
        "name" => $name,
        "email" => $email,
        "role" => $role
    ]
]);

$stmt->close();
$conn->close();
?>
