export function InitModals() {
    const catalogModal = document.querySelector(".modal-catalog");
    const catalogBtns = document.querySelectorAll(".catalog-btn");
    const catalogCloseBtn = document.querySelector(".catalog-close");
    const mobileMenu = document.querySelector(".mobile-menu");
    const burgerBtn = document.querySelector(".header__burger");
    const closeMobileMenuBtn = document.querySelector(".mobile-menu__close");
    const catalogImage = catalogModal?.querySelector(".modal-catalog__img");


    function openModal(modalElement) {

        if (modalElement !== catalogModal && catalogModal?.classList.contains('opened')) {
            closeModal(catalogModal);
        }
        if (modalElement !== mobileMenu && mobileMenu?.classList.contains('opened')) {
            closeModal(mobileMenu);
        }

        modalElement?.classList.add('opened');
        document.body.style.overflow = 'hidden';
        document.body.classList.add('modal-opened');

        if (modalElement === catalogModal) {
            initCatalogLists();
        }
    }

    function closeModal(modalElement) {
        modalElement?.classList.remove('opened');
        document.body.style.overflow = '';
        document.body.classList.remove('modal-opened');

        if (modalElement === catalogModal) {
            resetCatalogLists();
        }
    }

    function toggleModal(modalElement) {
        if (modalElement?.classList.contains('opened')) {
            closeModal(modalElement);
        } else {
            openModal(modalElement);
        }
    }


    function initCatalogLists() {
        const openedBtn = catalogModal?.querySelector('.list-opened-btn');
        const closeBtn = catalogModal?.querySelector('.list-close-btn');
        const firstList = catalogModal?.querySelector('.first-list');
        const secondList = catalogModal?.querySelector('.second-list');

        function isMobileView() {
            return window.innerWidth <= 1300;
        }

        function showSecondList() {
            if (isMobileView() && firstList && secondList) {
                firstList.classList.add('hidden');
                secondList.classList.add('active');

                if (catalogImage) {
                    catalogImage.classList.add('active');
                }
            }
        }

        function hideSecondList() {
            if (firstList && secondList) {
                firstList.classList.remove('hidden');
                secondList.classList.remove('active');

                if (catalogImage) {
                    catalogImage.classList.remove('active');
                }
            }
        }


        openedBtn?.removeEventListener('click', handleOpenClick);
        closeBtn?.removeEventListener('click', handleCloseClick);

        function handleOpenClick(e) {
            e.preventDefault();
            e.stopPropagation();
            showSecondList();
        }

        function handleCloseClick(e) {
            e.preventDefault();
            e.stopPropagation();
            hideSecondList();
        }


        openedBtn?.addEventListener('click', handleOpenClick);
        closeBtn?.addEventListener('click', handleCloseClick);
    }

    function resetCatalogLists() {
        const firstList = catalogModal?.querySelector('.first-list');
        const secondList = catalogModal?.querySelector('.second-list');

        if (firstList && secondList) {
            firstList.classList.remove('hidden');
            secondList.classList.remove('active');

            if (catalogImage) {
                catalogImage.classList.remove('active');
            }
        }
    }


    catalogBtns.forEach(btn => {
        btn?.addEventListener('click', (event) => {
            event.preventDefault();
            toggleModal(catalogModal);
        });
    });


    if (catalogCloseBtn) {
        catalogCloseBtn.addEventListener('click', (event) => {
            event.preventDefault();
            closeModal(catalogModal);
        });
    }


    if (burgerBtn) {
        burgerBtn.addEventListener('click', (event) => {
            event.preventDefault();
            toggleModal(mobileMenu);
        });
    }

    if (closeMobileMenuBtn) {
        closeMobileMenuBtn.addEventListener('click', (event) => {
            event.preventDefault();
            closeModal(mobileMenu);
        });
    }


    document.addEventListener('click', (event) => {

        if (catalogModal?.classList.contains('opened')) {
            let isClickInsideModal = catalogModal.contains(event.target);
            let isCatalogBtn = false;
            let isCatalogClose = catalogCloseBtn?.contains(event.target);

            catalogBtns.forEach(btn => {
                if (btn.contains(event.target)) {
                    isCatalogBtn = true;
                }
            });

            if (!isClickInsideModal && !isCatalogBtn && !isCatalogClose) {
                closeModal(catalogModal);
            }
        }


        if (mobileMenu?.classList.contains('opened')) {
            let isClickInsideMenu = mobileMenu.contains(event.target);
            let isBurgerBtn = burgerBtn?.contains(event.target);

            if (!isClickInsideMenu && !isBurgerBtn) {
                closeModal(mobileMenu);
            }
        }
    });


    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (catalogModal?.classList.contains('opened')) {
                closeModal(catalogModal);
            }
            if (mobileMenu?.classList.contains('opened')) {
                closeModal(mobileMenu);
            }
        }
    });


    window.addEventListener('resize', () => {
        if (window.innerWidth > 1300) {
            resetCatalogLists();
        }

        if (window.innerWidth > 992 && mobileMenu?.classList.contains('opened')) {
            closeModal(mobileMenu);
        }
    });


    console.log('Modals initialized:', {
        catalogModal: !!catalogModal,
        mobileMenu: !!mobileMenu,
        burgerBtn: !!burgerBtn,
        catalogBtns: catalogBtns.length,
        catalogCloseBtn: !!catalogCloseBtn,
        catalogImage: !!catalogImage
    });
}