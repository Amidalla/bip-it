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

    const websiteErrorLinks = document.querySelectorAll(".website-error__link");

    const marketplaceModal = document.querySelector(".modal-marketplace");
    const buyMarketplaceBtns = document.querySelectorAll(".buy-marketplace");
    const marketplaceCloseBtn = document.querySelector(".modal-marketplace__close");

    const modalFilter = document.querySelector(".modal-filter");
    const filterButtons = document.querySelectorAll(".filter-mobile__btn");
    const filterCloseButtons = document.querySelectorAll(".modal-filter__close");

    const overlay = document.querySelector(".overlay");

    function shouldShowCatalogOverlay() {
        return window.innerWidth <= 760;
    }

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
        if (modalElement !== marketplaceModal && marketplaceModal?.classList.contains('opened')) {
            closeModal(marketplaceModal);
        }
        if (modalElement !== modalFilter && modalFilter?.classList.contains('active')) {
            closeModalFilter();
        }

        modalElement?.classList.add('opened');

        if ((modalElement === feedbackModal || modalElement === mobileMenu || modalElement === placedModal || modalElement === vacancyModal || modalElement === marketplaceModal) && overlay) {
            overlay.classList.add('opened');
        }

        if (modalElement === catalogModal && overlay && shouldShowCatalogOverlay()) {
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

        if ((modalElement === feedbackModal || modalElement === mobileMenu || modalElement === placedModal || modalElement === vacancyModal || modalElement === marketplaceModal) && overlay) {
            overlay.classList.remove('opened');
        }

        if (modalElement === catalogModal && overlay && shouldShowCatalogOverlay()) {
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

    function openModalFilter() {
        if (modalFilter) {
            modalFilter.classList.add('active');
            document.body.classList.add('no-scroll');
        }
    }

    function closeModalFilter() {
        if (modalFilter) {
            modalFilter.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    }

    function preventScroll(e) {
        if (modalFilter?.classList.contains('active')) {
            e.preventDefault();
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

    // Инициализация модалки каталога
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

    // Инициализация мобильного меню
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

    // Инициализация формы обратной связи
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

    // Инициализация модалки подтверждения заказа
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

    // Инициализация модалки вакансий
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
            openModal(feedbackModal);
        });
    });

    websiteErrorLinks.forEach(btn => {
        btn?.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            openModal(feedbackModal);
        });
    });

    // Инициализация модалки маркетплейса
    buyMarketplaceBtns.forEach(btn => {
        btn?.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            openModal(marketplaceModal);
        });
    });

    if (vacancyCloseBtn) {
        vacancyCloseBtn.addEventListener('click', (event) => {
            event.preventDefault();
            closeModal(vacancyModal);
        });
    }

    if (marketplaceCloseBtn) {
        marketplaceCloseBtn.addEventListener('click', (event) => {
            event.preventDefault();
            closeModal(marketplaceModal);
        });
    }

    // Инициализация модалки фильтра
    if (filterButtons.length && modalFilter) {
        filterButtons.forEach(button => {
            button.addEventListener('click', openModalFilter);
        });

        filterCloseButtons.forEach(button => {
            if (button) {
                button.addEventListener('click', closeModalFilter);
            }
        });

        modalFilter.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModalFilter();
            }
        });
    }

    // Обработка overlay
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
                if (marketplaceModal?.classList.contains('opened')) {
                    closeModal(marketplaceModal);
                }
                if (catalogModal?.classList.contains('opened') && shouldShowCatalogOverlay()) {
                    closeModal(catalogModal);
                }
                if (modalFilter?.classList.contains('active')) {
                    closeModalFilter();
                }
            }
        });
    }

    // Закрытие по клику вне модалки
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

        if (marketplaceModal?.classList.contains('opened')) {
            let isClickInsideMarketplace = marketplaceModal.contains(event.target);
            let isMarketplaceBtn = false;
            let isMarketplaceClose = marketplaceCloseBtn?.contains(event.target);

            for (const btn of buyMarketplaceBtns) {
                if (btn.contains(event.target)) {
                    isMarketplaceBtn = true;
                }
            }

            if (!isClickInsideMarketplace && !isMarketplaceBtn && !isMarketplaceClose) {
                closeModal(marketplaceModal);
            }
        }

        if (modalFilter?.classList.contains('active')) {
            let isClickInsideFilter = modalFilter.contains(event.target);
            let isFilterBtn = false;

            for (const btn of filterButtons) {
                if (btn.contains(event.target)) {
                    isFilterBtn = true;
                }
            }

            if (!isClickInsideFilter && !isFilterBtn) {
                closeModalFilter();
            }
        }
    });

    // Закрытие по Escape
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
            if (marketplaceModal?.classList.contains('opened')) {
                closeModal(marketplaceModal);
            }
            if (modalFilter?.classList.contains('active')) {
                closeModalFilter();
            }
        }
    });

    // Обработка ресайза
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
        websiteErrorLinks: websiteErrorLinks.length,
        marketplaceModal: !!marketplaceModal,
        buyMarketplaceBtns: buyMarketplaceBtns.length,
        marketplaceCloseBtn: !!marketplaceCloseBtn,
        modalFilter: !!modalFilter,
        filterButtons: filterButtons.length,
        filterCloseButtons: filterCloseButtons.length,
        overlay: !!overlay
    });
}