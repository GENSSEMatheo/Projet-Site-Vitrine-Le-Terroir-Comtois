<?php
include_once "./connexionBDD.php";
$conn = donneConnexionBDD();

$htmlFile = __DIR__ . '/../produits.html';
$html = @file_get_contents($htmlFile);
if ($html === false) {
    die(json_encode(['success' => false, 'message' => "Erreur : Impossible de lire le fichier HTML."]));
}

libxml_use_internal_errors(true);
$dom = new DOMDocument();
@$dom->loadHTML($html);
libxml_clear_errors();

$xpath = new DOMXPath($dom);
$liElements = $xpath->query('//ul[@id="listesProduitsUl"]/li');

foreach ($liElements as $li) {
    $classTypePrecis = $li->getAttribute('class'); // Classe du <li>

    $imageTag = $li->getElementsByTagName('img')->item(0);
    $image = $imageTag ? $imageTag->getAttribute('src') : '';
    $classTypeGlob = $imageTag ? $imageTag->getAttribute('class') : ''; // Classe du <img>

    $pTags = $li->getElementsByTagName('p');
    $producteur = $pTags->item(0)?->textContent ?? '';

    $nomProduit = $li->getElementsByTagName('h2')->item(0)?->textContent ?? '';
    $prixTexte = $li->getElementsByTagName('h3')->item(0)?->textContent ?? '';

    // Nettoyage du prix
    $prix = 0.0;
    if (preg_match('/([0-9]+(?:[,.][0-9]+)?)/', $prixTexte, $matches)) {
        $prix = floatval(str_replace(',', '.', $matches[1]));
    }

    // Extraction de l’ID
    $button = $li->getElementsByTagName('button')->item(0);
    $onclick = $button ? $button->getAttribute('onclick') : '';
    preg_match("/#infosProd(.*?)'/", $onclick, $idMatches);
    $id_prod = $idMatches[1] ?? '';

    if (empty($id_prod)) {
        echo "Produit ignoré (ID non trouvé)<br>";
        continue;
    }

    // Vérification et insertion
    try {
        $check = $conn->prepare("SELECT 1 FROM stocks_total_actuel WHERE id_prod = ?");
        $check->execute([$id_prod]);

        if (!$check->fetch()) {
            $insert = $conn->prepare("
                INSERT INTO stocks_total_actuel (
                    id_prod, nom_prod, producteur, prix, image, 
                    classTypeGlob, classTypePrecis, quantite_restante
                ) VALUES (?, ?, ?, ?, ?, ?, ?, 10)
            ");
            $insert->execute([
                $id_prod, $nomProduit, $producteur, $prix, $image,
                $classTypeGlob, $classTypePrecis
            ]);
            echo "Ajouté : $id_prod ($nomProduit) - $prix € - Glob: $classTypeGlob / Précis: $classTypePrecis<br>";
        } else {
            echo "Déjà présent : $id_prod<br>";
        }
    } catch (PDOException $e) {
        echo "Erreur DB pour $id_prod : " . $e->getMessage() . "<br>";
    }
}

echo "Traitement terminé.";
?>
