<?php
// Connexion à la base de données
include_once "./connexionBDD.php";
$conn = donneConnexionBDD();

// On récupère l'ID client depuis le sessionStorage via une requête GET ou POST
$idClient = $_GET['id_client'] ?? null;  // Récupère l'ID du client

if (!$idClient) {
    // Si l'ID client n'est pas défini, on retourne une erreur
    echo json_encode(['success' => false, 'message' => 'Client non connecté']);
    exit;
}

try {
    // Récupérer la quantité totale dans le panier
    $stmt = $conn->prepare('
        SELECT SUM(pc.quantite_ajoute) AS totalQuantite
        FROM panier_client pc
        WHERE pc.id_client = ?
    ');
    $stmt->execute([$idClient]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    // Retourner la quantité sous forme de réponse JSON
    echo json_encode(['success' => true, 'totalQuantite' => $result['totalQuantite'] ?? 0]);
} catch (PDOException $e) {
    // Erreur de récupération
    echo json_encode(['success' => false, 'message' => 'Erreur lors de la récupération des données']);
}
?>
