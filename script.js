// 🔄 Scroll Animations
function manageScrollAnimations() {
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
        );
    }

    function checkElementsVisibility() {
        document.querySelectorAll('.slide-in').forEach(element => {
            element.classList.toggle('active', isElementInViewport(element));
        });
    }

    window.addEventListener('scroll', checkElementsVisibility);
    window.addEventListener('resize', checkElementsVisibility);
    checkElementsVisibility();
}

// ⬆ Bouton retour en haut
function retourHautPage() {
    let bouton = document.getElementById("btnRetourHaut");

    if (!bouton) {
        bouton = document.createElement("button");
        bouton.id = "btnRetourHaut";
        bouton.innerText = "⬆ Haut de page";
        document.body.appendChild(bouton);

        Object.assign(bouton.style, {
            position: "fixed",
            bottom: "20px",
            right: "-1000px",
            padding: "10px 15px",
            fontSize: "16px",
            backgroundColor: "#aa7d00",
            color: "white",
            border: "solid 1px white",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "right 0.5s ease-in-out",
            zIndex: "1000"
        });

        bouton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    }

    bouton.style.right = window.scrollY > 0 ? "20px" : "-1000px";
}

// 📂 Ouverture/Fermeture Fiche (générique)
function toggleFiche(id, ouvrir = true) {
    const fiche = document.querySelector(id);
    if (!fiche) return;

    fiche.style.transform = ouvrir ? 'scale(1)' : 'scale(0)';
    document.body.style.overflow = ouvrir ? 'hidden' : 'auto';
}

// 🎯 Ouvertures spécifiques
function ouvertureFicheDePoste(id) {
    if (!window.location.href.includes('personnel.html')) {
        window.location.href = `personnel.html${id}`;
    }
    toggleFiche(id, true);
}
function fermetureFicheDePoste(id) {
    toggleFiche(id, false);
}
function ouvertureInfosFournisseur(id) {
    if (!window.location.href.includes('fournisseurs.html')) {
        window.location.href = `fournisseurs.html${id}`;
    }
    toggleFiche(id, true);
}
function fermetureInfosFournisseur(id) {
    toggleFiche(id, false);
}
function ouvertureInfosProduit(id) {
    toggleFiche(id, true);
}
function fermetureInfosProduit(id) {
    toggleFiche(id, false);
}

// 📂 Navigation & Menu
let navOpen = true;
function manageNavOpenClose() {
    const navbar = document.getElementById('navGlob');
    const contenu = document.getElementById('contenu');
    const fleche = document.getElementById('flecheNav');

    if (navOpen) {
        navbar.style.marginLeft = '-22%';
        contenu.style.width = '97%';
        contenu.style.marginLeft = '3%';
        fleche.style.transform = 'rotate(180deg)';
    } else {
        navbar.style.marginLeft = '0%';
        contenu.style.width = '80%';
        contenu.style.marginLeft = '20%';
        fleche.style.transform = 'rotate(0deg)';
    }

    navOpen = !navOpen;
}

let burgerMenuTurn = true;
function burgerMenuClic() {
    const burger = document.getElementById('burgerMenu');
    const nav = document.getElementById('navGlob');
    const menu = document.getElementById('menuGlob');
    const fleche = document.getElementById('flecheNav');

    burger.style.transform = burgerMenuTurn ? 'rotate(90deg)' : 'rotate(0deg)';
    fleche.style.display = burgerMenuTurn ? 'none' : 'flex';
    document.body.style.overflowY = burgerMenuTurn ? 'hidden' : 'scroll';
    nav.style.bottom = burgerMenuTurn ? '0%' : '100%';
    nav.style.overflowY = burgerMenuTurn ? 'auto' : 'hidden';
    menu.style.overflowY = burgerMenuTurn ? 'auto' : 'hidden';

    burgerMenuTurn = !burgerMenuTurn;
}

