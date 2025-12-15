<?php
$frontend = "http://localhost:5173";

if (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] === $frontend) {
    header("Access-Control-Allow-Origin: $frontend");
    header("Access-Control-Allow-Credentials: true");
}
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "../config.php";

$conn = new mysqli($host, $username, $password, $db_name);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => $conn->connect_error]);
    exit();
}

// Fetch all files with uploader names
$sql = "
    SELECT 
        f.id,
        f.filename AS title,
        u.name AS author,
        f.filepath AS location,
        f.uploaded_at AS date
    FROM files f
    JOIN users u ON f.user_id = u.id
    ORDER BY f.uploaded_at DESC
";
$result = $conn->query($sql);

$files = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $row['url'] = 'http://localhost/CodeVault/codevault/codevault-backend/' . $row['location'];
        $files[] = $row;
    }
}

echo json_encode(["success" => true, "files" => $files]);
$conn->close();
?>
