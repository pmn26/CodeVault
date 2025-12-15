<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit();

require_once "../config.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['file_id'])) {
    echo json_encode(["success" => false, "message" => "Missing file_id"]);
    exit();
}

$file_id = intval($data['file_id']);
$conn = new mysqli($host, $username, $password, $db_name);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => $conn->connect_error]);
    exit();
}

// Get file public_id from DB
$stmt = $conn->prepare("SELECT filepath FROM files WHERE id = ?");
$stmt->bind_param("i", $file_id);
$stmt->execute();
$stmt->bind_result($public_id);
if (!$stmt->fetch()) {
    echo json_encode(["success" => false, "message" => "File not found"]);
    $stmt->close();
    $conn->close();
    exit();
}
$stmt->close();

try {
    // Delete from Cloudinary
    $cloudinary->uploadApi()->destroy($public_id, ["resource_type" => "raw"]);

    // Delete from database
    $stmt = $conn->prepare("DELETE FROM files WHERE id = ?");
    $stmt->bind_param("i", $file_id);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "File deleted successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to delete file from database"]);
    }

    $stmt->close();
} catch (\Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

$conn->close();
?>
