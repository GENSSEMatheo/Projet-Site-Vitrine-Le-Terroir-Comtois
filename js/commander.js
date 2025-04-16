function commander() {
    const idClient = sessionStorage.getItem('user_id');

    if (!idClient) {
        alert('Vous devez être connecté pour passer une commande.');
        return;
    }

    if (!confirm('Êtes-vous sûr de vouloir passer la commande ?')) {
        return;
    }

    fetch('/php/commander.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_client: idClient })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert(data.message);

                // Réinitialiser le panier dans sessionStorage
                sessionStorage.setItem('nbrArticlesPanier', 0);
                sessionStorage.setItem('nbrProduitsDistincts', 0);

                // Mettre à jour l'affichage du panier
                document.getElementById('numPanier').innerText = 0;

                // Recharger la page ou rediriger
                window.location.reload();
            } else {
                alert('Erreur : ' + data.message);
            }
        })
        .catch(err => {
            console.error('Erreur lors de la commande :', err);
            alert('Une erreur est survenue. Veuillez réessayer.');
        });
}