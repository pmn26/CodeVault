<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit();

require_once "../config.php";

$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input['id'])) {
    echo json_encode(["success" => false, "message" => "Missing folder ID"]);
    exit();
}

$folder_id = intval($input['id']);

$conn = new mysqli($host, $username, $password, $db_name);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => $conn->connect_error]);
    exit();
}

// Delete folder
$stmt = $conn->prepare("DELETE FROM folders WHERE id = ?");
$stmt->bind_param("i", $folder_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Folder deleted successfully"]);
} else {
    echo json_encode(["success" => false, "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
