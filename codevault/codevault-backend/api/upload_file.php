<?php
// Allow CORS for your frontend
$frontend = "http://localhost:5173";
header("Access-Control-Allow-Origin: $frontend");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit();

// Load config (Cloudinary, DB credentials)
require_once "../config.php";

// Check required POST parameters
if (!isset($_FILES['file'], $_POST['folder_id'], $_POST['user_id'])) {
    echo json_encode(["success" => false, "message" => "Missing file, folder_id, or user_id"]);
    exit();
}

$folder_id = intval($_POST['folder_id']);
$user_id   = intval($_POST['user_id']);
$file      = $_FILES['file'];

// Connect to database
$conn = new mysqli($host, $username, $password, $db_name);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => $conn->connect_error]);
    exit();
}

// Check if folder exists and belongs to user
$checkFolder = $conn->prepare("SELECT id FROM folders WHERE id = ? AND user_id = ?");
$checkFolder->bind_param("ii", $folder_id, $user_id);
$checkFolder->execute();
$checkFolder->store_result();

if ($checkFolder->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Folder does not exist or does not belong to this user"]);
    $checkFolder->close();
    $conn->close();
    exit();
}
$checkFolder->close();

// Allowed code file extensions
$allowedExtensions = ['php','js','py','java','txt','css','html'];
$extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

if (!in_array($extension, $allowedExtensions)) {
    echo json_encode(["success" => false, "message" => "Invalid code file type"]);
    $conn->close();
    exit();
}

// Upload file to Cloudinary as RAW (non-image)
try {
    $uploadResult = $cloudinary->uploadApi()->upload($file['tmp_name'], [
        "folder" => "codevault_folder_$folder_id",
        "use_filename" => true,
        "unique_filename" => true,
        "resource_type" => "raw" // Important for code files
    ]);

    $public_id = $uploadResult['public_id'];
    $filename = $file['name'];
    $size = $file['size'];
    $uploaded_at = date("Y-m-d H:i:s");

    // Insert file record into database
    $stmt = $conn->prepare(
        "INSERT INTO files (folder_id, user_id, filename, filepath, uploaded_at, size) VALUES (?,?,?,?,?,?)"
    );
    $stmt->bind_param("iisssi", $folder_id, $user_id, $filename, $public_id, $uploaded_at, $size);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode([
            "success" => true,
            "message" => "Code file uploaded successfully!",
            "filename" => $filename,
            "filepath" => $public_id,
            "uploaded_at" => $uploaded_at,
            "size" => $size,
            "url" => $cloudinary_base_url . $public_id
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to insert file record"]);
    }

    $stmt->close();
} catch (\Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

$conn->close();
?>
