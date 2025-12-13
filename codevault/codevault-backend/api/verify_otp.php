<?php
$frontend = "http://localhost:5174";

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
    echo json_encode(["success" => false, "message" => "DB connection failed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data['email'], $data['code'])) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit();
}

$email = trim($data['email']);
$code = trim($data['code']);

// Check OTP
$stmt = $conn->prepare("SELECT code, expires_at FROM email_verifications WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "No OTP found"]);
    $stmt->close();
    $conn->close();
    exit();
}

$stmt->bind_result($db_code, $expires_at);
$stmt->fetch();
$stmt->close();

$now = date("Y-m-d H:i:s");

if ($db_code !== $code) {
    echo json_encode(["success" => false, "message" => "Invalid OTP"]);
    $conn->close();
    exit();
}

if ($now > $expires_at) {
    echo json_encode(["success" => false, "message" => "OTP expired"]);
    $conn->close();
    exit();
}

// Update user verified = 1
$update = $conn->prepare("UPDATE users SET verified = 1 WHERE email = ?");
$update->bind_param("s", $email);
if ($update->execute()) {
    $conn->query("DELETE FROM email_verifications WHERE email = '$email'");
    echo json_encode(["success" => true, "message" => "Email verified! Registration complete."]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to verify email"]);
}
$update->close();
$conn->close();
?>
