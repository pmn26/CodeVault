<?php
header("Content-Type: application/json");
require_once "../config.php";

$data = json_decode(file_get_contents("php://input"), true);
if (!$data || !isset($data['user_id']) || !isset($data['message'])) {
    echo json_encode(["success" => false, "message" => "Invalid data"]);
    exit();
}

$user_id = intval($data['user_id']);
$message = $data['message'];

$conn = new mysqli($host, $username, $password, $db_name);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => $conn->connect_error]);
    exit();
}

$stmt = $conn->prepare("INSERT INTO feedback (user_id, message, created_at) VALUES (?, ?, NOW())");
$stmt->bind_param("is", $user_id, $message);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Feedback submitted successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to submit feedback"]);
}

$stmt->close();
$conn->close();
?>