// 🛒 Ajout au panier
function ajouterAuPanier(idProduit) {
    if (sessionStorage.getItem('connexion_reussie') !== 'true') {
        // Si l'utilisateur n'est pas connecté, on crée et affiche une fenêtre/modal avec une croix pour la fermer.
        let messageDemandeConnection = document.createElement("div");
        messageDemandeConnection.id = "messageDemandeConnection";
        document.body.appendChild(messageDemandeConnection);
    
        // Contenu du message à afficher
        messageDemandeConnection.innerHTML = `
            <div id="messageContent">
                <span id="closeMessage" style="cursor: pointer; color: white; font-size: 30px; font-weight: bold; position: absolute; top: 10px; right: 10px;">&times;</span>
                <p>Vous devez vous connecter pour continuer.</p>
                <button id="redirectToLogin" style="background-color: #aa7d00; color: white; border: none; padding: 15px 25px; cursor: pointer; border-radius: 5px; font-size: 18px;">Se connecter</button>
            </div>
        `;
    
        // Style du message
        Object.assign(messageDemandeConnection.style, {
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Fond semi-transparent
            color: "white",                         // Texte en blanc
            padding: "10px",                        // Un peu de padding autour du texte
            position: "fixed",                      // Fixer le message en haut de la page
            top: "0",                               // Placer en haut
            left: "0",                              // Placer à gauche
            right: "0",                             // Placer à droite
            bottom: "0",                            // Placer en bas
            display: "flex",                        // Utiliser flexbox pour centrer le contenu
            justifyContent: "center",               // Centrer horizontalement
            alignItems: "center",                   // Centrer verticalement
            zIndex: "1000",                         // Placer au-dessus des autres éléments
        });
    
        // Style du contenu du message
        const messageContent = document.getElementById("messageContent");
        messageContent.style.position = "relative";  // Pour permettre la position du bouton "fermer"
        messageContent.style.padding = "30px";
        messageContent.style.backgroundColor = "#333";
        messageContent.style.borderRadius = "10px";
        messageContent.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.6)";
        messageContent.style.fontSize = "20px"; // Texte un peu plus grand
    
        // Fonction pour fermer la fenêtre/modal
        document.getElementById("closeMessage").addEventListener("click", function() {
            messageDemandeConnection.style.display = "none";  // Masquer la fenêtre
        });
    
        // Fonction pour rediriger vers la page de connexion
        document.getElementById("redirectToLogin").addEventListener("click", function() {
            window.location.href = 'connexionCompte.html';  // Rediriger vers la page de connexion
        });
        mettreAJourQuantitePanier();
        return; // Ne pas ajouter l'article au panier, car l'utilisateur n'est pas connecté.
    }

    

    fetch('ajoutPanier.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id_produit: idProduit,
            id_client: sessionStorage.getItem('user_id')
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            afficherMessageAjout();
            if (window.location.href.includes('monpanier.html')) afficherPanier();
        } else {
            alert('Erreur: ' + data.message);
        }
    })
    .catch(() => alert('Erreur lors de l\'ajout au panier'));
}

function afficherMessageAjout() {
    let message = document.getElementById("messageAjout") || document.createElement("div");
    message.id = "messageAjout";
    document.body.appendChild(message);

    message.innerText = "1 article ajouté au panier";
    Object.assign(message.style, {
        position: "fixed",
        top: "10px",
        right: "40px",
        padding: "10px 15px",
        fontSize: "16px",
        backgroundColor: "#aa7d00",
        color: "white",
        borderRadius: "5px",
        zIndex: "1000",
        transition: "opacity 0.5s ease-in-out",
        opacity: "1"
    });

    setTimeout(() => { message.style.opacity = "0"; }, 2000);
}
// 🧾 Affichage Panier
function afficherPanier() {
    const id = sessionStorage.getItem('user_id');
    const prenom = sessionStorage.getItem('user_prenom');
    const cadre = document.getElementById('cadrePanier');
    cadre.style.backgroundColor = '#aa7d00';
    cadre.style.color = 'white';
    cadre.style.textAlign = 'center';
    cadre.style.borderTop = 'solid black';
    cadre.style.borderBottom = 'solid black';
    cadre.style.padding = '2vh';
    cadre.style.margin = '0';

    const liste = document.getElementById('listesProduitsUl');

    if (!id) {
        cadre.style.display = 'block';
        cadre.innerHTML = "Connectez-vous pour voir votre panier<br><a href='connexionCompte.html' id='loginLink' style='color:black;'>Me connecter</a>";
        return;
    }

    fetch('obtenirPanier.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_client: id })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error || data.message || data.length === 0) {
            cadre.innerHTML = data.message || `Votre panier est vide ${prenom ?? ''}`;
            return;
        }

        // On vide la liste des produits avant de la remplir
        liste.innerHTML = '';

        data.forEach(item => {
            const prix = parseFloat(item.prix) || 0;
            const quantite = parseInt(item.quantite) || 0;
            const total = prix * quantite;

            const produitHTML = `
                <li>
                    <img src="${item.image}" alt="${item.nom}">
                    <p>${item.producteur}</p>
                    <h2>${item.nom}</h2>
                    <p>Prix à l'unité</p>
                    <h3>${prix.toFixed(2)}€</h3>
                    <p>Quantité : ${quantite}</p>
                    <p>Total : ${total.toFixed(2)}€</p>
                    <button style='background-color:#aa7d00;color:white;border-radius:100%;font-size:2rem;width:2vw;height:2vw' onclick="modifierQuantite('${item.id_prod}', -1)">-</button>
                    <button style='background-color:#aa7d00;color:white;border-radius:100%;font-size:2rem;width:2vw;height:2vw' onclick="modifierQuantite('${item.id_prod}', 1)">+</button>
                </li>`;

            // Ajouter le produit dans la liste
            liste.innerHTML += produitHTML;
        });
    })
    .catch(() => {
        cadre.innerHTML = 'Erreur de chargement, veuillez réessayer plus tard.';
    });
}

