    <?php
$frontend = "http://localhost:5173";

if (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] === $frontend) {
    header("Access-Control-Allow-Origin: $frontend");
    header("Access-Control-Allow-Credentials: true");
}
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "../config.php";

$conn = new mysqli($host, $username, $password, $db_name);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}

// Get JSON body
$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    echo json_encode(["success" => false, "message" => "Invalid input"]);
    exit();
}

$name = trim($data["name"] ?? "");
$email = trim($data["email"] ?? "");
$password = trim($data["password"] ?? "");
$role = trim($data["role"] ?? "user");

// Validate
if ($name === "" || $email === "" || $password === "") {
    echo json_encode(["success" => false, "message" => "All fields are required."]);
    exit();
}

// Check for duplicate email
$check = $conn->prepare("SELECT id FROM users WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Email already exists."]);
    $check->close();
    $conn->close();
    exit();
}
$check->close();

// Hash password
$hashed = password_hash($password, PASSWORD_BCRYPT);

// Insert new user
$stmt = $conn->prepare("INSERT INTO users (name, email, password, role, created_at, verified, status)
                        VALUES (?, ?, ?, ?, NOW(), 0, 'default')");
$stmt->bind_param("ssss", $name, $email, $hashed, $role);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Database insert failed."]);
}

$stmt->close();
$conn->close();
?>
