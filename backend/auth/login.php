<?php
// 1. Cabeçalhos para o Angular não bloquear (CORS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit; }

require_once "../config/database.php";

// 2. CAPTURA O JSON (O segredo está aqui)
$json = file_get_contents('php://input');
$data = json_decode($json);

// 3. VERIFICA SE OS CAMPOS EXISTEM NO JSON
if (!$data || !isset($data->email) || !isset($data->password)) {
    echo json_encode(["success" => false, "message" => "Dados de login incompletos"]);
    exit;
}

$email = $data->email;
$password = $data->password;

// 4. CONSULTA O BANCO (O Marcos está lá!)
$query = "SELECT * FROM utilizadores WHERE email = :email";
$stmt = $pdo->prepare($query);
$stmt->execute(['email' => $email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && password_verify($password, $user['senha'])) { 
    echo json_encode([
        "success" => true, 
        "message" => "Bem-vindo!",
        "user" => [
            "id" => $user['id'],
            "nome" => $user['nome'], 
            "email" => $user['email']
        ]
    ]);
} else {
    // Se não for hash, tenta comparação direta 
    if ($user && $password == $user['senha']) {
        echo json_encode([
            "success" => true, 
            "message" => "Bem-vindo!",
            "user" => [
                "id" => $user['id'],
                "nome" => $user['nome'], 
                "email" => $user['email']
            ]
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Email ou senha incorretos"]);
    }
}