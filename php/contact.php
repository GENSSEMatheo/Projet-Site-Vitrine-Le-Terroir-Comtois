<?php
// Vérifier si le formulaire a été soumis
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Récupérer les données du formulaire
    $nom = trim($_POST["nom"] ?? '');
    $email = trim($_POST["email"] ?? '');
    $message = trim($_POST["message"] ?? '');

    // Vérification des champs
    if (empty($nom) || empty($email) || empty($message)) {
        http_response_code(400); // Code 400 pour mauvaise requête
        echo json_encode(["success" => false, "message" => "Tous les champs sont obligatoires."]);
        exit;
    }

    // Validation de l'email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "L'adresse e-mail est invalide."]);
        exit;
    }

    // Adresse e-mail où envoyer le message
    $destinataire = "leterroircomtois25@gmail.com";

    // Sujet de l'e-mail
    $sujet = "Nouveau message depuis le formulaire de contact de Le Terroir Comtois";

    // Construire le corps de l'e-mail avec un format HTML (optionnel)
    $corps_message = "<strong>Nom :</strong> $nom<br><br>";
    $corps_message .= "<strong>Email :</strong> $email<br><br>";
    $corps_message .= "<strong>Message :</strong><br>$message";

    // En-têtes de l'e-mail
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n"; // Utilisation de HTML pour le message
    $headers .= "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";

    // Envoyer l'e-mail
    if (mail($destinataire, $sujet, $corps_message, $headers)) {
        echo json_encode(["success" => true, "message" => "Votre message a été envoyé avec succès."]);
    } else {
        http_response_code(500); // Code 500 pour erreur serveur
        echo json_encode(["success" => false, "message" => "Une erreur s'est produite lors de l'envoi du message."]);
    }
} else {
    // Si le formulaire n'a pas été soumis, rediriger l'utilisateur
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Accès interdit."]);
    exit;
}
?>
