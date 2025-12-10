<?php
$frontend = "http://localhost:5173";
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

// Get JSON data
$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data["data"][0]["email"], $data["data"][0]["name"], $data["data"][0]["password"])) {
    echo json_encode(["message" => "Missing required fields"]);
    exit();
}

$email = trim($data["data"][0]["email"]);
$name = trim($data["data"][0]["name"]);
$password = $data["data"][0]["password"];

// All new registrations default to 'user'
$role = "user";

// Detect Google user by placeholder password
$isGoogleUser = ($password === "google_placeholder");

// Check if email already exists
$stmt = $conn->prepare("SELECT id, password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    // User exists
    $stmt->bind_result($id, $existing_password);
    $stmt->fetch();

    if ($isGoogleUser) {
        echo json_encode(["message" => "Google user exists, login allowed"]);
    } else {
        echo json_encode(["message" => "User already exists, please login"]);
    }

    $stmt->close();
    $conn->close();
    exit();
}
$stmt->close();

// For normal users, hash the password
$hashed_password = $isGoogleUser ? "" : password_hash($password, PASSWORD_DEFAULT);

// Insert new user with default role
$stmt = $conn->prepare("INSERT INTO users (email, name, password, role) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $email, $name, $hashed_password, $role);

if ($stmt->execute()) {
    $msg = $isGoogleUser ? "Google user registered successfully" : "User registered successfully";
    echo json_encode(["message" => $msg, "role" => $role]);
} else {
    echo json_encode([
        "message" => "Failed to register user",
        "error" => $stmt->error,
        "debug_sqlstate" => $stmt->sqlstate
    ]);
}

$stmt->close();
$conn->close();
?>
