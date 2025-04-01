<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Récupération et validation des données
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $password = $_POST['password'];

    // Validation de l'email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die(json_encode(['success' => false, 'message' => 'Email invalide']));
    }

    // Connexion à la base de données
    $conn = new mysqli('localhost', 'root', '', 'db_terroircomtois');
    
    // Vérifier la connexion
    if ($conn->connect_error) {
        die(json_encode(['success' => false, 'message' => 'Erreur de connexion à la base de données']));
    }

    // Requête pour obtenir les informations de l'utilisateur
    $stmt = $conn->prepare("SELECT id_client, hash_mdp_client FROM compte_client WHERE email_client = ?");
    if (!$stmt) {
        die(json_encode(['success' => false, 'message' => 'Erreur de préparation de la requête']));
    }

    $stmt->bind_param("s", $email);
    if (!$stmt->execute()) {
        die(json_encode(['success' => false, 'message' => 'Erreur d\'exécution de la requête']));
    }

    $stmt->bind_result($id_client, $hash_mdp_client);
    $user_exists = $stmt->fetch();
    $stmt->close();

    // Vérification du mot de passe
    if ($user_exists && password_verify($password, $hash_mdp_client)) {
        // Démarrer la session si ce n'est pas déjà fait
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        // Stocker l'ID du client en session
        $_SESSION['user_id'] = $id_client;
        
        echo "<script>
                alert('Connexion réussie !');
                sessionStorage.setItem('connexion_reussie', 'true');
                sessionStorage.setItem('user_id', '".$id_client."');
                window.location.href='index.html';
              </script>";
    } else {
        echo "<script>
                alert('Adresse e-mail ou mot de passe incorrect.');
                window.location.href='connexionCompte.html';
              </script>";
    }

    $conn->close();
}
?>