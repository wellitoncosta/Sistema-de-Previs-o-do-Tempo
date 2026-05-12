<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->cidade)) {
    echo json_encode(["error" => "Cidade não especificada"]);
    exit;
}

$cidade = $data->cidade;
$utilizador_id = $data->utilizador_id ?? null;

$apiKey = "31b9bf5f5092b32f886261ae9324955f";
$url = "https://api.openweathermap.org/data/2.5/weather?q=$cidade&appid=$apiKey&units=metric&lang=pt_br";


$response = @file_get_contents($url);

if ($response === FALSE) {
    
    echo json_encode(["error" => "Cidade não encontrada ou erro na comunicação com a API"]);
    exit;
}

$resultado = json_decode($response, true);


if(isset($resultado['main'])){

    $temperatura = $resultado['main']['temp'];
    $descricao = $resultado['weather'][0]['description'];

  
    $sql = "INSERT INTO historico_consultas 
            (utilizador_id, cidade, temperatura, descricao_clima) 
            VALUES 
            (:utilizador_id, :cidade, :temperatura, :descricao)";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ":utilizador_id" => $utilizador_id,
        ":cidade" => $cidade,
        ":temperatura" => $temperatura,
        ":descricao" => $descricao
    ]);

    echo json_encode($resultado);

} else {
    echo json_encode(["error" => "Dados meteorológicos não disponíveis"]);
}
?>