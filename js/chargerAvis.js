export function chargerAvis(avisList) {
    fetch('php/avis.php', {
        method: 'GET'
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                avisList.innerHTML = '';
                data.avis.forEach(avis => {
                    const avisHTML = `
                        <div class="avis">
                            <h3>${avis.nom}</h3>
                            <p>${avis.avis}</p>
                            <small>${new Date(avis.date_creation).toLocaleString()}</small>
                        </div>
                    `;
                    avisList.innerHTML += avisHTML;
                });
            } else {
                avisList.innerHTML = '<p>Aucun avis pour le moment.</p>';
            }
        })
        .catch(() => {
            avisList.innerHTML = '<p>Erreur lors du chargement des avis.</p>';
        });
}