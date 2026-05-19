<?php

// 1. Cabeçalhos CORS (Obrigatórios para o Angular conseguir comunicar sem bloqueios)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Se for uma requisição do tipo OPTIONS (pre-flight do Angular), encerra aqui com sucesso
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// 2. Importa a conexão PDO
require_once "../config/database.php";

// 3. Decodifica os dados enviados pelo Angular
$data = json_decode(file_get_contents("php://input"));

// Valida se o e-mail e a nova senha foram enviados
if (!empty($data->email) && !empty($data->novaSenha)) {
    
    $email = $data->email;
    
    // 4. Criptografia da Senha
    // Usa o password_hash que é o padrão seguro nativo do PHP. 
    // (Se no teu register.php usaste MD5, substitui por: $novaSenhaCripto = md5($data->novaSenha);)
    $novaSenhaCripto = password_hash($data->novaSenha, PASSWORD_BCRYPT);

    try {
        // 5. Query SQL para atualizar a senha do utilizador
        // Notei que a tua tabela se chama 'utilizadores', então mantive o padrão correto!
        $sql = "UPDATE utilizadores SET senha = :senha WHERE email = :email";
        $stmt = $pdo->prepare($sql);

        $resultado = $stmt->execute([
            ":senha" => $novaSenhaCripto,
            ":email" => $email
        ]);

        if ($resultado) {
            // Retorna o "success" => true que o Angular precisa para saber que deu certo
            echo json_encode([
                "success" => true,
                "message" => "Senha atualizada com sucesso!"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Erro ao executar a atualização na base de dados."
            ]);
        }

    } catch (PDOException $e) {
        echo json_encode([
            "success" => false,
            "message" => "Erro interno no servidor: " . $e->getMessage()
        ]);
    }

} else {
    // Caso falte algum dado no JSON recebido
    echo json_encode([
        "success" => false,
        "message" => "Dados incompletos. Certifique-se de preencher o e-mail e a nova senha."
    ]);
}

?>