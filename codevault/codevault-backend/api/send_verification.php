<?php
require '../vendor/autoload.php';
require_once '../config.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit();

// Read input
$data = json_decode(file_get_contents("php://input"), true);
$email = trim($data['email'] ?? '');
if (!$email) {
    echo json_encode(["success" => false, "message" => "Email is required"]);
    exit();
}

// DB connection
$conn = new mysqli($host, $username, $password, $db_name);
if ($conn->connect_error) exit(json_encode(["success"=>false,"message"=>"DB connection failed"]));

// Check if user exists and not verified
$stmt = $conn->prepare("SELECT id, verified FROM users WHERE email = ?");
$stmt->bind_param("s",$email);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows === 0) {
    echo json_encode(["success"=>false,"message"=>"No user found"]);
    exit();
}
$user = $result->fetch_assoc();
if ($user['verified']) {
    echo json_encode(["success"=>false,"message"=>"Email already verified"]);
    exit();
}

// Generate code
$code = rand(100000, 999999);
$expires_at = date("Y-m-d H:i:s", strtotime("+10 minutes"));
$created_at = date("Y-m-d H:i:s");

// Delete old codes
$delete = $conn->prepare("DELETE FROM email_verifications WHERE email=?");
$delete->bind_param("s",$email);
$delete->execute();

// Insert new code
$stmt2 = $conn->prepare("INSERT INTO email_verifications (email, code, expires_at, created_at) VALUES (?,?,?,?)");
$stmt2->bind_param("ssss",$email,$code,$expires_at,$created_at);
$stmt2->execute();

// Send email
$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host = $_ENV['MAIL_HOST'] ?? 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = $_ENV['MAIL_USER'] ?? '2025codevault@gmail.com';
    $mail->Password = $_ENV['MAIL_PASS'] ?? '';
    $mail->SMTPSecure = $_ENV['MAIL_SMTP_SECURE'] ?? 'tls';
    $mail->Port = $_ENV['MAIL_PORT'] ?? 587;

    $mail->setFrom($_ENV['MAIL_FROM'], $_ENV['MAIL_FROM_NAME'] ?? 'CodeVault');
    $mail->addAddress($email);

    $mail->isHTML(true);
    $mail->Subject = "CodeVault Verification Code";
    $mail->Body = "Hello!<br><br>Your verification code is: <strong>$code</strong><br>It expires in 10 minutes.<br><br>– CodeVault Team";

    $mail->send();
    echo json_encode(["success"=>true,"message"=>"Verification code sent"]);
} catch (Exception $e) {
    echo json_encode(["success"=>false,"message"=>"Mailer error: {$mail->ErrorInfo}"]);
}

$conn->close();
