function manageScrollAnimations() {
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight));
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

function retourHautPage() {
    let boutonHaut = document.getElementById("btnRetourHaut");

    if (!boutonHaut) {
        boutonHaut = document.createElement("button");
        boutonHaut.innerText = "⬆ Haut de page";
        boutonHaut.id = "btnRetourHaut";
        document.body.appendChild(boutonHaut);

        Object.assign(boutonHaut.style, {
            position: "fixed",
            bottom: "20px",
            right: "-1000px",
            padding: "10px 15px",
            fontSize: "16px",
            backgroundColor: "#aa7d00",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "right 0.5s ease-in-out",
            zIndex: "1000"
        });


        boutonHaut.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    if (window.scrollY > 0) {
        boutonHaut.style.right = "20px";
    } else {
        boutonHaut.style.right = "-1000px";
    }
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

let navOpen = true;
function manageNavOpenClose() {
    const navbar = document.getElementById('navGlob');
    const contenu = document.getElementById('contenu');
    const fleche = document.getElementById('flecheNav');

    if (navOpen) {
        navbar.style.marginLeft = '-22%';
        navbar.style.padding = '4%';
        contenu.style.width = '97%';
        contenu.style.marginLeft = '3%';
        fleche.style.transform = 'rotate(180deg)'
    } else {
        navbar.style.marginLeft = '0%';
        navbar.style.padding = '1%';
        contenu.style.width = '80%';
        contenu.style.marginLeft = '20%';
        fleche.style.transform = 'rotate(0deg)'
    }

    navOpen = !navOpen;
}


let burgerMenuTurn = true;
function burgerMenuClic() {
    const burgerMenu = document.getElementById('burgerMenu');
    const navGlob = document.getElementById('navGlob');
    const menuGlob = document.getElementById('menuGlob');
    const flecheNav = document.getElementById('flecheNav');
    if (burgerMenuTurn) {
        flecheNav.style.display = 'none';
        burgerMenu.style.transform = 'rotate(90deg)';
        document.body.style.overflowY = 'hidden';
        navGlob.style.overflowY = 'auto';
        menuGlob.style.overflowY = 'auto';
        navGlob.style.bottom = '0%';
    } else {
        burgerMenu.style.transform = 'rotate(0deg)';
        document.body.style.overflowY = 'scroll';
        navGlob.style.overflowY = 'hidden';
        menuGlob.style.overflowY = 'hidden';
        navGlob.style.bottom = '100%';
        flecheNav.style.display = 'flex';
    }
    burgerMenuTurn = !burgerMenuTurn;
}

function obtenirSessionStorageJSON(cle) {
    let data = sessionStorage.getItem(cle);
    if (data) {
        return JSON.parse(data)
    } else {
        return [];
    }
}

function ajouterAuPanier(idElement) {
    let nomProd = idElement.substring(11);
    let images = document.querySelectorAll("img");
    let liParent = null;

    for (let img of images) {
        if (img.src.includes(nomProd)) {
            liParent = img.closest("li");
            break;
        }
    }

    let contenuPanierSession = obtenirSessionStorageJSON("articlesStockeSession");

    let produit = {
        id: idElement,
        contenu: liParent.outerHTML
    };

    contenuPanierSession.push(produit);
    sessionStorage.setItem("articlesStockeSession", JSON.stringify(contenuPanierSession));

    console.log("Produit ajouté au panier :", produit);
    mettreAJourCompteurPanier()

    boutonAjoutPanier = document.createElement("button");
    boutonAjoutPanier.innerText = "1 article ajouté à votre panier";
    boutonAjoutPanier.id = "btnAjoutPanier";
    document.body.appendChild(boutonAjoutPanier);

    Object.assign(boutonAjoutPanier.style, {
        position: "fixed",
        top:"-1000px",
        right: "40px",
        padding: "10px 15px",
        fontSize: "16px",
        backgroundColor: "#aa7d00",
        color: "white",
        border: "none",
        cursor: "pointer",
        transition: "top 0.5s ease-in-out",
        zIndex: "1000"
    });
    boutonAjoutPanier.style.top="0px";
    console.log("Début");
    setTimeout(() => {
        boutonAjoutPanier.style.top="-1000px";
    }, 2000);



}






function afficherPanier() {
    let contenuPanierSession = obtenirSessionStorageJSON("articlesStockeSession");
    let listeProduits = document.getElementById("listesProduitsUl");
    listeProduits.innerHTML = "";

    contenuPanierSession.forEach(produit => {
        let wrapper = document.createElement("div");
        wrapper.innerHTML = produit.contenu;


        while (wrapper.firstChild) {
            listeProduits.appendChild(wrapper.firstChild);
        }
    });

    mettreAJourCompteurPanier();
}

function mettreAJourCompteurPanier() {
    let contenuPanierSession = obtenirSessionStorageJSON("articlesStockeSession");
    let compteur = document.getElementById("numPanier");

    if (compteur) {
        compteur.textContent = contenuPanierSession.length;
    }
}

function searchFunction() {
    let input = document.getElementById("searchBar").value.toLowerCase();
    let items = document.querySelectorAll("#listesProduitsUl li"); 

    items.forEach(item => {
        let text = item.innerText.toLowerCase();
        if (text.includes(input)) {
            item.style.display = "";
        } else {
            item.style.display = "none";
        }
    });
}

function updatePriceValue(value) {
    document.getElementById("priceValue").textContent = value;
    filterByPrice(value);
}

function filterByPrice(maxPrice) {
    let items = document.querySelectorAll("#listesProduitsUl li");

    items.forEach(item => {
        let priceText = item.querySelector("h3").innerText.replace("€", "").replace(",", ".").trim();
        let price = parseFloat(priceText);

        if (price <= maxPrice) {
            item.style.display = "";
        } else {
            item.style.display = "none";
        }
    });
}
fetch('majBDD.php')
.then(response => response.text())
.then(data => console.log(data));


//APPEL AUTOMATIQUE DE FONCTIONS
document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener("scroll", retourHautPage);
    mettreAJourCompteurPanier();
    manageScrollAnimations();
    if (window.location.href.includes('monpanier.html')) {
        afficherPanier();
    }
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


        function filtrerProduits() {
            const filtresActifs = Array.from(casesACocher)
                .filter(caseACocher => caseACocher.checked)
                .map(caseACocher => caseACocher.value.toLowerCase());

            produits.forEach(produit => {
                const classesProduit = Array.from(produit.classList);
                const correspondAuFiltre = filtresActifs.length === 0 || filtresActifs.some(filtre => classesProduit.includes(filtre));

                if (correspondAuFiltre) {
                    produit.style.display = 'block';
                } else {
                    produit.style.display = 'none';
                }
            });
        }


        casesACocher.forEach(caseACocher => caseACocher.addEventListener('change', filtrerProduits));
        const searchInput = document.getElementById('searchInput');
        const resultatsRecherche = document.getElementById('resultatsRecherche');

        searchInput.addEventListener('keyup', function () {
            const texte = zoneTexte.value.toLowerCase();
            const recherche = searchInput.value.toLowerCase();
            const mots = texte.split(' ');
            const resultats = mots.filter(mot => mot.includes(recherche));

            resultatsRecherche.innerHTML = '';
            resultats.forEach(mot => {
                const div = document.createElement('div');
                div.textContent = mot;
                resultatsRecherche.appendChild(div);
            });
        });
    }
});

