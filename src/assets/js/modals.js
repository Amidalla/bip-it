export function InitModals() {
    const catalogModal = document.querySelector(".modal-catalog");
    const catalogBtns = document.querySelectorAll(".catalog-btn");
    const catalogCloseBtn = document.querySelector(".catalog-close");
    const mobileMenu = document.querySelector(".mobile-menu");
    const burgerBtn = document.querySelector(".header__burger");
    const closeMobileMenuBtn = document.querySelector(".mobile-menu__close");
    const catalogImage = catalogModal?.querySelector(".modal-catalog__img");

    const feedbackModal = document.querySelector(".feedback-form");
    const feedbackBtns = document.querySelectorAll(".feedback-btn");
    const feedbackCloseBtn = document.querySelector(".feedback-form__close");

    const placedModal = document.querySelector(".modal-placed");
    const placedBtns = document.querySelectorAll(".checkout-button.active");
    const placedCloseBtn = document.querySelector(".modal-placed__close");

    const vacancyModal = document.querySelector(".vacancy-form");
    const vacancyItemBtns = document.querySelectorAll(".vacancy-item__link");
    const vacancyLinkBtns = document.querySelectorAll(".vacancy__link");
    const vacancyCloseBtn = document.querySelector(".vacancy-form__close");

    const overlay = document.querySelector(".overlay");

    function openModal(modalElement) {
        if (modalElement !== catalogModal && catalogModal?.classList.contains('opened')) {
            closeModal(catalogModal);
        }
        if (modalElement !== mobileMenu && mobileMenu?.classList.contains('opened')) {
            closeModal(mobileMenu);
        }
        if (modalElement !== feedbackModal && feedbackModal?.classList.contains('opened')) {
            closeModal(feedbackModal);
        }
        if (modalElement !== placedModal && placedModal?.classList.contains('opened')) {
            closeModal(placedModal);
        }
        if (modalElement !== vacancyModal && vacancyModal?.classList.contains('opened')) {
            closeModal(vacancyModal);
        }

        modalElement?.classList.add('opened');

        if ((modalElement === feedbackModal || modalElement === mobileMenu || modalElement === placedModal || modalElement === vacancyModal) && overlay) {
            overlay.classList.add('opened');
        }

        document.body.style.overflow = 'hidden';
        document.body.classList.add('modal-opened');

        if (modalElement === catalogModal) {
            initCatalogLists();
        }
    }

    function closeModal(modalElement) {
        modalElement?.classList.remove('opened');

        if ((modalElement === feedbackModal || modalElement === mobileMenu || modalElement === placedModal || modalElement === vacancyModal) && overlay) {
            overlay.classList.remove('opened');
        }

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

    feedbackBtns.forEach(btn => {
        btn?.addEventListener('click', (event) => {
            event.preventDefault();
            openModal(feedbackModal);
        });
    });

    if (feedbackCloseBtn) {
        feedbackCloseBtn.addEventListener('click', (event) => {
            event.preventDefault();
            closeModal(feedbackModal);
        });
    }

    placedBtns.forEach(btn => {
        btn?.addEventListener('click', (event) => {
            event.preventDefault();
            openModal(placedModal);
        });
    });

    if (placedCloseBtn) {
        placedCloseBtn.addEventListener('click', (event) => {
            event.preventDefault();
            closeModal(placedModal);
        });
    }

    vacancyItemBtns.forEach(btn => {
        btn?.addEventListener('click', (event) => {
            event.preventDefault();
            openModal(vacancyModal);
        });
    });


    vacancyLinkBtns.forEach(btn => {
        btn?.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            console.log('Vacancy link button clicked');
            openModal(feedbackModal);
        });
    });

    if (vacancyCloseBtn) {
        vacancyCloseBtn.addEventListener('click', (event) => {
            event.preventDefault();
            closeModal(vacancyModal);
        });
    }

    if (overlay) {
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                if (feedbackModal?.classList.contains('opened')) {
                    closeModal(feedbackModal);
                }
                if (mobileMenu?.classList.contains('opened')) {
                    closeModal(mobileMenu);
                }
                if (placedModal?.classList.contains('opened')) {
                    closeModal(placedModal);
                }
                if (vacancyModal?.classList.contains('opened')) {
                    closeModal(vacancyModal);
                }
            }
        });
    }

    document.addEventListener('click', (event) => {
        if (catalogModal?.classList.contains('opened')) {
            let isClickInsideModal = catalogModal.contains(event.target);
            let isCatalogBtn = false;
            let isCatalogClose = catalogCloseBtn?.contains(event.target);

            for (const btn of catalogBtns) {
                if (btn.contains(event.target)) {
                    isCatalogBtn = true;
                }
            }

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

        if (feedbackModal?.classList.contains('opened')) {
            let isClickInsideFeedback = feedbackModal.contains(event.target);
            let isFeedbackBtn = false;
            let isFeedbackClose = feedbackCloseBtn?.contains(event.target);

            for (const btn of feedbackBtns) {
                if (btn.contains(event.target)) {
                    isFeedbackBtn = true;
                }
            }

            if (!isClickInsideFeedback && !isFeedbackBtn && !isFeedbackClose) {
                closeModal(feedbackModal);
            }
        }

        if (placedModal?.classList.contains('opened')) {
            let isClickInsidePlaced = placedModal.contains(event.target);
            let isPlacedBtn = false;
            let isPlacedClose = placedCloseBtn?.contains(event.target);

            for (const btn of placedBtns) {
                if (btn.contains(event.target)) {
                    isPlacedBtn = true;
                }
            }

            if (!isClickInsidePlaced && !isPlacedBtn && !isPlacedClose) {
                closeModal(placedModal);
            }
        }

        if (vacancyModal?.classList.contains('opened')) {
            let isClickInsideVacancy = vacancyModal.contains(event.target);
            let isVacancyBtn = false;
            let isVacancyClose = vacancyCloseBtn?.contains(event.target);

            for (const btn of vacancyItemBtns) {
                if (btn.contains(event.target)) {
                    isVacancyBtn = true;
                }
            }

            if (!isClickInsideVacancy && !isVacancyBtn && !isVacancyClose) {
                closeModal(vacancyModal);
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
            if (feedbackModal?.classList.contains('opened')) {
                closeModal(feedbackModal);
            }
            if (placedModal?.classList.contains('opened')) {
                closeModal(placedModal);
            }
            if (vacancyModal?.classList.contains('opened')) {
                closeModal(vacancyModal);
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
        catalogImage: !!catalogImage,
        feedbackModal: !!feedbackModal,
        feedbackBtns: feedbackBtns.length,
        feedbackCloseBtn: !!feedbackCloseBtn,
        placedModal: !!placedModal,
        placedBtns: placedBtns.length,
        placedCloseBtn: !!placedCloseBtn,
        vacancyModal: !!vacancyModal,
        vacancyItemBtns: vacancyItemBtns.length,
        vacancyLinkBtns: vacancyLinkBtns.length,
        vacancyCloseBtn: !!vacancyCloseBtn,
        overlay: !!overlay
    });
}