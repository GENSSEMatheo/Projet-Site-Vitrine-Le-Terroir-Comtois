<?php
// Vérifier si le formulaire a été soumis
if (isset($_SERVER["REQUEST_METHOD"]) && $_SERVER["REQUEST_METHOD"] == "POST") {
    // Récupérer les données du formulaire
    $nom = trim($_POST["nom"] ?? '');
    $email = trim($_POST["email"] ?? '');
    $message = trim($_POST["message"] ?? '');

    // Vérification des champs
    if (empty($nom) || empty($email) || empty($message)) {
        echo "Tous les champs sont obligatoires.";
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "L'adresse e-mail est invalide.";
        exit;
    }

    // Adresse e-mail où envoyer le message
    $destinataire = "leterroircomtois25@gmail.com";

    // Sujet de l'e-mail
    $sujet = "Nouveau message depuis le formulaire de contact de Le Terroir Comtois'";

    // Construire le corps de l'e-mail
    $corps_message = $message;

    // En-têtes de l'e-mail
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    // Envoyer l'e-mail
    if (mail($destinataire, $sujet, $corps_message, $headers)) {
        echo "Votre message a été envoyé avec succès.";
    } else {
        echo "Une erreur s'est produite lors de l'envoi du message.";
    }
} else {
    // Redirectionner si le formulaire n'a pas été soumis
    header("Location: index.html");
    exit;
}
?>
