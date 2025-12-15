<?php
/* ===============================
CORS
================================ */
$allowedOrigins = [
    $_ENV['FRONTEND_ORIGIN'] ?? 'http://localhost:5173',
    'http://localhost:5173'
];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
    header("Access-Control-Allow-Credentials: true");
}

header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

/* ===============================
LOAD CONFIG & DEPENDENCIES
================================ */
require_once "../config.php";
require_once "../vendor/autoload.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

/* ===============================
INPUT
================================ */
$data = json_decode(file_get_contents("php://input"), true);

$email   = trim($data['email'] ?? '');
$subject = trim($data['subject'] ?? '');
$message = trim($data['message'] ?? '');

/* ===============================
VALIDATION
================================ */
if (!$email || !$subject || !$message) {
    echo json_encode([
        "success" => false,
        "message" => "❌ All fields are required"
    ]);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        "success" => false,
        "message" => "❌ Invalid email address"
    ]);
    exit();
}

/* ===============================
EMAIL SEND
================================ */
$mail = new PHPMailer(true);

try {
    // SMTP CONFIG FROM .env
    $mail->isSMTP();
    $mail->Host       = $mailHost;
    $mail->SMTPAuth   = true;
    $mail->Username   = $mailUser;
    $mail->Password   = $mailPass;
    $mail->SMTPSecure = $mailSecure;
    $mail->Port       = $mailPort;

    // EMAIL HEADERS
    $mail->setFrom($mailFrom, $mailFromName);
    $mail->addReplyTo($email);
    $mail->addAddress($mailFrom); // support inbox

    // CONTENT
    $mail->isHTML(true);
    $mail->Subject = "[CodeVault Support] " . htmlspecialchars($subject);
    $mail->Body = "
        <h3>New Support Message</h3>
        <p><strong>From:</strong> {$email}</p>
        <p><strong>Subject:</strong> {$subject}</p>
        <p><strong>Message:</strong></p>
        <p>{$message}</p>
    ";

    $mail->send();

    echo json_encode([
        "success" => true,
        "message" => "✅ Message sent successfully"
    ]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "❌ Failed to send message"
    ]);
}
