<?php

require_once "../config/database.php";

header('Content-Type: text/csv');
header('Content-Disposition: attachment; filename="historico.csv"');

$output = fopen("php://output", "w");

fputcsv($output, [
    'Cidade',
    'Temperatura',
    'Descrição',
    'Data'
]);

$sql = "SELECT * FROM historico_consultas";

$stmt = $pdo->query($sql);

while($row = $stmt->fetch(PDO::FETCH_ASSOC)){

    fputcsv($output, [
        $row['cidade'],
        $row['temperatura'],
        $row['descricao_clima'],
        $row['data_consulta']
    ]);
}

fclose($output);

?>