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

    // ===== HELPERS =====
    function shouldShowCatalogOverlay() {
        return window.innerWidth <= 760;
    }

    // Fix высоты для iOS (100vh баг)
    function fixCatalogHeight() {
        if (catalogModal?.classList.contains("opened")) {
            catalogModal.style.height = `${window.innerHeight}px`;
        }
    }

    // Подгрузка ленивых картинок каталога
    function loadCatalogImages() {
        const imgs = catalogModal?.querySelectorAll(".modal-catalog__img .lazy");
        imgs?.forEach(img => {
            if (!img.src && img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    }

    // ===== OPEN / CLOSE MODALS =====
    function openModal(modalElement) {
        // Закрываем другие модалки
        [catalogModal, mobileMenu, feedbackModal, placedModal, vacancyModal, marketplaceModal].forEach(m => {
            if (modalElement !== m && m?.classList.contains("opened")) closeModal(m);
        });
        if (modalElement !== modalFilter && modalFilter?.classList.contains("active")) closeModalFilter();

        modalElement?.classList.add("opened");

        if ((modalElement === feedbackModal || modalElement === mobileMenu || modalElement === placedModal || modalElement === vacancyModal || modalElement === marketplaceModal) && overlay) {
            overlay.classList.add("opened");
        }

        if (modalElement === catalogModal && overlay && shouldShowCatalogOverlay()) {
            overlay.classList.add("opened");
        }

        document.body.style.overflow = "hidden";
        document.body.classList.add("modal-opened");

        // Дополнительно для каталога
        if (modalElement === catalogModal) {
            initCatalogLists();
            fixCatalogHeight();
            loadCatalogImages();
        }
    }

    function closeModal(modalElement) {
        modalElement?.classList.remove("opened");

        if ((modalElement === feedbackModal || modalElement === mobileMenu || modalElement === placedModal || modalElement === vacancyModal || modalElement === marketplaceModal) && overlay) {
            overlay.classList.remove("opened");
        }

        if (modalElement === catalogModal && overlay && shouldShowCatalogOverlay()) {
            overlay.classList.remove("opened");
        }

        document.body.style.overflow = "";
        document.body.classList.remove("modal-opened");

        if (modalElement === catalogModal) {
            resetCatalogLists();
            catalogModal.style.height = ""; // сброс
        }
    }

    function toggleModal(modalElement) {
        modalElement?.classList.contains("opened") ? closeModal(modalElement) : openModal(modalElement);
    }

    function openModalFilter() {
        if (modalFilter) {
            modalFilter.classList.add("active");
            document.body.classList.add("no-scroll");
        }
    }

    function closeModalFilter() {
        if (modalFilter) {
            modalFilter.classList.remove("active");
            document.body.classList.remove("no-scroll");
        }
    }

    function preventScroll(e) {
        if (modalFilter?.classList.contains("active")) e.preventDefault();
    }

    // ===== CATALOG LISTS =====
    function initCatalogLists() {
        const openedBtn = catalogModal?.querySelector(".list-opened-btn");
        const closeBtn = catalogModal?.querySelector(".list-close-btn");
        const firstList = catalogModal?.querySelector(".first-list");
        const secondList = catalogModal?.querySelector(".second-list");

        function isMobileView() {
            return window.innerWidth <= 1300;
        }

        function showSecondList() {
            if (isMobileView() && firstList && secondList) {
                firstList.classList.add("hidden");
                secondList.classList.add("active");
                catalogImage?.classList.add("active");
            }
        }

        function hideSecondList() {
            if (firstList && secondList) {
                firstList.classList.remove("hidden");
                secondList.classList.remove("active");
                catalogImage?.classList.remove("active");
            }
        }

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

        openedBtn?.removeEventListener("click", handleOpenClick);
        closeBtn?.removeEventListener("click", handleCloseClick);

        openedBtn?.addEventListener("click", handleOpenClick);
        closeBtn?.addEventListener("click", handleCloseClick);
    }

    function resetCatalogLists() {
        const firstList = catalogModal?.querySelector(".first-list");
        const secondList = catalogModal?.querySelector(".second-list");

        if (firstList && secondList) {
            firstList.classList.remove("hidden");
            secondList.classList.remove("active");
            catalogImage?.classList.remove("active");
        }
    }

    // ===== INIT LISTENERS =====
    catalogBtns.forEach(btn => btn?.addEventListener("click", e => {
        e.preventDefault();
        toggleModal(catalogModal);
    }));

    catalogCloseBtn?.addEventListener("click", e => {
        e.preventDefault();
        closeModal(catalogModal);
    });

    burgerBtn?.addEventListener("click", e => {
        e.preventDefault();
        toggleModal(mobileMenu);
    });

    closeMobileMenuBtn?.addEventListener("click", e => {
        e.preventDefault();
        closeModal(mobileMenu);
    });

    feedbackBtns.forEach(btn => btn?.addEventListener("click", e => {
        e.preventDefault();
        openModal(feedbackModal);
    }));

    feedbackCloseBtn?.addEventListener("click", e => {
        e.preventDefault();
        closeModal(feedbackModal);
    });

    placedBtns.forEach(btn => btn?.addEventListener("click", e => {
        e.preventDefault();
        openModal(placedModal);
    }));

    placedCloseBtn?.addEventListener("click", e => {
        e.preventDefault();
        closeModal(placedModal);
    });

    vacancyItemBtns.forEach(btn => btn?.addEventListener("click", e => {
        e.preventDefault();
        openModal(vacancyModal);
    }));

    vacancyLinkBtns.forEach(btn => btn?.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();
        openModal(feedbackModal);
    }));

    websiteErrorLinks.forEach(btn => btn?.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();
        openModal(feedbackModal);
    }));

    buyMarketplaceBtns.forEach(btn => btn?.addEventListener("click", e => {
        e.preventDefault();
        e.stopPropagation();
        openModal(marketplaceModal);
    }));

    vacancyCloseBtn?.addEventListener("click", e => {
        e.preventDefault();
        closeModal(vacancyModal);
    });

    marketplaceCloseBtn?.addEventListener("click", e => {
        e.preventDefault();
        closeModal(marketplaceModal);
    });

    filterButtons.forEach(btn => btn.addEventListener("click", openModalFilter));
    filterCloseButtons.forEach(btn => btn.addEventListener("click", closeModalFilter));
    modalFilter?.addEventListener("click", e => {
        if (e.target === modalFilter) closeModalFilter();
    });

    // Overlay click
    overlay?.addEventListener("click", e => {
        if (e.target === overlay) {
            [feedbackModal, mobileMenu, placedModal, vacancyModal, marketplaceModal].forEach(modal => {
                if (modal?.classList.contains("opened")) closeModal(modal);
            });
            if (catalogModal?.classList.contains("opened") && shouldShowCatalogOverlay()) closeModal(catalogModal);
            if (modalFilter?.classList.contains("active")) closeModalFilter();
        }
    });

    // ESC
    document.addEventListener("keydown", e => {
        if (e.key === "Escape") {
            [catalogModal, mobileMenu, feedbackModal, placedModal, vacancyModal, marketplaceModal].forEach(m => {
                if (m?.classList.contains("opened")) closeModal(m);
            });
            if (modalFilter?.classList.contains("active")) closeModalFilter();
        }
    });

    // Resize
    window.addEventListener("resize", () => {
        if (window.innerWidth > 1300) resetCatalogLists();
        if (window.innerWidth > 992 && mobileMenu?.classList.contains("opened")) closeModal(mobileMenu);

        // Обновление высоты каталога на iOS
        fixCatalogHeight();
    });

    // Дополнительные обработчики для каталога
    catalogBtns.forEach(btn => {
        btn.addEventListener('click', () => setTimeout(fixCatalogHeight, 0));
        btn.addEventListener('click', () => setTimeout(loadCatalogImages, 50));
    });

    // Глобальный обработчик ресайза для фикса высоты каталога
    window.addEventListener('resize', fixCatalogHeight);

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