<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Max-Age: 3600");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$db = new mysqli('faure.cs.colostate.edu', 'hridayab', '836646469', 'hridayab');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = $db->query("SELECT id, name, hex_value as hexValue FROM colors");
    echo json_encode($result->fetch_all(MYSQLI_ASSOC));
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Add a new color
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $db->prepare("INSERT INTO colors (name, hex_value) VALUES (?, ?)");
    $stmt->bind_param("ss", $data['name'], $data['hexValue']);
    $stmt->execute();
    echo json_encode(['id' => $db->insert_id]);
} else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Edit an existing color
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $db->prepare("UPDATE colors SET name = ?, hex_value = ? WHERE id = ?");
    $stmt->bind_param("ssi", $data['name'], $data['hexValue'], $_GET['id']);
    $stmt->execute();
    echo json_encode(['success' => true]);
} else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Delete a color
    $stmt = $db->prepare("DELETE FROM colors WHERE id = ?");
    $stmt->bind_param("i", $_GET['id']);
    $stmt->execute();
    echo json_encode(['success' => true]);
}

$db->close();
?>