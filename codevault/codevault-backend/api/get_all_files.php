<?php
$frontend = "http://localhost:5173";
header("Access-Control-Allow-Origin: $frontend");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

header("Content-Type: application/json");
require_once "../config.php";

$conn = new mysqli($host, $username, $password, $db_name);
if ($conn->connect_error) { 
    echo json_encode(["success"=>false,"message"=>$conn->connect_error]); 
    exit(); 
}

// Fetch all files with uploader info
$stmt = $conn->prepare("
    SELECT 
        f.id, f.user_id, f.filename, f.filepath, f.uploaded_at, f.size,
        u.name AS uploader_name
    FROM files f
    JOIN users u ON f.user_id = u.id
    ORDER BY f.uploaded_at DESC
");
$stmt->execute();
$result = $stmt->get_result();

$files = [];
while ($row = $result->fetch_assoc()) {
    // Add a full URL to access the file
    $row['url'] = "http://localhost/CodeVault/codevault/codevault-backend/" . $row['filepath'];
    // Optional: detect language by extension
    $ext = pathinfo($row['filename'], PATHINFO_EXTENSION);
    $languageMap = [
        "js" => "JavaScript",
        "ts" => "TypeScript",
        "java" => "Java",
        "py" => "Python",
        "php" => "PHP",
        "cs" => "C#",
        "html" => "HTML"
    ];
    $row['language'] = $languageMap[strtolower($ext)] ?? "Other";
    $files[] = $row;
}

echo json_encode(["success"=>true,"files"=>$files]);

$stmt->close();
$conn->close();
?>
