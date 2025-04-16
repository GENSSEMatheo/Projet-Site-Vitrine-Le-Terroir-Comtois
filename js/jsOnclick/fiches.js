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