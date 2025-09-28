export function InitSticky() {

    if (window.innerWidth > 768) return;

    const stuckBasket = document.querySelector('.stuck-basket');
    const productInfo = document.querySelector('.product__info');

    if (!stuckBasket || !productInfo) return;


    stuckBasket.style.display = 'none';

    function updateStuckBasket() {
        const productInfoRect = productInfo.getBoundingClientRect();


        if (productInfoRect.bottom < 0) {
            stuckBasket.style.display = 'block';
        } else {
            stuckBasket.style.display = 'none';
        }
    }

    window.addEventListener('scroll', updateStuckBasket);


    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            updateStuckBasket();
        } else {
            stuckBasket.style.display = 'none';
        }
    });

    updateStuckBasket();
}