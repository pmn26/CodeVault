<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

require_once "../config.php";
require '../vendor/autoload.php';
use Cloudinary\Cloudinary;

// Get file ID
$file_id = isset($_GET['file_id']) ? intval($_GET['file_id']) : 0;
if (!$file_id) {
    echo json_encode(["success" => false, "message" => "Missing file ID"]);
    exit();
}

// Fetch file info from DB
$stmt = $conn->prepare("
    SELECT f.id, f.filename, f.filepath, f.description, f.uploaded_at, f.user_id,
        u.name AS uploader_name
    FROM files f
    LEFT JOIN users u ON f.user_id = u.id
    WHERE f.id = ?
");
$stmt->bind_param("i", $file_id);
$stmt->execute();
$result = $stmt->get_result();
$file = $result->fetch_assoc();
$stmt->close();

if (!$file) {
    echo json_encode(["success" => false, "message" => "File not found"]);
    exit();
}

// Cloudinary URL
$file_url = $cloudinary_base_url . $file['filepath'];

// Fetch raw content from Cloudinary
$content = "";
$ext = pathinfo($file['filename'], PATHINFO_EXTENSION);

// Only fetch text-based files for preview
$textExtensions = ['txt', 'js', 'css', 'html', 'json', 'php', 'py'];
if (in_array(strtolower($ext), $textExtensions)) {
    $content = @file_get_contents($file_url);
    if ($content === false) $content = "[Unable to load file content]";
}

echo json_encode([
    "success" => true,
    "file_id" => $file['id'],
    "filename" => $file['filename'],
    "description" => $file['description'],
    "uploaded_at" => $file['uploaded_at'],
    "uploader_name" => $file['uploader_name'],
    "user_id" => $file['user_id'],
    "content" => $content,
    "url" => $file_url
]);

$conn->close();
?>
