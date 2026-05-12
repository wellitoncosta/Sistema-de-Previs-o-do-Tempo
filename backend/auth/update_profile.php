<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit; }

require_once "../config/database.php";

$json = file_get_contents('php://input');
$data = json_decode($json);

if (!$data || !isset($data->id) || !isset($data->nome) || !isset($data->email)) {
    echo json_encode(["success" => false, "message" => "Dados incompletos"]);
    exit;
}

$id = $data->id;
$nome = $data->nome;
$email = $data->email;

try {
    // Se a senha foi enviada, atualiza tambem a senha
    if (isset($data->senha) && !empty($data->senha)) {
        $senha = password_hash($data->senha, PASSWORD_DEFAULT);
        $sql = "UPDATE utilizadores SET nome = :nome, email = :email, senha = :senha WHERE id = :id";
        $params = ['nome' => $nome, 'email' => $email, 'senha' => $senha, 'id' => $id];
    } else {
        $sql = "UPDATE utilizadores SET nome = :nome, email = :email WHERE id = :id";
        $params = ['nome' => $nome, 'email' => $email, 'id' => $id];
    }

    $stmt = $pdo->prepare($sql);
    $result = $stmt->execute($params);

    if ($result) {
        echo json_encode(["success" => true, "message" => "Perfil atualizado com sucesso"]);
    } else {
        echo json_encode(["success" => false, "message" => "Não foi possível atualizar o perfil"]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Erro no servidor: " . $e->getMessage()]);
}
?>
