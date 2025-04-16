export function afficherPanier() {
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

    fetch('php/obtenirPanier.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_client: id })
    })
        .then(res => res.json())
        .then(data => {
            if (data.error || data.message || data.length === 0) {
                cadre.style.display = 'block';
                cadre.innerHTML = data.message || `Votre panier est vide ${prenom ?? ''}`;
                sessionStorage.setItem('nbrArticlesPanier', 0); // Réinitialiser si le panier est vide
                sessionStorage.setItem('nbrProduitsDistincts', 0); // Réinitialiser si le panier est vide
                document.getElementById('btnCommander').style.display = 'none';
                return;
            }

            document.getElementById('btnCommander').style.display = 'flex';
            let totalQuantite = 0;

            liste.innerHTML = '';
            data.forEach(item => {
                const prix = parseFloat(item.prix) || 0;
                const quantite = parseInt(item.quantite) || 0;
                const total = prix * quantite;

                totalQuantite += quantite;

                const produitHTML = `
                <li class="${item.classTypePrecis}">
                    <img class="${item.classTypeGlob}" src="${item.image}" alt="${item.nom}">
                    <p>${item.producteur}</p>
                    <h2>${item.nom}</h2>
                    <p>Prix à l'unité</p>
                    <h3>${prix.toFixed(2)}€</h3>
                    <p>Quantité : ${quantite}</p>
                    <p>Total : ${total.toFixed(2)}€</p>
                    <button style='cursor:pointer;' id='buttonPanier' onclick="modifierQuantite('${item.id_prod}', -1)">-</button>
                    <button style='cursor:pointer;' id='buttonPanier' onclick="modifierQuantite('${item.id_prod}', 1)">+</button>
                </li>`;
                liste.innerHTML += produitHTML;
            });


            sessionStorage.setItem('nbrArticlesPanier', totalQuantite);
            document.getElementById('numPanier').innerText = totalQuantite;
        })
        .catch(() => {
            cadre.innerHTML = 'Erreur de chargement, veuillez réessayer plus tard.';
        });
}