// Fonction pour vider le panier
function viderPanier() {
    fetch('/php/viderPanier.php', { // Assurez-vous d'avoir un script PHP pour gérer cette requête
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id_client: sessionStorage.getItem('user_id')
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            // Mettre à jour l'interface utilisateur
            sessionStorage.setItem('nbrArticlesPanier', 0);
            document.getElementById('numPanier').innerText = 0;

            // Afficher un message de confirmation
            alert('Votre panier a été vidé avec succès.');

            // Si vous êtes sur la page du panier, rafraîchir la liste des articles
            if (window.location.href.includes('monpanier.html')) afficherPanier();
        } else {
            alert('Erreur: ' + data.message);
        }
    })
    .catch(() => alert('Erreur lors du vidage du panier'));
}

// Ajouter un gestionnaire d'événements au bouton "Vider le panier"
document.addEventListener('DOMContentLoaded', function() {
    const boutonViderPanier = document.getElementById('viderPanier');
    if (boutonViderPanier) {
        boutonViderPanier.addEventListener('click', viderPanier);
    }
});