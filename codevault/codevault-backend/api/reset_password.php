<?php
require "../config.php";

/* ===============================
HEADERS
================================ */
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: $frontendOrigin");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

/* ===============================
INPUT
================================ */
$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data["email"] ?? "");
$code = trim($data["code"] ?? "");
$password = $data["password"] ?? "";

if (!$email || !$code || !$password) {
    echo json_encode(["success" => false, "message" => "Missing fields"]);
    exit;
}

/* ===============================
VALIDATE CODE (STRING SAFE)
================================ */
$stmt = $conn->prepare(
    "SELECT id FROM password_resets
    WHERE email = ? AND code = ? AND expires_at > ?"
);

$now = date("Y-m-d H:i:s");
$stmt->bind_param("sss", $email, $code, $now);
$stmt->execute();

if (!$stmt->get_result()->fetch_assoc()) {
    echo json_encode(["success" => false, "message" => "Invalid or expired code"]);
    exit;
}

/* ===============================
UPDATE PASSWORD
================================ */
$hashed = password_hash($password, PASSWORD_BCRYPT);

$stmt = $conn->prepare("UPDATE users SET password = ? WHERE email = ?");
$stmt->bind_param("ss", $hashed, $email);
$stmt->execute();

/* ===============================
CLEANUP
================================ */
$stmt = $conn->prepare("DELETE FROM password_resets WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();

echo json_encode([
    "success" => true,
    "message" => "Password reset successful"
]);
