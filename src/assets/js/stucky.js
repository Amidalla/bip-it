export function InitSticky() {
    if (window.innerWidth > 768) return;

    const stuckBasket = document.querySelector('.stuck-basket');
    const stuckButton = document.querySelector('.stuck-button');
    const productInfo = document.querySelector('.product__info');
    const shoppingCartInfo = document.querySelector('.shopping-cart__info');

    if (!stuckBasket && !stuckButton) return;


    if (stuckBasket) stuckBasket.style.display = 'none';
    if (stuckButton) stuckButton.style.display = 'none';

    function updateStuckElements() {
        const productInfoRect = productInfo ? productInfo.getBoundingClientRect() : null;
        const shoppingCartInfoRect = shoppingCartInfo ? shoppingCartInfo.getBoundingClientRect() : null;


        const isShoppingCartInfoVisible = shoppingCartInfoRect ?
            shoppingCartInfoRect.top >= 0 && shoppingCartInfoRect.bottom <= window.innerHeight :
            false;

        if (stuckBasket && productInfoRect) {
            if (productInfoRect.bottom < 0) {
                stuckBasket.style.display = 'block';
            } else {
                stuckBasket.style.display = 'none';
            }
        }


        if (stuckButton) {
            if (!isShoppingCartInfoVisible) {
                stuckButton.style.display = 'flex';
            } else {
                stuckButton.style.display = 'none';
            }
        }
    }

    window.addEventListener('scroll', updateStuckElements);

    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            updateStuckElements();
        } else {

            if (stuckBasket) stuckBasket.style.display = 'none';
            if (stuckButton) stuckButton.style.display = 'none';
        }
    });

    updateStuckElements();
}