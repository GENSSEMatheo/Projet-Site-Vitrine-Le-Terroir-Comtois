<?php
header('Content-Type: application/json');

// Récupérer les données envoyées par le client
$data = json_decode(file_get_contents('php://input'), true);

// Vérifier si l'ID client est fourni
if (empty($data['id_client'])) {
    echo json_encode(['error' => 'ID client manquant ou invalide']);
    exit;
}

try {
    include_once "./connexionBDD.php";
    $conn = donneConnexionBDD();

    $stmt = $conn->prepare('
    SELECT 
        p.id_prod, 
        p.nom_prod AS nom, 
        p.prix, 
        p.image, 
        p.producteur,
        p.classTypeGlob,
        p.classTypePrecis,
        pc.quantite_ajoute AS quantite
    FROM panier_client pc
    JOIN stocks_total_actuel p ON pc.id_prod = p.id_prod
    WHERE pc.id_client = ?
');


    $stmt->execute([intval($data['id_client'])]);
    $resultats = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($resultats)) {
        echo json_encode(['message' => 'Votre panier est vide']);
        exit;
    }

    // Retourner les produits du panier sous forme de JSON
    echo json_encode($resultats);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Erreur lors de la récupération des données : ' . $e->getMessage()]);
}
