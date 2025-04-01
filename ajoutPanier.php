<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id_produit']) || !isset($data['id_client'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Données manquantes']);
    exit;
}

try {
    $pdo = new PDO('mysql:host=localhost;dbname=db_terroircomtois;charset=utf8', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    // Vérification produit
    $stmt = $pdo->prepare('SELECT id_prod FROM stocks_total_actuel WHERE id_prod = ?');
    $stmt->execute([$data['id_produit']]);
    
    if (!$stmt->fetch()) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Produit introuvable']);
        exit;
    }

    // Vérifier si le produit est déjà dans le panier du client
    $stmt = $pdo->prepare('SELECT quantite_ajoute FROM panier_client WHERE id_client = ? AND id_prod = ?');
    $stmt->execute([$data['id_client'], $data['id_produit']]);
    $existingProduct = $stmt->fetch();

    if ($existingProduct) {
        // Produit déjà présent - incrémenter la quantité
        $stmt = $pdo->prepare('UPDATE panier_client SET quantite_ajoute = quantite_ajoute + 1 
                              WHERE id_client = ? AND id_prod = ?');
        $stmt->execute([$data['id_client'], $data['id_produit']]);
        $message = 'Quantité mise à jour dans le panier';
    } else {
        // Nouveau produit - ajouter avec quantité 1
        $stmt = $pdo->prepare('INSERT INTO panier_client (id_client, id_prod, quantite_ajoute) 
                              VALUES (?, ?, 1)');
        $stmt->execute([$data['id_client'], $data['id_produit']]);
        $message = 'Produit ajouté au panier';
    }

    echo json_encode(['success' => true, 'message' => $message]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur de base de données: ' . $e->getMessage()]);
}
?>