import { gsap } from 'gsap';

export function InitModals() {
    const catalogModal = document.querySelector(".catalog-modal");
    const catalogBtns = document.querySelectorAll(".catalog-btn");
    const mobileMenu = document.querySelector(".mobile-menu");
    const burgerBtn = document.querySelector(".header__burger");
    const closeMobileMenuBtn = document.querySelector(".mobile-menu__close");
    const catalogImage = catalogModal?.querySelector("#catalogImage");

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

    function loadCatalogImages() {
        const imgs = catalogModal?.querySelectorAll(".lazy");
        imgs?.forEach(img => {
            if (!img.src && img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    }

    function initCatalogModal() {
        const categoryItems = catalogModal?.querySelectorAll('.category-item');
        const subcategoryGroups = catalogModal?.querySelectorAll('.subcategory-group');
        const catalogImage = catalogModal?.querySelector('#catalogImage');
        const imageSection = catalogModal?.querySelector('.image-section');
        const categoriesSection = catalogModal?.querySelector('.categories-section');
        const subcategoriesSection = catalogModal?.querySelector('.subcategories-section');
        const backButtons = catalogModal?.querySelectorAll('.subcategory-back');
        const catalogClose = catalogModal?.querySelector('.catalog-close');

        if (!categoryItems || !subcategoryGroups || !catalogImage || !imageSection) return;


        function isMobileView() {
            return window.innerWidth <= 1300;
        }

        function isSmallMobileView() {
            return window.innerWidth <= 760;
        }


        function toggleImageVisibility(showImage) {
            if (window.innerWidth > 1300) {

                imageSection.style.display = 'block';
                return;
            }


            if (showImage) {
                if (isSmallMobileView()) {
                    imageSection.classList.add('mobile-visible');
                } else {
                    imageSection.style.display = 'block';
                }
            } else {
                if (isSmallMobileView()) {
                    imageSection.classList.remove('mobile-visible');
                } else {
                    imageSection.style.display = 'block';
                }
            }
        }

        function toggleImageVisibility(showImage) {
            if (!isMobileView()) {

                imageSection.style.display = 'block';
                return;
            }


            if (showImage) {
                imageSection.classList.add('mobile-visible');
            } else {
                imageSection.classList.remove('mobile-visible');
            }
        }


        catalogClose?.addEventListener('click', function(e) {
            e.preventDefault();
            closeModal(catalogModal);
        });

        let activeCategoryItem = null;

        function showMobileSubcategories(categoryItem) {
            if (!isMobileView()) return;

            const categoryId = categoryItem.dataset.category;
            activeCategoryItem = categoryItem;

            categoriesSection?.classList.add('mobile-hidden');
            subcategoriesSection?.classList.add('mobile-active');


            toggleImageVisibility(true);

            subcategoryGroups.forEach(group => group.classList.remove('active'));
            const targetGroup = catalogModal?.querySelector(`.subcategory-group[data-category="${categoryId}"]`);
            if (targetGroup) {
                targetGroup.classList.add('active');
            }
        }

        function hideMobileSubcategories() {
            if (!isMobileView()) return;

            categoriesSection?.classList.remove('mobile-hidden');
            subcategoriesSection?.classList.remove('mobile-active');


            toggleImageVisibility(false);

            if (activeCategoryItem) {
                categoryItems.forEach(cat => cat.classList.remove('active'));
                activeCategoryItem.classList.add('active');
            }
        }

        backButtons?.forEach(button => {
            button.addEventListener('click', hideMobileSubcategories);
        });

        categoryItems.forEach(item => {
            item.addEventListener('click', function() {
                const categoryId = this.dataset.category;
                const imageSrc = this.dataset.image;
                const imageAlt = this.textContent.trim();

                categoryItems.forEach(cat => cat.classList.remove('active'));
                this.classList.add('active');

                activeCategoryItem = this;

                if (isMobileView()) {

                    showMobileSubcategories(this);
                } else {

                    subcategoryGroups.forEach(group => group.classList.remove('active'));
                    const targetGroup = catalogModal?.querySelector(`.subcategory-group[data-category="${categoryId}"]`);
                    if (targetGroup) {
                        targetGroup.classList.add('active');
                    }


                    toggleImageVisibility(true);
                }

                if (catalogImage && imageSrc) {
                    catalogImage.src = imageSrc;
                    catalogImage.alt = imageAlt;
                    if (catalogImage.classList.contains('lazy')) {
                        catalogImage.dataset.src = imageSrc;
                    }
                }
            });
        });


        window.addEventListener('resize', function() {
            if (window.innerWidth > 1300) {

                categoriesSection?.classList.remove('mobile-hidden');
                subcategoriesSection?.classList.remove('mobile-active');

                toggleImageVisibility(true);
            } else if (window.innerWidth <= 760) {

                if (subcategoriesSection?.classList.contains('mobile-active')) {
                    toggleImageVisibility(true);
                } else {
                    toggleImageVisibility(false);
                }
            }
        });



        if (isMobileView()) {
            toggleImageVisibility(false);
        }
    }
    function initFilterToggles() {
        const allFilterHeaders = document.querySelectorAll(`
            .filter-variants__header,
            .price-filter__legend
        `);

        allFilterHeaders.forEach((header) => {
            const newHeader = header.cloneNode(true);
            header.parentNode.replaceChild(newHeader, header);

            newHeader.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                handleFilterToggle(newHeader);
            });

            initializeFilterContent(newHeader);
        });
    }

    function initializeFilterContent(header) {
        let content;

        if (header.classList.contains('filter-variants__header')) {
            const item = header.closest('.filter-variants__item');
            content = item.querySelector('.filter-variants__content');

            if (!item.classList.contains('expanded') && !item.classList.contains('collapsed')) {
                item.classList.add('collapsed');
                gsap.set(content, { height: 0, opacity: 0 });
            }
        } else if (header.classList.contains('price-filter__legend')) {
            const priceFilter = header.closest('.price-filter');
            content = priceFilter.querySelector('.price-filter__content');

            if (!priceFilter.classList.contains('expanded') && !priceFilter.classList.contains('collapsed')) {
                priceFilter.classList.add('collapsed');
                gsap.set(content, { height: 0, opacity: 0 });
            }
        }
    }

    function handleFilterToggle(header) {
        if (header.classList.contains('filter-variants__header')) {
            const item = header.closest('.filter-variants__item');
            const content = item.querySelector('.filter-variants__content');

            if (item.classList.contains('collapsed')) {
                item.classList.remove('collapsed');
                item.classList.add('expanded');

                content.style.display = 'block';
                content.style.visibility = 'visible';
                content.style.opacity = '1';
                content.style.height = 'auto';
                content.style.maxHeight = 'none';
                content.style.overflow = 'visible';
            } else {
                item.classList.remove('expanded');
                item.classList.add('collapsed');

                content.style.display = 'none';
            }
        } else if (header.classList.contains('price-filter__legend')) {
            const priceFilter = header.closest('.price-filter');
            const content = priceFilter.querySelector('.price-filter__content');

            if (priceFilter.classList.contains('collapsed')) {
                priceFilter.classList.remove('collapsed');
                priceFilter.classList.add('expanded');

                content.style.display = 'block';
                content.style.visibility = 'visible';
                content.style.opacity = '1';
                content.style.height = 'auto';
                content.style.maxHeight = 'none';
                content.style.overflow = 'visible';
            } else {
                priceFilter.classList.remove('expanded');
                priceFilter.classList.add('collapsed');

                content.style.display = 'none';
            }
        }
    }

    function initPriceFilter() {
        const minPriceInput = document.getElementById('min-price-modal');
        const maxPriceInput = document.getElementById('max-price-modal');
        const minSlider = document.getElementById('min-slider-2');
        const maxSlider = document.getElementById('max-slider-2');
        const sliderTrack = document.querySelector('.slider-track');

        if (!minPriceInput || !maxPriceInput || !minSlider || !maxSlider || !sliderTrack) {
            return;
        }

        let minVal = parseInt(minSlider.value);
        let maxVal = parseInt(maxSlider.value);

        function updatePriceInputs() {
            minPriceInput.value = minVal;
            maxPriceInput.value = maxVal;
            fillSlider();
        }

        function fillSlider() {
            const min = parseInt(minSlider.min);
            const max = parseInt(minSlider.max);
            const percent1 = (minVal - min) / (max - min) * 100;
            const percent2 = (maxVal - min) / (max - min) * 100;
            sliderTrack.style.background = `linear-gradient(to right, #dadae5 ${percent1}%, #F99A1C ${percent1}%, #F99A1C ${percent2}%, #dadae5 ${percent2}%)`;
        }

        function setToggleAccessible(currentTarget) {
            const maxVal = parseInt(currentTarget.max);
            if (parseInt(currentTarget.value) <= maxVal * 0.05) {
                currentTarget.style.zIndex = "2";
            } else {
                currentTarget.style.zIndex = "0";
            }
        }

        minSlider.addEventListener("input", function() {
            minVal = parseInt(minSlider.value);
            if (minVal > maxVal) {
                minVal = maxVal;
                minSlider.value = minVal;
            }
            updatePriceInputs();
            setToggleAccessible(minSlider);
        });

        maxSlider.addEventListener("input", function() {
            maxVal = parseInt(maxSlider.value);
            if (maxVal < minVal) {
                maxVal = minVal;
                maxSlider.value = maxVal;
            }
            updatePriceInputs();
            setToggleAccessible(maxSlider);
        });

        minPriceInput.addEventListener("input", function() {
            minVal = parseInt(minPriceInput.value) || 0;
            if (minVal < parseInt(minSlider.min)) minVal = parseInt(minSlider.min);
            if (minVal > parseInt(minSlider.max)) minVal = parseInt(minSlider.max);
            if (minVal > maxVal) minVal = maxVal;
            minSlider.value = minVal;
            updatePriceInputs();
        });

        maxPriceInput.addEventListener("input", function() {
            maxVal = parseInt(maxPriceInput.value) || 0;
            if (maxVal < parseInt(maxSlider.min)) maxVal = parseInt(maxSlider.min);
            if (maxVal > parseInt(maxSlider.max)) maxVal = parseInt(maxSlider.max);
            if (maxVal < minVal) maxVal = minVal;
            maxSlider.value = maxVal;
            updatePriceInputs();
        });

        fillSlider();
        setToggleAccessible(maxSlider);
    }

    function initModalFilter() {
        initFilterToggles();
        initPriceFilter();
    }

    function openModal(modalElement) {
        [catalogModal, mobileMenu, feedbackModal, placedModal, vacancyModal, marketplaceModal].forEach(m => {
            if (modalElement !== m && m?.classList.contains("opened")) closeModal(m);
        });
        if (modalElement !== modalFilter && modalFilter?.classList.contains("active")) closeModalFilter();

        modalElement?.classList.add("opened");


        if ((modalElement === feedbackModal || modalElement === mobileMenu || modalElement === placedModal || modalElement === vacancyModal || modalElement === marketplaceModal) && overlay) {
            overlay.classList.add("opened");
        }

        document.body.style.overflow = "hidden";
        document.body.classList.add("modal-opened");

        if (modalElement === catalogModal) {
            initCatalogModal();
            loadCatalogImages();
        }
    }

    function closeModal(modalElement) {
        modalElement?.classList.remove("opened");


        if ((modalElement === feedbackModal || modalElement === mobileMenu || modalElement === placedModal || modalElement === vacancyModal || modalElement === marketplaceModal) && overlay) {
            overlay.classList.remove("opened");
        }

        document.body.style.overflow = "";
        document.body.classList.remove("modal-opened");
    }

    function toggleModal(modalElement) {
        modalElement?.classList.contains("opened") ? closeModal(modalElement) : openModal(modalElement);
    }

    function openModalFilter() {
        if (modalFilter) {
            modalFilter.classList.add("active");
            document.body.classList.add("no-scroll");

            setTimeout(() => {
                initModalFilter();
            }, 100);
        }
    }

    function closeModalFilter() {
        if (modalFilter) {
            modalFilter.classList.remove("active");
            document.body.classList.remove("no-scroll");
        }
    }


    catalogBtns.forEach(btn => btn?.addEventListener("click", e => {
        e.preventDefault();
        toggleModal(catalogModal);
    }));


    document.addEventListener("click", e => {
        if (catalogModal?.classList.contains("opened")) {

            const isClickInsideCatalog = catalogModal.contains(e.target);
            const isClickOnCatalogBtn = e.target.closest(".catalog-btn");

            if (!isClickInsideCatalog && !isClickOnCatalogBtn) {
                closeModal(catalogModal);
            }
        }
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

    overlay?.addEventListener("click", e => {
        if (e.target === overlay) {

            [mobileMenu, feedbackModal, placedModal, vacancyModal, marketplaceModal].forEach(modal => {
                if (modal?.classList.contains("opened")) closeModal(modal);
            });
            if (modalFilter?.classList.contains("active")) closeModalFilter();
        }
    });

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") {

            [catalogModal, mobileMenu, feedbackModal, placedModal, vacancyModal, marketplaceModal].forEach(m => {
                if (m?.classList.contains("opened")) closeModal(m);
            });
            if (modalFilter?.classList.contains("active")) closeModalFilter();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 992 && mobileMenu?.classList.contains("opened")) closeModal(mobileMenu);
    });

    catalogBtns.forEach(btn => {
        btn.addEventListener('click', () => setTimeout(loadCatalogImages, 50));
    });
}