<?php
header("Content-Type: application/json");
require_once "../config.php";

// Expect JSON body
$data = json_decode(file_get_contents("php://input"), true);
if (!$data || !isset($data['user_id'])) {
    echo json_encode(["success" => false, "message" => "Invalid data"]);
    exit();
}

$user_id = intval($data['user_id']);
$name = $data['name'] ?? "";
$email = $data['email'] ?? "";
$password = $data['password'] ?? "";

$conn = new mysqli($host, $username, $password, $db_name);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => $conn->connect_error]);
    exit();
}

// Hash password before saving
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare("UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?");
$stmt->bind_param("sssi", $name, $email, $hashedPassword, $user_id);
if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Account updated successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to update account"]);
}

$stmt->close();
$conn->close();
?>
