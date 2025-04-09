<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Récupération et validation des données
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $password = $_POST['password'] ?? '';

    // Validation de l'email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Email invalide']);
        exit;
    }

    if (empty($password)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Mot de passe requis']);
        exit;
    }

    require_once "connexionBDD.php";
    $conn = donneConnexionBDD();

    try {
        // Préparation de la requête
        $stmt = $conn->prepare("SELECT id_client, prenom_client, hash_mdp_client FROM compte_client WHERE email_client = ?");
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Erreur de préparation de la requête']);
            exit;
        }

        // Exécution de la requête avec les paramètres sécurisés
        $stmt->execute([$email]);

        // Récupération des résultats
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // Vérification du mot de passe
        if ($user && password_verify($password, $user['hash_mdp_client'])) {
            // Démarrer la session si ce n'est pas déjà fait
            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }

            // Sécuriser la session
            session_regenerate_id(true);

            // Informations à stocker en session ou localStorage
            $_SESSION['user_id'] = $user['id_client'];
            $_SESSION['user_prenom'] = $user['prenom_client'];

            // Redirection JavaScript
            echo "<script>
                    alert('Connexion réussie !');
                    sessionStorage.setItem('connexion_reussie', 'true');
                    sessionStorage.setItem('user_id', '".$user['id_client']."');
                    sessionStorage.setItem('user_prenom', '".$user['prenom_client']."');
                    window.location.href='index.html';
                  </script>";
        } else {
            http_response_code(401);
            echo "<script>
                    alert('Adresse e-mail ou mot de passe incorrect.');
                    window.location.href='connexionCompte.html';
                  </script>";
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Erreur de requête: ' . $e->getMessage()]);
    }
}
?>
