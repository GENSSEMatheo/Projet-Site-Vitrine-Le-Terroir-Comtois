import { manageScrollAnimations } from './js/manageScrollAnimations.js';
import { retourHautPage } from './js/retourHautPage.js';
import { afficherPanier } from './js/afficherPanier.js';
import { chargerAvis } from './js/chargerAvis.js';

if (window.location.href.includes('index.html')) {
    fetch('./php/majBDD.php')
        .then(res => res.text())
        .then(console.log);
}


document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener("scroll", retourHautPage);
    manageScrollAnimations();
    
    if (sessionStorage.getItem('connexion_reussie') === 'true') {
        document.getElementById('loginLink').style.display = 'none';
        document.getElementById('numPanier').style.display = 'flex';
        const logout = document.getElementById('logoutLink');
        logout.style.display = 'block';
        logout.innerHTML = "Déconnecter " + sessionStorage.getItem("user_prenom");
        logout.addEventListener('click', e => {
            e.preventDefault();
            sessionStorage.clear();
            window.location.href = window.location.pathname;
        });
        const numPanier = document.getElementById('numPanier');
        const nbrArticlesPanier = sessionStorage.getItem('nbrArticlesPanier') || 0;
        if (numPanier) {
            numPanier.innerText = nbrArticlesPanier;
        }
    }

    if (window.location.href.includes('monpanier.html')) {
        afficherPanier();
    }

    if (window.location.href.includes('index.html')) {
        const avisForm = document.getElementById('avisForm');
        const avisList = document.getElementById('avisList');

        avisForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nom = document.getElementById('nom').value;
            const avis = document.getElementById('avis').value;

            fetch('php/avis.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nom, avis })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        avisForm.reset();
                        chargerAvis(avisList);
                    } else {
                        alert(data.message || 'Erreur lors de l\'enregistrement de l\'avis.');
                    }
                })
                .catch(() => {
                    alert('Erreur de communication avec le serveur.');
                });
        });

        chargerAvis(avisList);
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



