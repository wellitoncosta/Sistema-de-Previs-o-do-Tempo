<?php
header('Content-Type: application/json');
require_once "config/database.php";

try {
    // Tenta fazer uma consulta simples para verificar se as tabelas existem
    $query = $pdo->query("SHOW TABLES");
    $tables = $query->fetchAll(PDO::FETCH_COLUMN);

    echo json_encode([
        "status" => "success",
        "message" => "Conexão com MySQL Server estabelecida com sucesso!",
        "database" => $dbname,
        "tables_found" => $tables
    ], JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Erro ao conectar ou consultar o banco: " . $e->getMessage()
    ], JSON_PRETTY_PRINT);
}
?>
