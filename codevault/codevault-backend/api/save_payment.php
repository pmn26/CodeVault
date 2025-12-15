<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

// Read POST data
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['data'][0])) {
    echo json_encode(["success" => false, "message" => "Invalid request"]);
    exit();
}

$payment = $data['data'][0];

// Validate required fields
$required = ["Name", "CardNumber", "Expiry", "CVV", "Country", "Plan"];
foreach ($required as $field) {
    if (empty($payment[$field])) {
        echo json_encode(["success" => false, "message" => "$field is required"]);
        exit();
    }
}

// Optionally: sanitize input
$name = htmlspecialchars($payment['Name']);
$cardNumber = htmlspecialchars($payment['CardNumber']);
$expiry = htmlspecialchars($payment['Expiry']);
$cvv = htmlspecialchars($payment['CVV']);
$country = htmlspecialchars($payment['Country']);
$postal = htmlspecialchars($payment['Postal'] ?? "");
$plan = htmlspecialchars($payment['Plan'] ?? "");

// Connect to MySQL (replace with your DB credentials)
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "billing_db";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}

// Insert into payments table
$stmt = $conn->prepare("INSERT INTO payments (name, card_number, expiry, cvv, country, postal, plan, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())");
$stmt->bind_param("sssssss", $name, $cardNumber, $expiry, $cvv, $country, $postal, $plan);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Payment details saved successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to save payment details"]);
}

$stmt->close();
$conn->close();
?>
