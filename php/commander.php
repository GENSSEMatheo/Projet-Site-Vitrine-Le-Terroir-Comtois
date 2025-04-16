<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once './connexionBDD.php';
    $conn = donneConnexionBDD();

    // Récupérer l'ID client depuis la requête POST
    $data = json_decode(file_get_contents('php://input'), true);
    $idClient = $data['id_client'] ?? null;

    if (!$idClient) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'ID client manquant']);
        exit;
    }

    try {
        // Démarrer une transaction pour garantir la cohérence des suppressions
        $conn->beginTransaction();

        // Récupérer les produits et quantités du panier pour mettre à jour les stocks
        $stmtPanier = $conn->prepare('SELECT id_prod, quantite_ajoute FROM panier_client WHERE id_client = ?');
        $stmtPanier->execute([$idClient]);
        $produitsPanier = $stmtPanier->fetchAll(PDO::FETCH_ASSOC);

        // Mettre à jour les stocks pour chaque produit
        foreach ($produitsPanier as $produit) {
            $stmtStock = $conn->prepare('
                UPDATE stocks_total_actuel 
                SET quantite_restante = quantite_restante - ? 
                WHERE id_prod = ?
            ');
            $stmtStock->execute([$produit['quantite_ajoute'], $produit['id_prod']]);
        }

        // Supprimer le contenu du panier pour l'utilisateur
        $stmtDeletePanier = $conn->prepare('DELETE FROM panier_client WHERE id_client = ?');
        $stmtDeletePanier->execute([$idClient]);

        // Valider la transaction
        $conn->commit();

        echo json_encode([
            'success' => true,
            'message' => 'Commande effectuée avec succès. Livraison sous 10 jours ouvrés.'
        ]);
    } catch (PDOException $e) {
        // Annuler la transaction en cas d'erreur
        $conn->rollBack();
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la commande : ' . $e->getMessage()]);
    }
}
?>