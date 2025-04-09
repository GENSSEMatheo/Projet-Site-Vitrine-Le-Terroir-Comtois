<?php
/* **********************************************
 * ÉTAPE 1 : CONNEXION À LA BASE DE DONNÉES
 * **********************************************/
include_once "./connexionBDD.php";
$conn = donneConnexionBDD();

/* **********************************************
 * ÉTAPE 2 : LECTURE DU FICHIER HTML
 * **********************************************/
$htmlFile = __DIR__ . '/produits.html';
$html = @file_get_contents($htmlFile);
if ($html === false) {
    die(json_encode(['success' => false, 'message' => "Erreur : Impossible de lire le fichier HTML."]));
}

/* **********************************************
 * ÉTAPE 3 : ANALYSE DU HTML
 * **********************************************/
$dom = new DOMDocument();
libxml_use_internal_errors(true); // Désactive les erreurs de libxml
@$dom->loadHTML($html);
libxml_clear_errors();

/* **********************************************
 * ÉTAPE 4 : RÉCUPÉRATION DES PRODUITS
 * **********************************************/
$products = $dom->getElementsByTagName('div');
foreach ($products as $div) {
    if (str_contains($div->getAttribute('class'), 'infosProdGlob')) {

        // Récupérer l'ID unique du produit sans le préfixe 'infosProd'
        $productId = str_replace('infosProd', '', $div->getAttribute('id'));
        if (empty($productId)) {
            continue; // Si l'ID est vide, on passe au produit suivant
        }

        /* **********************************************
         * RÉCUPÉRATION DES INFORMATIONS PRINCIPALES
         * **********************************************/
        $infosPrincipales = $div->getElementsByTagName('div');
        foreach ($infosPrincipales as $subDiv) {
            if ($subDiv->getAttribute('id') === 'infosPrincipalesPartieGauche') {

                // Récupération des données : nom, producteur, prix
                $nomProduit = trim($subDiv->getElementsByTagName('h2')->item(0)->textContent ?? '');
                $producteur = trim($subDiv->getElementsByTagName('h3')->item(0)->textContent ?? '');
                $prixTexte = trim($subDiv->getElementsByTagName('p')->item(0)->textContent ?? '');

                // Extraction du prix dans différents formats
                preg_match('/Prix[^0-9]*([0-9,.]+)[^0-9]*€/', $prixTexte, $matches);
                $prix = isset($matches[1]) ? floatval(str_replace(',', '.', $matches[1])) : 0.0;

                /* **********************************************
                 * GÉNÉRATION DU CHEMIN DE L'IMAGE
                 * **********************************************/
                $image = 'Images/Produits/' . $productId . '.jpg';

                /* **********************************************
                 * INSERTION EN BASE DE DONNÉES
                 * **********************************************/
                try {
                    // Vérification si le produit existe déjà dans la base
                    $exists = $conn->prepare("SELECT 1 FROM stocks_total_actuel WHERE id_prod = ?");
                    $exists->execute([$productId]);

                    if (!$exists->fetch()) {
                        // Insertion du produit dans la base
                        $insert = $conn->prepare("
                            INSERT INTO stocks_total_actuel (id_prod, nom_prod, producteur, prix, image, quantite_restante) 
                            VALUES (?, ?, ?, ?, ?, 10)
                        ");
                        $insert->execute([$productId, $nomProduit, $producteur, $prix, $image]);
                        echo "Ajouté : $productId ($nomProduit) avec l'image $image<br>";
                    }
                } catch (PDOException $e) {
                    echo "Erreur lors de l'insertion du produit $productId : " . $e->getMessage() . "<br>";
                }
            }
        }
    }
}

/* **********************************************
 * ÉTAPE 5 : FIN DU PROGRAMME
 * **********************************************/
echo "Traitement terminé avec succès.";
?>
