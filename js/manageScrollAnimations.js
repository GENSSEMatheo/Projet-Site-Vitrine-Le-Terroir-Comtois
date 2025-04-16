export function manageScrollAnimations() {
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
        );
    }

    function checkElementsVisibility() {
        document.querySelectorAll('.slide-in').forEach(element => {
            element.classList.toggle('active', isElementInViewport(element));
        });
    }

    window.addEventListener('scroll', checkElementsVisibility);
    window.addEventListener('resize', checkElementsVisibility);
    checkElementsVisibility();
}