<?php
require_once "../config.php";
require '../vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header("Access-Control-Allow-Origin: http://localhost:5174");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// DB connection
$conn = new mysqli($host, $username, $password, $db_name);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "DB connection failed"]);
    exit();
}

// Get data
$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data["data"][0]["email"], $data["data"][0]["name"], $data["data"][0]["password"])) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit();
}

$email = trim($data["data"][0]["email"]);
$name = trim($data["data"][0]["name"]);
$password = $data["data"][0]["password"];
$role = "user";
$verifyNow = $data['verifyNow'] ?? true;

// Check if user exists
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "User already registered"]);
    $stmt->close();
    $conn->close();
    exit();
}
$stmt->close();

// Insert user with verified = 0
$hashed_password = password_hash($password, PASSWORD_DEFAULT);
$now = date("Y-m-d H:i:s");
$stmt = $conn->prepare("INSERT INTO users (email, name, password, created_at, role, verified) VALUES (?, ?, ?, ?, ?, 0)");
$stmt->bind_param("sssss", $email, $name, $hashed_password, $now, $role);
$stmt->execute();
$stmt->close();

// If Verify Now, send OTP
if ($verifyNow) {
    $code = rand(100000, 999999);
    $expiresAt = date("Y-m-d H:i:s", strtotime("+".$_ENV['OTP_EXPIRE_MINUTES']." minutes"));

    // Remove old OTPs
    $conn->query("DELETE FROM email_verifications WHERE email = '$email'");

    $otpStmt = $conn->prepare("INSERT INTO email_verifications (email, code, expires_at) VALUES (?, ?, ?)");
    $otpStmt->bind_param("sss", $email, $code, $expiresAt);
    $otpStmt->execute();
    $otpStmt->close();

    // Send OTP email
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
        $mail->Subject = 'CodeVault Email Verification';
        $mail->Body = "<h2>Hello, $name!</h2>
                    <p>Your verification code is: <b>$code</b></p>
                    <p>This code expires in ".$_ENV['OTP_EXPIRE_MINUTES']." minutes.</p>";

        $mail->send();
        echo json_encode(["success" => true, "message" => "OTP sent! Please check your Gmail."]);
    } catch (Exception $e) {
        echo json_encode(["success" => false, "message" => "Mailer Error: " . $mail->ErrorInfo]);
    }
} else {
    echo json_encode(["success" => true, "message" => "Account created! You can verify your email later."]);
}

$conn->close();
?>
