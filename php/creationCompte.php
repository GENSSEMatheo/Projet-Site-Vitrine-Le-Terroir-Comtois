<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Récupération et sécurisation des données du formulaire
    $nom = strtoupper(trim($_POST['nom']));
    $prenom = ucfirst(strtolower(trim($_POST['prenom'])));
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $mdp = $_POST['mdp'];

    // Validation des données
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Adresse e-mail invalide']);
        exit;
    }

    // Hachage du mot de passe
    $mdpHash = password_hash($mdp, PASSWORD_BCRYPT);

    // Connexion à la base de données
    include_once "./connexionBDD.php";
    $conn = donneConnexionBDD();

    try {
        // Vérifier si l'adresse e-mail existe déjà
        $checkEmailQuery = $conn->prepare("SELECT COUNT(*) FROM compte_client WHERE email_client = ?");
        $checkEmailQuery->execute([$email]);
        $emailCount = $checkEmailQuery->fetchColumn();

        if ($emailCount > 0) {
            // E-mail déjà utilisé, renvoi d'une erreur
            echo json_encode(['success' => false, 'message' => 'Cette adresse e-mail est déjà utilisée. Veuillez en choisir une autre.']);
        } else {
            // Insérer les nouvelles informations du compte
            $stmt = $conn->prepare("INSERT INTO compte_client (nom_client, prenom_client, email_client, hash_mdp_client) VALUES (?, ?, ?, ?)");
            
            if ($stmt->execute([$nom, $prenom, $email, $mdpHash])) {
                // Compte créé avec succès
                echo json_encode(['success' => true, 'message' => 'Compte créé avec succès !']);
            } else {
                // Erreur lors de l'insertion
                echo json_encode(['success' => false, 'message' => 'Erreur dans l\'ajout de vos coordonnées !']);
            }
        }
    } catch (PDOException $e) {
        // Erreur de base de données
        echo json_encode(['success' => false, 'message' => 'Erreur de requête: ' . $e->getMessage()]);
    }
}
?>
