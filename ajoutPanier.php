<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$idProd = $data['id_produit'] ?? null;
$idClient = $data['id_client'] ?? null;
$idProd = substr($idProd,10);
if (!$idProd || !$idClient) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Données manquantes'
    ]);
    exit;
}

require_once './connexionBDD.php';
$conn = donneConnexionBDD();

try {
    // Vérification du stock disponible
    $stmtStock = $conn->prepare('SELECT quantite_restante FROM stocks_total_actuel WHERE id_prod = ?');
    $stmtStock->execute([$idProd]);
    $stock = $stmtStock->fetch();

    if (!$stock) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Produit introuvable'
        ]);
        exit;
    }

    if ($stock['quantite_restante'] <= 0) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Rupture de stock'
        ]);
        exit;
    }

    // Vérification si le produit est déjà dans le panier
    $stmtPanier = $conn->prepare('SELECT quantite_ajoute FROM panier_client WHERE id_client = ? AND id_prod = ?');
    $stmtPanier->execute([$idClient, $idProd]);
    $ligne = $stmtPanier->fetch();

    if ($ligne) {
        if ($ligne['quantite_ajoute'] >= $stock['quantite_restante']) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Quantité maximale atteinte'
            ]);
            exit;
        }

        $stmtUpdate = $conn->prepare('
            UPDATE panier_client 
            SET quantite_ajoute = quantite_ajoute + 1 
            WHERE id_client = ? AND id_prod = ?
        ');
        $stmtUpdate->execute([$idClient, $idProd]);
        $message = 'Quantité mise à jour';
    } else {
        $stmtInsert = $conn->prepare('
            INSERT INTO panier_client (id_client, id_prod, quantite_ajoute)
            VALUES (?, ?, 1)
        ');
        $stmtInsert->execute([$idClient, $idProd]);
        $message = 'Produit ajouté au panier';
    }

    echo json_encode([
        'success' => true,
        'message' => $message
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de la communication avec la base de données'
        // Pour le dev : 'error' => $e->getMessage()
    ]);
}
