function manageScrollAnimations() {
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    function checkElementsVisibility() {
        const elements = document.querySelectorAll('.slide-in');
        elements.forEach(element => {
            if (isElementInViewport(element)) {
                element.classList.add('active');
            } else {
                element.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', checkElementsVisibility);
    window.addEventListener('resize', checkElementsVisibility);
    checkElementsVisibility();
}

document.addEventListener('DOMContentLoaded', manageScrollAnimations);
