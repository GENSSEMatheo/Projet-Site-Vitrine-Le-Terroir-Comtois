<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Connexion à la base de données
    $conn = new mysqli('localhost', 'root', '', 'db_terroircomtois');
    // Vérifier la connexion
    if ($conn->connect_error) {
        die('Erreur de connexion : ' . $conn->connect_error);
    }

    // Préparer et exécuter la requête pour obtenir les informations de l'utilisateur
    $stmt = $conn->prepare("SELECT hash_mdp_client FROM compte_client WHERE email_client = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->bind_result($hash_mdp_client);
    $stmt->fetch();
    $stmt->close();

    // Vérifier le mot de passe
    if (password_verify($password, $hash_mdp_client)) {
        echo "<script>
                alert('Connexion réussie !');
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
