<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit; }

require_once "../config/database.php";

$json = file_get_contents('php://input');
$data = json_decode($json);

if (!$data || !isset($data->utilizador_id)) {
    echo json_encode(["success" => false, "message" => "ID do utilizador em falta"]);
    exit;
}

$userId = $data->utilizador_id;

try {
    $sql = "SELECT cidade FROM cidades_favoritas WHERE utilizador_id = :userId ORDER BY id DESC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['userId' => $userId]);
    $favoritos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "favoritos" => $favoritos]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Erro no servidor: " . $e->getMessage()]);
}
?>
