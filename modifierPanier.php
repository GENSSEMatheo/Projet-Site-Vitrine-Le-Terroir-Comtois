<?php
header('Content-Type: application/json');

// Récupérer les données envoyées par le client
$data = json_decode(file_get_contents('php://input'), true);

// Vérifier si les données sont présentes
if (empty($data['id_client']) || empty($data['id_produit']) || !isset($data['variation'])) {
    echo json_encode(['error' => 'Données manquantes']);
    exit;
}

try {
    include_once "./connexionBDD.php";
    $conn = donneConnexionBDD();

    // Récupérer la quantité actuelle dans le panier pour ce produit et client
    $stmt = $conn->prepare('
        SELECT quantite_ajoute FROM panier_client
        WHERE id_client = ? AND id_prod = ?
    ');
    $stmt->execute([$data['id_client'], $data['id_produit']]);
    $produit = $stmt->fetch(PDO::FETCH_ASSOC);

    // Récupérer la quantité disponible dans le stock pour ce produit
    $stmtStock = $conn->prepare('
        SELECT quantite_restante FROM stocks_total_actuel
        WHERE id_prod = ?
    ');
    $stmtStock->execute([$data['id_produit']]);
    $stock = $stmtStock->fetch(PDO::FETCH_ASSOC);

    if ($produit && $stock) {
        // Calculer la nouvelle quantité dans le panier après modification
        $nouvelleQuantite = $produit['quantite_ajoute'] + $data['variation'];

        // Empêcher la quantité de devenir inférieure à 0
        if ($nouvelleQuantite < 0) {
            $nouvelleQuantite = 0;
        }

        // Empêcher d'ajouter plus que ce qui est disponible dans le stock
        if ($nouvelleQuantite > $stock['quantite_restante']) {
            $nouvelleQuantite = $stock['quantite_restante'];
        }

        if ($nouvelleQuantite == 0) {
            // Si la quantité atteint 0, supprimer le produit du panier
            $delete = $conn->prepare('
                DELETE FROM panier_client
                WHERE id_client = ? AND id_prod = ?
            ');
            $delete->execute([$data['id_client'], $data['id_produit']]);
            echo json_encode(['success' => true, 'message' => 'Produit supprimé du panier']);
        } else {
            // Mettre à jour la quantité dans le panier
            $update = $conn->prepare('
                UPDATE panier_client
                SET quantite_ajoute = ?
                WHERE id_client = ? AND id_prod = ?
            ');
            $update->execute([$nouvelleQuantite, $data['id_client'], $data['id_produit']]);
            echo json_encode(['success' => true, 'nouvelleQuantite' => $nouvelleQuantite]);
        }
    } else {
        echo json_encode(['error' => 'Produit non trouvé dans le panier ou en stock']);
    }

} catch (PDOException $e) {
    echo json_encode(['error' => 'Erreur lors de la mise à jour du panier : ' . $e->getMessage()]);
}
?>
