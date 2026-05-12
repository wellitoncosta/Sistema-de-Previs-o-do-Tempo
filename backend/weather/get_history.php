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
    // Busca as últimas cidades pesquisadas com dados de clima, sem repetições (pega a mais recente)
    $sql = "SELECT h1.cidade, h1.temperatura, h1.descricao_clima, h1.data_consulta 
            FROM historico_consultas h1
            INNER JOIN (
                SELECT cidade, MAX(data_consulta) as max_data
                FROM historico_consultas
                WHERE utilizador_id = :userId
                GROUP BY cidade
            ) h2 ON h1.cidade = h2.cidade AND h1.data_consulta = h2.max_data
            WHERE h1.utilizador_id = :userId
            ORDER BY h1.data_consulta DESC";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['userId' => $userId]);
    $cidades = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "cidades" => $cidades]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Erro no servidor: " . $e->getMessage()]);
}
?>
