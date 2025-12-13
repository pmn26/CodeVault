<?php
header("Access-Control-Allow-Origin: http://localhost:5174");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit();

require_once "../config.php";

$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input['id'], $input['name'])) {
    echo json_encode(["success" => false, "message" => "Missing folder ID or name"]);
    exit();
}

$folder_id = intval($input['id']);
$name = trim($input['name']);

$conn = new mysqli($host, $username, $password, $db_name);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => $conn->connect_error]);
    exit();
}

// Update folder name
$stmt = $conn->prepare("UPDATE folders SET name = ? WHERE id = ?");
$stmt->bind_param("si", $name, $folder_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Folder renamed successfully"]);
} else {
    echo json_encode(["success" => false, "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
