<?php
// filepath: e:\BTS SIO 1\CYBERSECURITE - BDD  - PROF\Site e-commerce Le Terroir Comtois\php\viderPanier.php

session_start();
header('Content-Type: application/json');

// Vérifiez si l'utilisateur est connecté
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Utilisateur non connecté.']);
    exit;
}

$id_client = $_SESSION['user_id'];

// Connexion à la base de données
require_once 'config.php'; // Assurez-vous que ce fichier contient vos informations de connexion

// Supprimer tous les articles du panier pour cet utilisateur
$sql = "DELETE FROM panier WHERE id_client = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id_client);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Erreur lors du vidage du panier.']);
}

$stmt->close();
$conn->close();
?>