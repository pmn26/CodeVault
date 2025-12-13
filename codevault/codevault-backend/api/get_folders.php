<?php
$frontend = "http://localhost:5174";
header("Access-Control-Allow-Origin: $frontend");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }
header("Content-Type: application/json");
require_once "../config.php";

$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;
if (!$user_id) { echo json_encode(["success"=>false,"message"=>"Missing user_id"]); exit(); }

$conn = new mysqli($host, $username, $password, $db_name);
if ($conn->connect_error) { echo json_encode(["success"=>false,"message"=>$conn->connect_error]); exit(); }

$stmt = $conn->prepare("SELECT id, name FROM folders WHERE user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$folders = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode(["success"=>true,"folders"=>$folders]);
$stmt->close();
$conn->close();
?>
