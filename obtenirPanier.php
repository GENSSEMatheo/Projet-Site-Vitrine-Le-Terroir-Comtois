<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id_client'])) {
    echo json_encode([]);
    exit;
}

try {
    $pdo = new PDO('mysql:host=localhost;dbname=db_terroircomtois;charset=utf8', 'root', '');
    
    $stmt = $pdo->prepare('
        SELECT p.nom, p.prix, pc.quantite_ajoute as quantite
        FROM panier_client pc
        JOIN stocks_total_actuel p ON pc.id_prod = p.id_prod
        WHERE pc.id_client = ?
    ');
    $stmt->execute([$data['id_client']]);
    
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    
} catch (PDOException $e) {
    echo json_encode([]);
}
?>