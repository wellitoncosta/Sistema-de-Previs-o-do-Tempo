<?php

$host = "localhost";
$port = "3307";
$dbname = "weather_system";
$user = "root";
$pass = "";

try {

    $pdo = new PDO(
        "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8",
        $user,
        $pass
    );

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch(PDOException $e){
    header('Content-Type: application/json');
    echo json_encode([
        "success" => false,
        "message" => "Erro na conexão com o banco de dados: " . $e->getMessage()
    ]);
    exit;
}

?>