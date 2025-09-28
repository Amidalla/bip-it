
export function InitPrint() {
    const printButtons = document.querySelectorAll('.print-btn');

    printButtons.forEach(button => {
        button.addEventListener('click', handlePrint);
    });

    function handlePrint() {

        const isMobile = window.innerWidth <= 650;


        const desktopBlock = document.querySelector('.shopping-cart__products_desktop');
        const mobileBlock = document.querySelector('.shopping-cart__products_mobile');

        if (isMobile) {

            if (desktopBlock) desktopBlock.style.display = 'none';
            if (mobileBlock) mobileBlock.style.display = 'block';
        } else {

            if (desktopBlock) desktopBlock.style.display = 'block';
            if (mobileBlock) mobileBlock.style.display = 'none';
        }


        window.print();


        setTimeout(() => {
            if (window.innerWidth <= 650) {

                if (desktopBlock) desktopBlock.style.display = 'none';
                if (mobileBlock) mobileBlock.style.display = 'block';
            } else {

                if (desktopBlock) desktopBlock.style.display = 'block';
                if (mobileBlock) mobileBlock.style.display = 'none';
            }
        }, 100);
    }
}