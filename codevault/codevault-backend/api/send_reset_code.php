<?php
require "../config.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

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

if (!$email) {
    echo json_encode(["success" => false, "message" => "Email required"]);
    exit;
}

/* ===============================
CHECK VERIFIED
================================ */
$stmt = $conn->prepare("SELECT verified FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

if (!$user || (int)$user["verified"] !== 1) {
    echo json_encode(["success" => false, "message" => "Email not verified"]);
    exit;
}

/* ===============================
GENERATE STRING CODE (IMPORTANT)
================================ */
$code = str_pad((string) random_int(0, 999999), 6, "0", STR_PAD_LEFT);
$expires = date("Y-m-d H:i:s", time() + ($otpExpireMinutes * 60));

/* ===============================
STORE CODE
================================ */
$stmt = $conn->prepare("DELETE FROM password_resets WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();

$stmt = $conn->prepare(
    "INSERT INTO password_resets (email, code, expires_at)
    VALUES (?, ?, ?)"
);
$stmt->bind_param("sss", $email, $code, $expires);
$stmt->execute();

/* ===============================
SEND EMAIL (SMTP)
================================ */
try {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = $mailHost;
    $mail->SMTPAuth   = true;
    $mail->Username   = $mailUser;
    $mail->Password   = $mailPass;
    $mail->SMTPSecure = $mailSecure;
    $mail->Port       = $mailPort;

    $mail->setFrom($mailFrom, $mailFromName);
    $mail->addAddress($email);

    $mail->isHTML(true);
    $mail->Subject = "Password Reset Code";
    $mail->Body = "
        <h2>Password Reset</h2>
        <p>Your verification code is:</p>
        <h1>$code</h1>
        <p>This code expires in $otpExpireMinutes minutes.</p>
    ";

    $mail->send();

    echo json_encode(["success" => true, "message" => "Reset code sent"]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Email failed",
        "error" => $mail->ErrorInfo
    ]);
}
