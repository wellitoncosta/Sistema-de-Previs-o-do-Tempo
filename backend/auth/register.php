<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit; }

require_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->nome) || !isset($data->email) || !isset($data->senha)) {
    echo json_encode(["success" => false, "message" => "Dados incompletos"]);
    exit;
}

$nome = $data->nome;
$email = $data->email;
// Criptografia da senha (Segurança de Engenharia!)
$senha = password_hash($data->senha, PASSWORD_DEFAULT);

try {
    // 1. Verificar se o email já existe para dar uma mensagem mais clara
    $checkSql = "SELECT id FROM utilizadores WHERE email = :email";
    $checkStmt = $pdo->prepare($checkSql);
    $checkStmt->execute([':email' => $email]);
    if ($checkStmt->fetch()) {
        echo json_encode(["success" => false, "message" => "Este email já está registado."]);
        exit;
    }

    // 2. Tentar inserir
    $sql = "INSERT INTO utilizadores (nome, email, senha) VALUES (:nome, :email, :senha)";
    $stmt = $pdo->prepare($sql);
    $result = $stmt->execute([
        ":nome" => $nome,
        ":email" => $email,
        ":senha" => $senha
    ]);

    if ($result) {
        echo json_encode(["success" => true, "message" => "Utilizador registado com sucesso"]);
    } else {
        echo json_encode(["success" => false, "message" => "Não foi possível guardar os dados."]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Erro no servidor: " . $e->getMessage()]);
}
?>