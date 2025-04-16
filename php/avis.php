<?php
header('Content-Type: application/json');
include_once "./connexionBDD.php";

$conn = donneConnexionBDD();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Enregistrer un nouvel avis
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['nom'], $data['avis'])) {
        echo json_encode(['success' => false, 'message' => 'Données manquantes']);
        exit;
    }

    $nom = htmlspecialchars($data['nom']);
    $avis = htmlspecialchars($data['avis']);

    try {
        $stmt = $conn->prepare("INSERT INTO avis (nom, avis) VALUES (?, ?)");
        $stmt->execute([$nom, $avis]);
        echo json_encode(['success' => true, 'message' => 'Avis enregistré avec succès']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'enregistrement : ' . $e->getMessage()]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Récupérer les avis existants
    try {
        $stmt = $conn->query("SELECT nom, avis, date_creation FROM avis ORDER BY date_creation DESC");
        $avis = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'avis' => $avis]);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la récupération des avis : ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
}
?>