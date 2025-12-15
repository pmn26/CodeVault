<?php
require_once "../config.php";
require "../vendor/autoload.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = new mysqli($host, $username, $password, $db_name);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "DB connection failed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["data"][0]["email"], $data["data"][0]["name"])) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit();
}

$email = trim($data["data"][0]["email"]);
$name = trim($data["data"][0]["name"]);
$password = $data["data"][0]["password"] ?? null;
$auth_provider = $data["data"][0]["auth_provider"] ?? "email";
$verifyNow = $data["verifyNow"] ?? true;
$role = "user";

$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "User already registered"]);
    exit();
}

$stmt->close();

$hashed_password = $password ? password_hash($password, PASSWORD_DEFAULT) : null;
$verified = $auth_provider === "google" ? 1 : 0;
$now = date("Y-m-d H:i:s");

$stmt = $conn->prepare(
    "INSERT INTO users (email, name, password, created_at, role, verified, auth_provider)
     VALUES (?, ?, ?, ?, ?, ?, ?)"
);

$stmt->bind_param(
    "sssssis",
    $email,
    $name,
    $hashed_password,
    $now,
    $role,
    $verified,
    $auth_provider
);

if (!$stmt->execute()) {
    echo json_encode(["success" => false, "message" => "Insert failed"]);
    exit();
}

$stmt->close();

if ($auth_provider === "email" && $verifyNow) {
    $code = rand(100000, 999999);
    $expiresAt = date("Y-m-d H:i:s", strtotime("+".$_ENV['OTP_EXPIRE_MINUTES']." minutes"));

    $conn->query("DELETE FROM email_verifications WHERE email = '$email'");

    $otpStmt = $conn->prepare(
        "INSERT INTO email_verifications (email, code, expires_at) VALUES (?, ?, ?)"
    );
    $otpStmt->bind_param("sss", $email, $code, $expiresAt);
    $otpStmt->execute();
    $otpStmt->close();

    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = $_ENV['MAIL_HOST'];
        $mail->SMTPAuth = true;
        $mail->Username = $_ENV['MAIL_USER'];
        $mail->Password = $_ENV['MAIL_PASS'];
        $mail->SMTPSecure = $_ENV['MAIL_SMTP_SECURE'];
        $mail->Port = $_ENV['MAIL_PORT'];

        $mail->setFrom($_ENV['MAIL_FROM'], $_ENV['MAIL_FROM_NAME']);
        $mail->addAddress($email);
        $mail->isHTML(true);
        $mail->Subject = "CodeVault Email Verification";
        $mail->Body = "<h2>Hello, $name</h2><p>Your verification code is <b>$code</b></p>";

        $mail->send();
        echo json_encode(["success" => true, "message" => "OTP sent"]);
    } catch (Exception $e) {
        echo json_encode(["success" => false, "message" => "Mailer error"]);
    }
} else {
    echo json_encode(["success" => true, "message" => "Account created"]);
}

$conn->close();
