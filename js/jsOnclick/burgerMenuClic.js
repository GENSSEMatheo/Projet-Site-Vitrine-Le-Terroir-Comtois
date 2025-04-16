function burgerMenuClic() {
    const burger = document.getElementById('burgerMenu');
    const nav = document.getElementById('navGlob');
    const menu = document.getElementById('menuGlob');
    const numPanier = document.getElementById('numPanier');

    if (burger.style.transform == 'rotate(90deg)'){
        burger.style.transform = 'rotate(0deg)';
        numPanier.style.justifySelf = 'left';
        document.body.style.overflowY = 'scroll';
        nav.style.bottom = '100%';
        nav.style.overflowY = 'hidden';
        menu.style.overflowY = 'hidden';

    } else {
        burger.style.transform = 'rotate(90deg)';
        numPanier.style.justifySelf = 'center';
        document.body.style.overflowY = 'hidden';
        nav.style.bottom = '0%';
        nav.style.overflowY = 'auto';
        menu.style.overflowY = 'auto';
    }
    




}