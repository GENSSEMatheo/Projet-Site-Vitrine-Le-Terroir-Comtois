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
    
        const messageContent = document.getElementById("messageContent");
        messageContent.style.position = "relative";  
        messageContent.style.padding = "30px";
        messageContent.style.backgroundColor = "#333";
        messageContent.style.borderRadius = "10px";
        messageContent.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.6)";
        messageContent.style.fontSize = "20px"; 
    
        document.getElementById("closeMessage").addEventListener("click", function() {
            messageDemandeConnection.style.display = "none";  
        });
    
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
        
            message.innerHTML = `
                <div style="display: flex; align-items: center;">
                    <img src="images/panier-icon.png" alt="Panier" style="width: 50px; height: 50px; margin-right: 10px;">
                    <span>Vous avez ajouté 1 article au panier</span>
                </div>
                <button id="voirPanier" style="margin-top: 10px; background-color: white; color: #aa7d00; border: 1px solid #aa7d00; padding: 10px 20px; cursor: pointer; border-radius: 5px; font-size: 16px;">Voir le panier</button>
            `;

            Object.assign(message.style, {
                position: "fixed",
                top: "10px",
                right: "10px",
                width: "300px",
                padding: "20px",
                fontSize: "1rem",
                backgroundColor: "#aa7d00",
                color: "white",
                borderRadius: "10px",
                zIndex: "1000",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                transition: "opacity 0.5s ease-in-out",
                opacity: "1",
            });

            setTimeout(() => { message.style.opacity = "0"; }, 7000);

            document.getElementById("voirPanier").addEventListener("click", function() {
                window.location.href = 'monpanier.html';
            });

            sessionStorage.setItem('nbrArticlesPanier', data.totalQuantite);
            document.getElementById('numPanier').innerText = data.totalQuantite;

            if (window.location.href.includes('monpanier.html')) afficherPanier();
        } else {
            alert('Erreur: ' + data.message);
        }
    })
    .catch(() => alert('Erreur lors de l\'ajout au panier'));
}