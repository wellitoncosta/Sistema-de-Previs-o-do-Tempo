<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit; }

require_once "../config/database.php";

$json = file_get_contents('php://input');
$data = json_decode($json);

if (!$data || !isset($data->utilizador_id) || !isset($data->cidade)) {
    echo json_encode(["success" => false, "message" => "Dados incompletos"]);
    exit;
}

$userId = $data->utilizador_id;
$cidade = $data->cidade;

try {
    // Verificar se já é favorito
    $checkSql = "SELECT id FROM cidades_favoritas WHERE utilizador_id = :userId AND cidade = :cidade";
    $stmt = $pdo->prepare($checkSql);
    $stmt->execute(['userId' => $userId, 'cidade' => $cidade]);
    $favorite = $stmt->fetch();

    if ($favorite) {
        // Remover dos favoritos
        $sql = "DELETE FROM cidades_favoritas WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['id' => $favorite['id']]);
        echo json_encode(["success" => true, "isFavorite" => false, "message" => "Removido dos favoritos"]);
    } else {
        // Adicionar aos favoritos
        $sql = "INSERT INTO cidades_favoritas (utilizador_id, cidade) VALUES (:userId, :cidade)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['userId' => $userId, 'cidade' => $cidade]);
        echo json_encode(["success" => true, "isFavorite" => true, "message" => "Adicionado aos favoritos"]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Erro no servidor: " . $e->getMessage()]);
}
?>
