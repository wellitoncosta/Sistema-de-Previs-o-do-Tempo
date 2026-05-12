<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit; }

require_once "../config/database.php";

$json = file_get_contents('php://input');
$data = json_decode($json);

if (!$data || !isset($data->id)) {
    echo json_encode(["success" => false, "message" => "ID do utilizador em falta"]);
    exit;
}

$id = $data->id;

try {
    $sql = "SELECT id, nome, email FROM utilizadores WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['id' => $id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo json_encode(["success" => true, "user" => $user]);
    } else {
        echo json_encode(["success" => false, "message" => "Utilizador não encontrado"]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Erro no servidor: " . $e->getMessage()]);
}
?>
