function ajouterAuPanier(idProduit) {
    if (sessionStorage.getItem('connexion_reussie') !== 'true') {
        let messageDemandeConnection = document.createElement("div");
        messageDemandeConnection.id = "messageDemandeConnection";
        document.body.appendChild(messageDemandeConnection);
    
        messageDemandeConnection.innerHTML = `
            <div id="messageContent">
                <span id="closeMessage" style="cursor: pointer; color: white; font-size: 30px; font-weight: bold; position: absolute; top: 10px; right: 10px;">&times;</span>
                <p>Vous devez vous connecter pour continuer.</p>
                <button id="redirectToLogin" style="background-color: #aa7d00; color: white; border: none; padding: 15px 25px; cursor: pointer; border-radius: 5px; font-size: 18px;">Se connecter</button>
            </div>
        `;

        Object.assign(messageDemandeConnection.style, {
            backgroundColor: "rgba(0, 0, 0, 0.5)", 
            color: "white",                         
            padding: "10px",                        
            position: "fixed",                      
            top: "0",                               
            left: "0",                              
            right: "0",                             
            bottom: "0",                            
            display: "flex",                        
            justifyContent: "center",               
            alignItems: "center",                   
            zIndex: "1000",                         
        });
    
        // Style du contenu du message
        const messageContent = document.getElementById("messageContent");
        messageContent.style.position = "relative";  
        messageContent.style.padding = "30px";
        messageContent.style.backgroundColor = "#333";
        messageContent.style.borderRadius = "10px";
        messageContent.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.6)";
        messageContent.style.fontSize = "20px"; 
    
        // Fonction pour fermer la fenêtre/modal
        document.getElementById("closeMessage").addEventListener("click", function() {
            messageDemandeConnection.style.display = "none";  
        });
    
        // Fonction pour rediriger vers la page de connexion
        document.getElementById("redirectToLogin").addEventListener("click", function() {
            window.location.href = 'connexionCompte.html';  
        });
        return; 
    }

    fetch('/php/ajoutPanier.php', {
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

            // Mettre à jour sessionStorage avec le total des quantités
            sessionStorage.setItem('nbrArticlesPanier', data.totalQuantite);

            // Mettre à jour l'affichage du nombre d'articles dans le panier
            document.getElementById('numPanier').innerText = data.totalQuantite;

            if (window.location.href.includes('monpanier.html')) afficherPanier();
        } else {
            alert('Erreur: ' + data.message);
        }
    })
    .catch(() => alert('Erreur lors de l\'ajout au panier'));
}