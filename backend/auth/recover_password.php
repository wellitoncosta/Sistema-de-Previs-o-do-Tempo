<?php

require_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"));

$email = $data->email;

$sql = "SELECT * FROM utilizadores WHERE email = :email";

$stmt = $pdo->prepare($sql);

$stmt->execute([
    ":email" => $email
]);

if($stmt->rowCount() > 0){

    echo json_encode([
        "message" => "Link de recuperação enviado"
    ]);

}else{

    echo json_encode([
        "message" => "Email não encontrado"
    ]);
}

?>