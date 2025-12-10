<?php
// === CORS headers must be first ===
$frontend = "http://localhost:5173";

header("Access-Control-Allow-Origin: $frontend");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight requests and exit
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// === PHP logic starts here ===
require_once "../config.php";

// Decode JSON input
$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input['name'], $input['user_id'])) {
    echo json_encode(["success" => false, "message" => "Missing folder name or user ID"]);
    exit();
}

$name = trim($input['name']);
$user_id = intval($input['user_id']);

// Connect to DB
$conn = new mysqli($host, $username, $password, $db_name);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => $conn->connect_error]);
    exit();
}

// Check if folder exists
$stmt = $conn->prepare("SELECT id FROM folders WHERE name = ? AND user_id = ?");
$stmt->bind_param("si", $name, $user_id);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Folder already exists"]);
    $stmt->close();
    $conn->close();
    exit();
}
$stmt->close();

// Insert new folder
$stmt = $conn->prepare("INSERT INTO folders (name, user_id) VALUES (?, ?)");
$stmt->bind_param("si", $name, $user_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Folder created successfully"]);
} else {
    echo json_encode(["success" => false, "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
