<?php
header("Access-Control-Allow-Origin: http://localhost:5174");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

require_once "../config.php";

$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;
$folder_id = isset($_GET['folder_id']) ? intval($_GET['folder_id']) : 0;

if (!$user_id || !$folder_id) { 
    echo json_encode(["success" => false, "message" => "Missing user_id or folder_id"]); 
    exit(); 
}

$stmt = $conn->prepare("
    SELECT 
        f.id, f.folder_id, f.user_id, f.filename, f.filepath, f.uploaded_at, f.size,
        u.name AS uploader_name
    FROM files f
    JOIN users u ON f.user_id = u.id
    WHERE f.folder_id = ?
");
$stmt->bind_param("i", $folder_id);
$stmt->execute();
$result = $stmt->get_result();

$files = [];
while ($row = $result->fetch_assoc()) {
    $row['url'] = $cloudinary_base_url . $row['filepath'];
    $files[] = $row;
}

echo json_encode(["success" => true, "files" => $files]);

$stmt->close();
$conn->close();
?>
