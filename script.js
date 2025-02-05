function manageScrollAnimations() {
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    function checkElementsVisibility() {
        const elements = document.querySelectorAll('.slide-in');
        elements.forEach(element => {
            if (isElementInViewport(element)) {
                element.classList.add('active');
            } else {
                element.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', checkElementsVisibility);
    window.addEventListener('resize', checkElementsVisibility);
    checkElementsVisibility();
}

function ouvertureFicheDePoste(idFichePoste) {
    if (!window.location.href.includes('personnel.html')) {
        window.location.href = `personnel.html${idFichePoste}`;
    }
    const ficheElement = document.querySelector(idFichePoste);
    ficheElement.style.transform = 'scale(1)';
    document.body.style.overflow = 'hidden';
}

function fermetureFicheDePoste(idFichePoste) {
    const ficheElement = document.querySelector(idFichePoste);
    if (ficheElement) {
        ficheElement.style.transform = 'scale(0)';
        document.body.style.overflow = 'auto';
    }
}


function ouvertureInfosFournisseur(idFournisseurBox) {
    if (!window.location.href.includes('fournisseurs.html')) {
        window.location.href = `fournisseurs.html${idFournisseurBox}`;
    }
    const ficheElement = document.querySelector(idFournisseurBox);
    ficheElement.style.transform = 'scale(1)';
    document.body.style.overflow = 'hidden';
}

function fermetureInfosFournisseur(idFournisseurBox) {
    const ficheElement = document.querySelector(idFournisseurBox);
    if (ficheElement) {
        ficheElement.style.transform = 'scale(0)';
        document.body.style.overflow = 'auto';
    }
}

function ouvertureInfosProduit(idProduit) {
    if (!window.location.href.includes('produits.html')) {
        window.location.href = `produits.html${idProduit}`;
    }
    const ficheElement = document.querySelector(idProduit);
    ficheElement.style.transform = 'scale(1)';
    document.body.style.overflow = 'hidden';
}
function fermetureInfosProduit(idProduit) {
    const ficheElement = document.querySelector(idProduit);
    if (ficheElement) {
        ficheElement.style.transform = 'scale(0)';
        document.body.style.overflow = 'auto';
    }
}


//APPEL AUTOMATIQUE DE FONCTIONS
document.addEventListener('DOMContentLoaded', () => {
    manageScrollAnimations();
    if (window.location.href.includes('personnel.html')) {
        const urlHash = window.location.hash;
        if (urlHash) {
            const ficheElement = document.querySelector(urlHash);
            if (ficheElement) {
                ficheElement.style.transform = 'scale(1)';
                document.body.style.overflow = 'hidden';
            }
        }
    }
    if (window.location.href.includes('fournisseurs.html')) {
        const urlHash = window.location.hash;
        if (urlHash) {
            const ficheElement = document.querySelector(urlHash);
            if (ficheElement) {
                ficheElement.style.transform = 'scale(1)';
                document.body.style.overflow = 'hidden';
            }
        }
    }
    if (window.location.href.includes('produits.html')) {
        const casesACocher = document.querySelectorAll('.checkbox');
        const produits = document.querySelectorAll('#listesProduitsUl > li');

        // Fonction pour filtrer les produits en fonction des cases cochées
        function filtrerProduits() {
            // Crée un tableau des filtres actifs (cases cochées)
            const filtresActifs = Array.from(casesACocher)
                .filter(caseACocher => caseACocher.checked) // Garde seulement les cases cochées
                .map(caseACocher => caseACocher.value.toLowerCase()); // Récupère la valeur de chaque case cochée en minuscules

            // Parcourt chaque produit pour vérifier s'il correspond aux filtres actifs
            produits.forEach(produit => {
                // Récupère les classes du produit
                const classesProduit = Array.from(produit.classList);
                // Vérifie si le produit correspond à au moins un des filtres actifs
                const correspondAuFiltre = filtresActifs.length === 0 || filtresActifs.some(filtre => classesProduit.includes(filtre));

                // Affiche ou masque le produit en fonction de la correspondance avec les filtres
                if (correspondAuFiltre) {
                    produit.style.display = 'block'; // Affiche le produit
                } else {
                    produit.style.display = 'none'; // Masque le produit
                }
            });
        }

        // Ajoute un écouteur d'événement 'change' à chaque case à cocher pour appeler la fonction de filtrage
        casesACocher.forEach(caseACocher => caseACocher.addEventListener('change', filtrerProduits));





        const searchInput = document.getElementById('searchInput');
        const resultatsRecherche = document.getElementById('resultatsRecherche');

        searchInput.addEventListener('keyup', function() {
            const texte = zoneTexte.value.toLowerCase();
            const recherche = searchInput.value.toLowerCase();
            const mots = texte.split(' ');
            const resultats = mots.filter(mot => mot.includes(recherche));

            resultatsRecherche.innerHTML = ''; // Efface les résultats précédents
            resultats.forEach(mot => {
                const div = document.createElement('div');
                div.textContent = mot;
                resultatsRecherche.appendChild(div);
            });
        });
    }
});

