<?php
/* **********************************************
 * ÉTAPE 1 : CONNEXION À LA BASE DE DONNÉES
 * **********************************************
 * La connexion à la base de données permet d'utiliser PDO (PHP Data Objects) pour interagir avec la base.
 * On utilise ici 'localhost' pour la base hébergée localement, 'db_terroircomtois' pour le nom de la base,
 * 'root' comme utilisateur, et aucun mot de passe.
 */
$pdo = new PDO('mysql:host=localhost;dbname=db_terroircomtois', 'root', '');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

/* **********************************************
 * ÉTAPE 2 : LECTURE DU FICHIER HTML
 * **********************************************
 * Le fichier 'produits.html' contient les informations des produits.
 * On utilise 'file_get_contents' pour charger son contenu dans une variable.
 */
$html = file_get_contents(__DIR__.'/produits.html');
if (!$html) {
    die("Erreur : Impossible de lire le fichier HTML.");
}

/* **********************************************
 * ÉTAPE 3 : ANALYSE DU HTML
 * **********************************************
 * Pour analyser le contenu HTML et naviguer dans sa structure, on utilise DOMDocument.
 * La fonction '@loadHTML' ignore les avertissements pour des HTML mal formés.
 */
$dom = new DOMDocument();
@$dom->loadHTML($html);

/* **********************************************
 * ÉTAPE 4 : RÉCUPÉRATION DES PRODUITS
 * **********************************************
 * On parcourt toutes les 'div' du fichier HTML pour trouver celles contenant la classe 'infosProdGlob'.
 * Ces 'div' sont identifiées comme contenant les informations des produits.
 */
$products = $dom->getElementsByTagName('div');
foreach ($products as $div) {
    if (str_contains($div->getAttribute('class'), 'infosProdGlob')) {
        
        // Récupérer l'ID unique du produit (par exemple, 'infosProdarboisChardonnay2020Tissot')
        $productId = $div->getAttribute('id');
        if (empty($productId)) {
            continue; // Si l'ID est vide, on passe au produit suivant
        }

        /* **********************************************
         * RÉCUPÉRATION DES INFORMATIONS PRINCIPALES
         * **********************************************
         * On cherche dans la partie gauche, plus précisément dans 'infosPrincipalesPartieGauche',
         * pour obtenir le nom, le producteur et le prix du produit.
         */
        $infosPrincipales = $div->getElementsByTagName('div');
        foreach ($infosPrincipales as $subDiv) {
            if ($subDiv->getAttribute('id') === 'infosPrincipalesPartieGauche') {
                
                // Récupération des données : nom, producteur, prix
                $nomProduit = $subDiv->getElementsByTagName('h2')->item(0)->textContent ?? '';
                $producteur = $subDiv->getElementsByTagName('h3')->item(0)->textContent ?? '';
                $prixTexte = $subDiv->getElementsByTagName('p')->item(0)->textContent ?? '';

                // Extraction du prix dans différents formats
                preg_match('/Prix[^0-9]*([0-9,.]+)[^0-9]*€/', $prixTexte, $matches);
                $prix = isset($matches[1]) ? floatval(str_replace(',', '.', $matches[1])) : 0.0;


                /* **********************************************
                 * INSERTION EN BASE DE DONNÉES
                 * **********************************************
                 * Si le produit n'existe pas déjà, on l'ajoute à la base avec une quantité par défaut (10).
                 */
                try {
                    // Vérification si le produit existe déjà dans la base
                    $exists = $pdo->prepare("SELECT 1 FROM stocks_total_actuel WHERE id_prod = ?");
                    $exists->execute([$productId]);

                    if (!$exists->fetch()) {
                        // Insertion du produit dans la base
                        $insert = $pdo->prepare("
                            INSERT INTO stocks_total_actuel (id_prod, nom_prod, producteur, prix, quantite_restante) 
                            VALUES (?, ?, ?, ?, 10)
                        ");
                        $insert->execute([$productId, $nomProduit, $producteur, $prix]);
                        echo "Ajouté : $productId ($nomProduit)<br>";
                    }
                } catch (PDOException $e) {
                    echo "Erreur lors de l'insertion du produit $productId : ".$e->getMessage()."<br>";
                }
            }
        }
    }
}

/* **********************************************
 * ÉTAPE 5 : FIN DU PROGRAMME
 * **********************************************
 * Une fois le traitement terminé, on affiche un message indiquant la fin.
 */
echo "Traitement terminé avec succès.";
?>