// Fonction pour modifier la quantité du produit dans le panier
function modifierQuantite(id, variation) {
    fetch('modifierPanier.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id_client: sessionStorage.getItem('user_id'),
            id_produit: id,
            variation
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) afficherPanier();
        else alert('Erreur lors de la modification du panier');
    })
    .catch(console.error);
    mettreAJourQuantitePanier();
}


// 🔍 Recherche & Filtres
function searchFunction() {
    const input = document.getElementById("searchBar").value.toLowerCase();
    document.querySelectorAll("#listesProduitsUl li").forEach(item => {
        item.style.display = item.innerText.toLowerCase().includes(input) ? "" : "none";
    });
}

function updatePriceValue(value) {
    document.getElementById("priceValue").textContent = value;
    filterByPrice(value);
}

function filterByPrice(max) {
    document.querySelectorAll("#listesProduitsUl li").forEach(item => {
        const price = parseFloat(item.querySelector("h3")?.innerText.replace("€", "").replace(",", ".").trim()) || 0;
        item.style.display = price <= max ? "" : "none";
    });
}
// Fonction pour mettre à jour la quantité du panier dans le menu
function mettreAJourQuantitePanier() {
    const idClient = sessionStorage.getItem('user_id');  // On récupère l'ID client depuis sessionStorage

    if (!idClient) {
        document.getElementById('numPanier').textContent = '0';  // Si non connecté, panier = 0
        return;
    }

    // Récupérer la quantité d'articles dans le panier depuis le serveur
    fetch('getQuantitePanier.php?id_client=' + idClient)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Met à jour la quantité d'articles dans le panier
                document.getElementById('numPanier').textContent = data.totalQuantite;
            } else {
                console.error('Erreur de récupération de la quantité du panier');
            }
        })
        .catch(error => {
            console.error('Erreur de communication avec le serveur :', error);
        });
}

// 📡 Init on page load
document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener("scroll", retourHautPage);
    manageScrollAnimations();

    if (sessionStorage.getItem('connexion_reussie') === 'true') {
        document.getElementById('loginLink').style.display = 'none';
        const logout = document.getElementById('logoutLink');
        logout.style.display = 'block';
        logout.innerHTML = "Déconnecter " + sessionStorage.getItem("user_prenom");
        logout.addEventListener('click', e => {
            e.preventDefault();
            sessionStorage.clear();
            window.location.href = window.location.pathname;
        });
    }

    if (window.location.href.includes('monpanier.html')) afficherPanier();

    // Gestion des fiches ouvertes via hash dans l'URL
    const hash = window.location.hash;
    if (hash && (window.location.href.includes('personnel.html') || window.location.href.includes('fournisseurs.html'))) {
        toggleFiche(hash, true);
    }

    // Filtres produits
    if (window.location.href.includes('produits.html')) {
        const checkboxes = document.querySelectorAll('.checkbox');
        const produits = document.querySelectorAll('#listesProduitsUl > li');

        function filtrerProduits() {
            const filtres = Array.from(checkboxes)
                .filter(c => c.checked)
                .map(c => c.value.toLowerCase());

            produits.forEach(produit => {
                const matches = filtres.length === 0 || filtres.some(f => produit.classList.contains(f));
                produit.style.display = matches ? 'block' : 'none';
            });
        }

        checkboxes.forEach(c => c.addEventListener('change', filtrerProduits));

        // Recherche avancée (corrigée)
        const input = document.getElementById('searchInput');
        const resultats = document.getElementById('resultatsRecherche');
        input.addEventListener('keyup', () => {
            const recherche = input.value.toLowerCase();
            const mots = input.value.toLowerCase().split(' ');
            resultats.innerHTML = mots
                .filter(mot => mot.includes(recherche))
                .map(mot => `<div>${mot}</div>`)
                .join('');
        });
    }


});
mettreAJourQuantitePanier();
// Met à jour la BDD (appel silencieux)
fetch('majBDD.php')
    .then(res => res.text())
    .then(console.log);