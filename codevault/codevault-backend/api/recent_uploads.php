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
    echo json_encode(["message" => "Database connection failed", "error" => $conn->connect_error]);
    exit();
}

// Fetch recent uploads, last 10
$sql = "SELECT f.id, f.filename, f.filepath, f.uploaded_at, u.name AS uploaded_by 
        FROM files f 
        JOIN users u ON f.user_id = u.id 
        ORDER BY f.uploaded_at DESC 
        LIMIT 10";
$result = $conn->query($sql);

$uploads = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $uploads[] = $row;
    }
}

echo json_encode($uploads);

$conn->close();
?>
