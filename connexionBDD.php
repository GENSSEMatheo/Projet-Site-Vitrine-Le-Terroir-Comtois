<?php

function donneConnexionBDD()
{
    static $conn = null;

    if ($conn === null) {
        $dsn = 'mysql:host=localhost;dbname=db_terroircomtois;charset=utf8';
        $utilisateur = 'root';
        $motDePasse = '';

        try {
            $conn = new PDO($dsn, $utilisateur, $motDePasse, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Erreur de connexion à la base de données.'
            ]);
            exit;
        }
    }

    return $conn;
}
?>
