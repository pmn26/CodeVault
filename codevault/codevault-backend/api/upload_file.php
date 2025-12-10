<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

$frontend = "http://localhost:5173";
header("Access-Control-Allow-Origin: $frontend");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { 
    http_response_code(200); 
    exit(); 
}

header("Content-Type: application/json");
require_once "../config.php";

// Check required POST data
if (!isset($_FILES['file'], $_POST['folder_id'], $_POST['user_id'])) {
    echo json_encode(["success"=>false,"message"=>"Missing file, folder_id, or user_id"]);
    exit();
}

$folder_id = intval($_POST['folder_id']);
$user_id   = intval($_POST['user_id']);
$file      = $_FILES['file'];

// Ensure uploads directory exists
$uploadDir = __DIR__ . "/../uploads/";
if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

// Create unique filename
$filename   = time() . "_" . basename($file['name']);
$targetFile = $uploadDir . $filename;

// Move uploaded file
if (!move_uploaded_file($file['tmp_name'], $targetFile)) {
    echo json_encode(["success"=>false,"message"=>"Failed to move uploaded file"]);
    exit();
}

// Web-accessible path
$webPath = "uploads/" . $filename;

// Database connection
$conn = new mysqli($host, $username, $password, $db_name);
if ($conn->connect_error) { 
    echo json_encode(["success"=>false,"message"=>$conn->connect_error]); 
    exit(); 
}

// Verify folder exists and belongs to this user
$checkFolder = $conn->prepare("SELECT id FROM folders WHERE id = ? AND user_id = ?");
$checkFolder->bind_param("ii", $folder_id, $user_id);
$checkFolder->execute();
$checkFolder->store_result();
if ($checkFolder->num_rows === 0) {
    echo json_encode(["success"=>false,"message"=>"Folder does not exist or does not belong to this user"]);
    $checkFolder->close();
    $conn->close();
    exit();
}
$checkFolder->close();

// Insert file record
$uploaded_at = date("Y-m-d H:i:s");
$size = $_FILES['file']['size'];
$stmt = $conn->prepare(
    "INSERT INTO files (folder_id,user_id,filename,filepath,uploaded_at,size) VALUES (?,?,?,?,?,?)"
);
$stmt->bind_param("iisssi", $folder_id, $user_id, $filename, $webPath, $uploaded_at, $size);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo json_encode([
        "success"    => true,
        "message"    => "File uploaded successfully!",
        "filename"   => $filename,
        "filepath"   => $webPath,
        "uploaded_at"=> $uploaded_at,
        "size"       => $size,
        "url"        => "http://localhost/CodeVault/codevault/codevault-backend/$webPath"
    ]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to insert file record"]);
}

$stmt->close();
$conn->close();
?>
