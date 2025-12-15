<?php
require_once '../config.php';
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit();

$data = json_decode(file_get_contents("php://input"), true);
$email = trim($data['email'] ?? '');
$code = trim($data['code'] ?? '');
if (!$email || !$code) {
    echo json_encode(["success"=>false,"message"=>"Email and code required"]);
    exit();
}

// DB connection
$conn = new mysqli($host,$username,$password,$db_name);
if($conn->connect_error) exit(json_encode(["success"=>false,"message"=>"DB error"]));

// Check code
$stmt = $conn->prepare("SELECT code, expires_at FROM email_verifications WHERE email=?");
$stmt->bind_param("s",$email);
$stmt->execute();
$stmt->store_result();
if($stmt->num_rows===0){
    echo json_encode(["success"=>false,"message"=>"No code found"]);
    exit();
}
$stmt->bind_result($db_code, $expires_at);
$stmt->fetch();
$stmt->close();

if($db_code !== $code) {
    echo json_encode(["success"=>false,"message"=>"Invalid code"]);
    exit();
}
if(strtotime($expires_at) < time()){
    echo json_encode(["success"=>false,"message"=>"Code expired"]);
    exit();
}

// Update user
$update = $conn->prepare("UPDATE users SET verified=1 WHERE email=?");
$update->bind_param("s",$email);
$update->execute();
$conn->query("DELETE FROM email_verifications WHERE email='$email'");
echo json_encode(["success"=>true,"message"=>"Email verified successfully"]);
$conn->close();
