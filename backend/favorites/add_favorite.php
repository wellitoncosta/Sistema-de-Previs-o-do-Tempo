<?php

require_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"));

$sql = "INSERT INTO cidades_favoritas(utilizador_id,cidade)
        VALUES(:uid,:cidade)";

$stmt = $pdo->prepare($sql);

$stmt->execute([
    ":uid" => $data->utilizador_id,
    ":cidade" => $data->cidade
]);

echo json_encode([
    "message" => "Cidade adicionada"
]);

?>