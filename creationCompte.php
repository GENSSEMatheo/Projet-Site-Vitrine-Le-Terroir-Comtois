<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nom = strtoupper($_POST['nom']);
    $prenom = strtoupper($_POST['prenom'][0]).strtolower(substr($_POST['prenom'], 1));
    $email = $_POST['email'];
    $mdp = password_hash($_POST['mdp'], PASSWORD_BCRYPT);

    // Connexion à la base de données
    $conn = new mysqli('localhost', 'root', '', 'db_terroircomtois');
    // Vérifier la connexion
    if ($conn->connect_error) {
        die('Erreur de connexion : ' . $conn->connect_error);
    }

    // Vérifier si l'adresse e-mail existe déjà
    $checkEmailQuery = $conn->prepare("SELECT COUNT(*) FROM compte_client WHERE email_client = ?");
    $checkEmailQuery->bind_param("s", $email);
    $checkEmailQuery->execute();
    $checkEmailQuery->bind_result($emailCount);
    $checkEmailQuery->fetch();
    $checkEmailQuery->close();

    if ($emailCount > 0) {
        echo "<script>
                alert('Cette adresse e-mail est déjà utilisée. Veuillez en choisir une autre.');
                window.location.href='creationCompte.html';
              </script>";
    } else {
        $stmt = $conn->prepare("INSERT INTO compte_client (nom_client, prenom_client, email_client, hash_mdp_client) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $nom, $prenom, $email, $mdp);

        if ($stmt->execute()) {
            echo "<script>
                    alert('Compte créé avec succès !');
                    window.location.href='index.html';
                  </script>";
        } else {
            echo "<script>
                    alert('Erreur dans l'ajout de vos coordonnées !');
                    window.location.href='creationCompte.html';
                  </script>";
        }

        $stmt->close();
    }

    $conn->close();
}
?>
