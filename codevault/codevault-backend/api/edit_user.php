<?php
$frontend = "http://localhost:5173";
if (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] === $frontend) {
    header("Access-Control-Allow-Origin: $frontend");
    header("Access-Control-Allow-Credentials: true");
}
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

require_once "../config.php";
$conn = new mysqli($host, $username, $password, $db_name);
if ($conn->connect_error) { echo json_encode(["success"=>false,"message"=>"DB connect fail"]); exit(); }

$data = json_decode(file_get_contents("php://input"), true);
$id = $data["id"] ?? null;
$name = $data["name"] ?? "";
$email = $data["email"] ?? "";
$role = $data["role"] ?? "user";

if (!$id) { echo json_encode(["success"=>false,"message"=>"Invalid user id"]); exit(); }

$stmt = $conn->prepare("UPDATE users SET name=?, email=?, role=? WHERE id=?");
$stmt->bind_param("sssi", $name, $email, $role, $id);
if ($stmt->execute()) echo json_encode(["success"=>true]);
else echo json_encode(["success"=>false,"message"=>"Failed to update user"]);

$stmt->close();
$conn->close();
?>
