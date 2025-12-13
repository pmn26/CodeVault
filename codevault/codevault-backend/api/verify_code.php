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

$data = json_decode(file_get_contents("php://input"), true);
$email = trim($data['email'] ?? '');
$code = trim($data['code'] ?? '');

if (!$email || !$code) {
    echo json_encode(["success" => false, "message" => "Missing email or code"]);
    exit();
}

// Check code
$stmt = $conn->prepare("SELECT code, expires_at FROM email_verifications WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "No verification found for this email"]);
    exit();
}

$stmt->bind_result($db_code, $expires);
$stmt->fetch();

if ($db_code === $code && strtotime($expires) > time()) {
    $conn->query("UPDATE users SET verified = 1 WHERE email = '$email'");
    $conn->query("DELETE FROM email_verifications WHERE email = '$email'");
    echo json_encode(["success" => true, "message" => "Email verified successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Invalid or expired code"]);
}

$conn->close();
?>
