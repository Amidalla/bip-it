import { gsap } from 'gsap';

export function InitModals() {
    const catalogModal = document.querySelector(".catalog-modal");
    const catalogBtns = document.querySelectorAll(".catalog-btn");
    const mobileMenu = document.querySelector(".mobile-menu");
    const burgerBtn = document.querySelector(".header__burger");
    const closeMobileMenuBtn = document.querySelector(".mobile-menu__close");

    const feedbackModal = document.querySelector(".feedback-form");
    const feedbackBtns = document.querySelectorAll(".feedback-btn");
    const feedbackCloseBtn = document.querySelector(".feedback-form__close");

    const vacancyModal = document.querySelector(".vacancy-form");
    const vacancyItemBtns = document.querySelectorAll(".vacancy-item__link");
    const vacancyLinkBtns = document.querySelectorAll(".vacancy__link");
    const vacancyCloseBtn = document.querySelector(".vacancy-form__close");

    const websiteErrorLinks = document.querySelectorAll(".website-error__link");

    const marketplaceModal = document.querySelector(".modal-marketplace");
    const buyMarketplaceBtns = document.querySelectorAll(".buy-marketplace");
    const marketplaceCloseBtn = document.querySelector(".modal-marketplace__close");

    const addedCartModal = document.querySelector(".added-cart");
    const purchaseBtns = document.querySelectorAll(".purchase__btn");
    const addedCartCloseBtn = document.querySelector(".added-cart__close");

    const modalFilter = document.querySelector(".modal-filter");
    const filterButtons = document.querySelectorAll(".filter-mobile__btn");
    const filterCloseButtons = document.querySelectorAll(".modal-filter__close");
    const filterBtnClose = document.querySelectorAll(".modal-filter__btnClose");

    const overlay = document.querySelector(".overlay");
    const menuFixed = document.querySelector(".menu_fixed");

    // Состояние для управления анимациями каталога
    const catalogState = {
        isAnimating: false,
        activeCategoryId: null,
        currentTimeline: null,
        hoverTimeout: null,
        pendingCategory: null,
        isFirstLoad: true,
        lastMousePosition: [0, 0],
        sectionsVisible: false,
        isHovered: false // Флаг для отслеживания ховера
    };

    // ========== КАТАЛОГ ==========

    function updateCatalogModalFixedState() {
        if (!catalogModal) return;

        if (menuFixed?.classList.contains("show")) {
            catalogModal.classList.add("fixed");
        } else {
            catalogModal.classList.remove("fixed");
        }
    }

    function initFixedMenuObserver() {
        if (!menuFixed || !catalogModal) return;

        updateCatalogModalFixedState();

        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    updateCatalogModalFixedState();
                }
            });
        });

        observer.observe(menuFixed, {
            attributes: true,
            attributeFilter: ['class']
        });
    }

    function loadCatalogImages() {
        const imgs = catalogModal?.querySelectorAll(".lazy");
        imgs?.forEach(img => {
            if (!img.src && img.dataset.src) {
                img.src = img.dataset.src;
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease-in-out';
                img.addEventListener('load', () => {
                    gsap.to(img, {
                        opacity: 1,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                });
            }
        });
    }

    function applyInitialDesktopStyles() {
        if (!catalogModal) return;

        const categoriesSection = catalogModal.querySelector('.categories-section');
        const subcategoriesSection = catalogModal.querySelector('.subcategories-section');
        const imageSection = catalogModal.querySelector('.image-section');

        if (!categoriesSection || !subcategoriesSection || !imageSection) return;

        function isDesktopView() {
            return window.innerWidth >= 1251;
        }

        if (isDesktopView()) {
            // Применяем начальные стили для десктопа
            categoriesSection.style.display = 'block';
            categoriesSection.style.opacity = '1';
            categoriesSection.style.visibility = 'visible';
            categoriesSection.style.borderRadius = '30px 30px 30px 30px';

            subcategoriesSection.style.display = 'none';
            subcategoriesSection.style.opacity = '0';
            subcategoriesSection.style.visibility = 'hidden';
            subcategoriesSection.style.position = 'absolute';
            subcategoriesSection.style.left = '33.333%';
            subcategoriesSection.style.top = '0';
            subcategoriesSection.style.width = '33.333%';
            subcategoriesSection.style.height = '100%';
            subcategoriesSection.style.zIndex = '10';
            subcategoriesSection.style.overflow = 'hidden';
            subcategoriesSection.style.transform = 'translateX(20px)';

            // Image-section ВСЕГДА занимает одну треть (33.333%)
            imageSection.style.display = 'none';
            imageSection.style.opacity = '0';
            imageSection.style.visibility = 'hidden';
            imageSection.style.position = 'absolute';
            imageSection.style.left = '66.666%'; // Начальная позиция - третья колонка
            imageSection.style.top = '0';
            imageSection.style.width = '33.333%';
            imageSection.style.height = '100%';
            imageSection.style.zIndex = '5';
            imageSection.style.transform = 'translateX(20px)';
            imageSection.style.borderRadius = '0 30px 30px 0'; // Только правые углы

            categoriesSection.style.flex = '0 0 33.333%';
            categoriesSection.style.maxWidth = '33.333%';
            categoriesSection.style.position = 'relative';
            categoriesSection.style.zIndex = '1';

            // Сбрасываем состояние
            catalogState.sectionsVisible = false;
            catalogState.activeCategoryId = null;
            catalogState.isHovered = false;
        }
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
            return window.innerWidth <= 1200;
        }

        function isDesktopView() {
            return window.innerWidth >= 1251;
        }

        function toggleImageVisibility(showImage) {
            if (!isMobileView()) {
                imageSection.style.display = 'flex';
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
            const hasNoSubcategories = categoryItem.classList.contains('subcategory-not');
            activeCategoryItem = categoryItem;

            categoriesSection?.classList.add('mobile-hidden');

            if (!hasNoSubcategories) {
                subcategoriesSection?.classList.add('mobile-active');
            }

            toggleImageVisibility(true);

            if (!hasNoSubcategories) {
                subcategoryGroups.forEach(group => group.classList.remove('active'));
                const targetGroup = catalogModal?.querySelector(`.subcategory-group[data-category="${categoryId}"]`);
                if (targetGroup) {
                    targetGroup.classList.add('active');
                }
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

        // Функция обновления изображения
        function updateImage(categoryId, imageSrc, imageAlt) {
            if (!catalogImage || !imageSrc) return;

            const currentOpacity = parseFloat(catalogImage.style.opacity) || 1;

            if (currentOpacity > 0) {
                gsap.to(catalogImage, {
                    opacity: 0,
                    duration: 0.2,
                    ease: "power2.in",
                    onComplete: () => {
                        catalogImage.src = imageSrc;
                        catalogImage.alt = imageAlt;
                        if (catalogImage.classList.contains('lazy')) {
                            catalogImage.dataset.src = imageSrc;
                        }
                        catalogImage.onload = () => {
                            gsap.to(catalogImage, {
                                opacity: 1,
                                duration: 0.4,
                                ease: "power2.out",
                                delay: 0.1
                            });
                        };
                        if (catalogImage.complete) {
                            catalogImage.onload();
                        }
                    }
                });
            } else {
                catalogImage.src = imageSrc;
                catalogImage.alt = imageAlt;
                if (catalogImage.classList.contains('lazy')) {
                    catalogImage.dataset.src = imageSrc;
                }
                catalogImage.style.opacity = '0';
            }
        }

        // Функция снятия активного класса со всех category-item
        function clearAllActiveClasses() {
            categoryItems.forEach(item => {
                item.classList.remove('active');
            });
            catalogState.isHovered = false;
        }

        // Функция анимации при переключении категорий
        function animateCategorySwitch(categoryId, imageSrc, imageAlt, categoryItem) {
            if (catalogState.isAnimating) {
                catalogState.pendingCategory = {
                    categoryId,
                    imageSrc,
                    imageAlt,
                    categoryItem
                };
                return;
            }

            if (catalogState.activeCategoryId === categoryId && catalogState.isHovered) {
                return;
            }

            catalogState.isAnimating = true;
            catalogState.activeCategoryId = categoryId;
            catalogState.isHovered = true;

            const hasNoSubcategories = categoryItem.classList.contains('subcategory-not');

            // Обновляем активные классы
            categoryItems.forEach(cat => cat.classList.remove('active'));
            categoryItem.classList.add('active');

            // Обновляем подкатегории
            subcategoryGroups.forEach(group => group.classList.remove('active'));
            const targetGroup = catalogModal?.querySelector(`.subcategory-group[data-category="${categoryId}"]`);

            // Обновляем изображение
            updateImage(categoryId, imageSrc, imageAlt);

            // Убиваем текущую анимацию если есть
            if (catalogState.currentTimeline) {
                catalogState.currentTimeline.kill();
            }

            catalogState.currentTimeline = gsap.timeline({
                onStart: () => {
                    // Если у текущей категории есть подкатегории - добавляем активный класс
                    if (targetGroup && !hasNoSubcategories) {
                        targetGroup.classList.add('active');
                    }
                },
                onComplete: () => {
                    catalogState.isAnimating = false;
                    catalogState.currentTimeline = null;

                    // Обработка ожидающей категории
                    if (catalogState.pendingCategory) {
                        const pending = catalogState.pendingCategory;
                        catalogState.pendingCategory = null;

                        if (pending.categoryId !== catalogState.activeCategoryId) {
                            gsap.delayedCall(0.1, () => {
                                animateCategorySwitch(
                                    pending.categoryId,
                                    pending.imageSrc,
                                    pending.imageAlt,
                                    pending.categoryItem
                                );
                            });
                        }
                    }
                }
            });

            // Определяем текущее состояние
            const currentImageLeft = imageSection.style.left || '66.666%';
            const targetImageLeft = hasNoSubcategories ? '33.333%' : '66.666%';
            const needMoveImage = currentImageLeft !== targetImageLeft;

            if (hasNoSubcategories) {
                // Если у новой категории нет подкатегорий:
                // 1. Плавно скрываем subcategories-section
                // 2. Плавно двигаем image-section на его место (МЕДЛЕННЕЕ - 0.6 сек)
                // 3. Border-radius остается '0 30px 30px 0' (только правые углы)
                catalogState.currentTimeline.to(subcategoriesSection, {
                    opacity: 0,
                    x: 20,
                    duration: 0.3,
                    ease: "power2.in",
                    onComplete: () => {
                        subcategoriesSection.style.display = 'none';
                    }
                }, 0);

                if (needMoveImage) {
                    // МЕДЛЕННАЯ анимация перемещения - 0.6 секунд
                    catalogState.currentTimeline.to(imageSection, {
                        left: '33.333%',
                        duration: 0.6,
                        ease: "power2.out"
                    }, 0.1);

                    // Для subcategory-not border-radius ВСЕГДА остается '0 30px 30px 0' (только правые углы)
                    catalogState.currentTimeline.to(imageSection, {
                        borderRadius: '0 30px 30px 0',
                        duration: 0.6,
                        ease: "power2.out"
                    }, 0.1);
                }

                catalogState.currentTimeline.to(imageSection, {
                    opacity: 1,
                    x: 0,
                    duration: 0.5,
                    ease: "power2.out"
                }, 0.2);
            } else {
                // Если у новой категории есть подкатегории:
                // 1. Показываем subcategories-section
                // 2. Плавно двигаем image-section обратно на третью позицию (МЕДЛЕННЕЕ - 0.6 сек)
                // 3. Border-radius остается '0 30px 30px 0' (только правые углы)
                if (subcategoriesSection.style.display === 'none') {
                    subcategoriesSection.style.display = 'block';
                    subcategoriesSection.style.opacity = '0';
                    subcategoriesSection.style.transform = 'translateX(20px)';
                }

                catalogState.currentTimeline.to(subcategoriesSection, {
                    opacity: 1,
                    x: 0,
                    duration: 0.4,
                    ease: "power2.out"
                }, 0.1);

                if (needMoveImage) {
                    // МЕДЛЕННАЯ анимация перемещения - 0.6 секунд
                    catalogState.currentTimeline.to(imageSection, {
                        left: '66.666%',
                        duration: 0.6,
                        ease: "power2.out"
                    }, 0.1);

                    // Для обычных элементов border-radius ВСЕГДА остается '0 30px 30px 0' (только правые углы)
                    catalogState.currentTimeline.to(imageSection, {
                        borderRadius: '0 30px 30px 0',
                        duration: 0.6,
                        ease: "power2.out"
                    }, 0.1);
                }

                catalogState.currentTimeline.to(imageSection, {
                    opacity: 1,
                    x: 0,
                    duration: 0.5,
                    ease: "power2.out"
                }, 0.2);
            }
        }

        // Функция для первоначального показа секций
        function animateShowSections(categoryId, imageSrc, imageAlt, categoryItem) {
            if (catalogState.isAnimating) {
                catalogState.pendingCategory = {
                    categoryId,
                    imageSrc,
                    imageAlt,
                    categoryItem
                };
                return;
            }

            if (catalogState.activeCategoryId === categoryId && catalogState.sectionsVisible) {
                return;
            }

            catalogState.isAnimating = true;
            catalogState.activeCategoryId = categoryId;
            catalogState.isHovered = true;

            const hasNoSubcategories = categoryItem.classList.contains('subcategory-not');

            // Обновляем активные классы
            categoryItems.forEach(cat => cat.classList.remove('active'));
            categoryItem.classList.add('active');

            // Обновляем подкатегории
            subcategoryGroups.forEach(group => group.classList.remove('active'));
            const targetGroup = catalogModal?.querySelector(`.subcategory-group[data-category="${categoryId}"]`);

            // Обновляем изображение
            updateImage(categoryId, imageSrc, imageAlt);

            // Убиваем текущую анимацию если есть
            if (catalogState.currentTimeline) {
                catalogState.currentTimeline.kill();
            }

            catalogState.currentTimeline = gsap.timeline({
                onStart: () => {
                    // Настраиваем начальные позиции в зависимости от наличия подкатегорий
                    if (hasNoSubcategories) {
                        // Для элементов без подкатегорий:
                        // subcategories-section скрыт, image-section на второй позиции
                        subcategoriesSection.style.display = 'none';
                        subcategoriesSection.style.opacity = '0';
                        imageSection.style.left = '33.333%';
                        imageSection.style.borderRadius = '0 30px 30px 0'; // Только правые углы
                    } else {
                        // Для элементов с подкатегориями:
                        // subcategories-section на второй позиции, image-section на третьей
                        if (targetGroup) {
                            targetGroup.classList.add('active');
                        }
                        subcategoriesSection.style.display = 'block';
                        subcategoriesSection.style.visibility = 'visible';
                        subcategoriesSection.style.opacity = '0';
                        subcategoriesSection.style.transform = 'translateX(20px)';
                        imageSection.style.left = '66.666%';
                        imageSection.style.borderRadius = '0 30px 30px 0'; // Только правые углы
                    }

                    // Настраиваем image-section
                    imageSection.style.display = 'flex';
                    imageSection.style.visibility = 'visible';
                    imageSection.style.opacity = '0';
                    imageSection.style.transform = 'translateX(20px)';

                    // Плавно убираем border-radius с правых углов у categories-section
                    gsap.to(categoriesSection, {
                        borderRadius: '30px 0 0 30px',
                        duration: 0.3,
                        ease: "power2.out"
                    });

                    // Показываем изображение если оно скрыто
                    if (catalogImage && imageSrc && catalogImage.style.opacity === '0') {
                        gsap.to(catalogImage, {
                            opacity: 1,
                            duration: 0.4,
                            ease: "power2.out",
                            delay: 0.2
                        });
                    }
                },
                onComplete: () => {
                    catalogState.isAnimating = false;
                    catalogState.sectionsVisible = true;
                    catalogState.currentTimeline = null;

                    // Обработка ожидающей категории
                    if (catalogState.pendingCategory) {
                        const pending = catalogState.pendingCategory;
                        catalogState.pendingCategory = null;

                        if (pending.categoryId !== catalogState.activeCategoryId) {
                            gsap.delayedCall(0.1, () => {
                                animateCategorySwitch(
                                    pending.categoryId,
                                    pending.imageSrc,
                                    pending.imageAlt,
                                    pending.categoryItem
                                );
                            });
                        }
                    }
                }
            });

            // Анимация subcategories-section (только если есть подкатегории)
            if (!hasNoSubcategories) {
                catalogState.currentTimeline.to(subcategoriesSection, {
                    opacity: 1,
                    x: 0,
                    duration: 0.5,
                    ease: "power2.out"
                }, 0.1);
            }

            // Анимация image-section
            catalogState.currentTimeline.to(imageSection, {
                opacity: 1,
                x: 0,
                duration: 0.6,
                ease: "power2.out"
            }, 0.2);
        }

        // Анимация скрытия всех секций
        function animateHideSections(callback) {
            if (catalogState.currentTimeline) {
                catalogState.currentTimeline.kill();
            }

            catalogState.isAnimating = true;

            catalogState.currentTimeline = gsap.timeline({
                onStart: () => {
                    // Скрываем изображение
                    if (catalogImage) {
                        gsap.to(catalogImage, {
                            opacity: 0,
                            duration: 0.3,
                            ease: "power2.in"
                        });
                    }

                    // Возвращаем border-radius у categories-section
                    gsap.to(categoriesSection, {
                        borderRadius: '30px 30px 30px 30px',
                        duration: 0.3,
                        ease: "power2.out"
                    });

                    // Снимаем активные классы со всех category-item
                    clearAllActiveClasses();
                },
                onComplete: () => {
                    // Скрываем секции
                    subcategoriesSection.style.display = 'none';
                    imageSection.style.display = 'none';

                    // Возвращаем image-section на начальную позицию (66.666%) и стандартный border-radius
                    imageSection.style.left = '66.666%';
                    imageSection.style.transform = 'translateX(20px)';
                    imageSection.style.opacity = '0';
                    imageSection.style.borderRadius = '0 30px 30px 0'; // Стандартный border-radius (только правые углы)

                    // Сбрасываем subcategories-section
                    subcategoriesSection.style.left = '33.333%';
                    subcategoriesSection.style.transform = 'translateX(20px)';
                    subcategoriesSection.style.opacity = '0';

                    // Сбрасываем состояние
                    catalogState.isAnimating = false;
                    catalogState.activeCategoryId = null;
                    catalogState.sectionsVisible = false;
                    catalogState.currentTimeline = null;
                    catalogState.isHovered = false;

                    // Восстанавливаем border-radius у categories-section
                    categoriesSection.style.borderRadius = '30px 30px 30px 30px';

                    if (callback) callback();
                }
            });

            // Анимация скрытия subcategories-section
            if (subcategoriesSection.style.display !== 'none') {
                catalogState.currentTimeline.to(subcategoriesSection, {
                    opacity: 0,
                    x: 20,
                    duration: 0.4,
                    ease: "power2.in"
                }, 0);
            }

            // Анимация скрытия image-section
            catalogState.currentTimeline.to(imageSection, {
                opacity: 0,
                x: 20,
                duration: 0.3,
                ease: "power2.in"
            }, 0.05);
        }

        // Проверка и скрытие секций при уходе курсора
        function checkAndHideSections() {
            if (catalogState.isAnimating) return;

            const hoveredElement = document.elementFromPoint(
                ...catalogState.lastMousePosition
            );

            const catalogContainer = catalogModal?.querySelector(".catalog-container");
            const isOverCatalog = hoveredElement?.closest('.catalog-container');
            const isOverCategories = hoveredElement?.closest('.categories-section');
            const isOverSubcategories = hoveredElement?.closest('.subcategories-section');
            const isOverImage = hoveredElement?.closest('.image-section');

            if (!isOverCatalog && !isOverCategories && !isOverSubcategories && !isOverImage) {
                // Также снимаем активные классы при уходе мыши
                clearAllActiveClasses();
                animateHideSections();
            }
        }

        // Логика ховеров для десктопа
        function initDesktopHoverLogic() {
            if (!isDesktopView()) return;

            const catalogContainer = catalogModal?.querySelector(".catalog-container");

            // Очищаем старые обработчики
            categoryItems.forEach(item => {
                item.removeEventListener('mouseenter', handleCategoryEnter);
                item.removeEventListener('mouseleave', handleCategoryLeave);
            });

            if (catalogContainer) {
                catalogContainer.removeEventListener('mouseenter', handleContainerEnter);
                catalogContainer.removeEventListener('mouseleave', handleContainerLeave);
            }

            // Обработчик входа в категорию
            function handleCategoryEnter() {
                clearTimeout(catalogState.hoverTimeout);

                const categoryId = this.dataset.category;
                const imageSrc = this.dataset.image;
                const imageAlt = this.textContent.trim();

                gsap.delayedCall(0.05, () => {
                    if (catalogState.sectionsVisible) {
                        // Если секции уже видны, плавно переключаем
                        animateCategorySwitch(categoryId, imageSrc, imageAlt, this);
                    } else {
                        // Если секции скрыты, показываем их с анимацией
                        animateShowSections(categoryId, imageSrc, imageAlt, this);
                    }
                });
            }

            // Обработчик выхода из категории
            function handleCategoryLeave(e) {
                const toElement = e.relatedTarget;

                if (!toElement || !catalogContainer?.contains(toElement)) {
                    catalogState.hoverTimeout = setTimeout(checkAndHideSections, 150);
                }
            }

            // Обработчик входа в контейнер
            function handleContainerEnter() {
                clearTimeout(catalogState.hoverTimeout);
            }

            // Обработчик выхода из контейнера
            function handleContainerLeave(e) {
                const toElement = e.relatedTarget;

                if (!toElement || !catalogContainer.contains(toElement)) {
                    clearTimeout(catalogState.hoverTimeout);
                    // Снимаем активные классы при уходе мыши с контейнера
                    clearAllActiveClasses();
                    catalogState.hoverTimeout = setTimeout(checkAndHideSections, 50);
                }
            }

            // Назначаем обработчики
            categoryItems.forEach(item => {
                item.addEventListener('mouseenter', handleCategoryEnter);
                item.addEventListener('mouseleave', handleCategoryLeave);
            });

            if (catalogContainer) {
                catalogContainer.addEventListener('mouseenter', handleContainerEnter);
                catalogContainer.addEventListener('mouseleave', handleContainerLeave);
            }

            // Инициализация первого состояния
            if (catalogState.isFirstLoad) {
                const firstActive = Array.from(categoryItems).find(item => item.classList.contains('active'));
                if (firstActive) {
                    const categoryId = firstActive.dataset.category;
                    const imageSrc = firstActive.dataset.image;
                    const imageAlt = firstActive.textContent.trim();
                    const hasNoSubcategories = firstActive.classList.contains('subcategory-not');

                    // Настраиваем начальное состояние
                    if (!hasNoSubcategories) {
                        // Для элементов с подкатегориями
                        const targetGroup = catalogModal?.querySelector(`.subcategory-group[data-category="${categoryId}"]`);
                        if (targetGroup) {
                            targetGroup.classList.add('active');
                        }
                        subcategoriesSection.style.display = 'block';
                        subcategoriesSection.style.opacity = '1';
                        subcategoriesSection.style.transform = 'translateX(0)';
                        imageSection.style.left = '66.666%';
                        imageSection.style.borderRadius = '0 30px 30px 0'; // Только правые углы
                    } else {
                        // Для элементов без подкатегорий
                        subcategoriesSection.style.display = 'none';
                        imageSection.style.left = '33.333%';
                        imageSection.style.borderRadius = '0 30px 30px 0'; // Только правые углы
                    }

                    imageSection.style.display = 'flex';
                    imageSection.style.opacity = '1';
                    imageSection.style.transform = 'translateX(0)';

                    if (catalogImage && imageSrc) {
                        catalogImage.src = imageSrc;
                        catalogImage.alt = imageAlt;
                        if (catalogImage.classList.contains('lazy')) {
                            catalogImage.dataset.src = imageSrc;
                        }
                        catalogImage.style.opacity = '1';
                    }

                    catalogState.activeCategoryId = categoryId;
                    catalogState.sectionsVisible = true;
                    catalogState.isHovered = true;

                    // Убираем border-radius с правых углов у categories-section
                    categoriesSection.style.borderRadius = '30px 0 0 30px';
                }
                catalogState.isFirstLoad = false;
            }
        }

        // Обработка кликов для мобильных и планшетов
        function setupClickHandlers() {
            function handleCategoryClick() {
                const categoryId = this.dataset.category;
                const imageSrc = this.dataset.image;
                const imageAlt = this.textContent.trim();
                const hasNoSubcategories = this.classList.contains('subcategory-not');

                categoryItems.forEach(cat => cat.classList.remove('active'));
                this.classList.add('active');
                activeCategoryItem = this;

                if (isMobileView()) {
                    showMobileSubcategories(this);
                } else if (!isDesktopView()) {
                    // Для планшетов
                    if (!hasNoSubcategories) {
                        subcategoryGroups.forEach(group => group.classList.remove('active'));
                        const targetGroup = catalogModal?.querySelector(`.subcategory-group[data-category="${categoryId}"]`);
                        if (targetGroup) {
                            targetGroup.classList.add('active');
                        }
                    }
                    toggleImageVisibility(true);
                }

                // Обновляем изображение
                if (catalogImage && imageSrc) {
                    catalogImage.src = imageSrc;
                    catalogImage.alt = imageAlt;
                    if (catalogImage.classList.contains('lazy')) {
                        catalogImage.dataset.src = imageSrc;
                    }
                }
            }

            categoryItems.forEach(item => {
                item.removeEventListener('click', handleCategoryClick);
                item.addEventListener('click', handleCategoryClick);
            });
        }

        // Обработка ресайза окна
        function handleResize() {
            if (isDesktopView()) {
                // Десктопная логика
                categoriesSection?.classList.remove('mobile-hidden');
                subcategoriesSection?.classList.remove('mobile-active');
                toggleImageVisibility(false);

                // Устанавливаем десктопные стили
                subcategoriesSection.style.position = 'absolute';
                subcategoriesSection.style.left = '33.333%';
                subcategoriesSection.style.top = '0';
                subcategoriesSection.style.width = '33.333%';
                subcategoriesSection.style.height = '100%';
                subcategoriesSection.style.zIndex = '10';

                imageSection.style.position = 'absolute';
                imageSection.style.left = '66.666%'; // Начальная позиция
                imageSection.style.top = '0';
                imageSection.style.width = '33.333%';
                imageSection.style.height = '100%';
                imageSection.style.zIndex = '5';
                imageSection.style.borderRadius = '0 30px 30px 0'; // Только правые углы

                categoriesSection.style.position = 'relative';
                categoriesSection.style.zIndex = '1';

                // Border-radius
                if (!catalogState.sectionsVisible) {
                    categoriesSection.style.borderRadius = '30px 30px 30px 30px';
                } else {
                    categoriesSection.style.borderRadius = '30px 0 0 30px';
                }

                // Сбрасываем состояние
                catalogState.isAnimating = false;
                catalogState.activeCategoryId = null;
                catalogState.pendingCategory = null;
                catalogState.sectionsVisible = false;
                catalogState.isHovered = false;

                if (catalogState.currentTimeline) {
                    catalogState.currentTimeline.kill();
                    catalogState.currentTimeline = null;
                }

                // Сбрасываем анимации
                gsap.set(subcategoriesSection, {
                    transform: 'translateX(20px)',
                    opacity: 0
                });
                gsap.set(imageSection, {
                    transform: 'translateX(20px)',
                    opacity: 0
                });

                if (catalogImage) {
                    catalogImage.style.opacity = '0';
                }

                // Инициализируем десктопную логику
                initDesktopHoverLogic();
            } else {
                // Мобильная/планшетная логика
                clearTimeout(catalogState.hoverTimeout);

                // Сбрасываем десктопные стили
                categoriesSection.style.flex = '';
                categoriesSection.style.maxWidth = '';
                categoriesSection.style.position = '';
                categoriesSection.style.zIndex = '';
                categoriesSection.style.borderRadius = '';

                subcategoriesSection.style.flex = '';
                subcategoriesSection.style.maxWidth = '';
                subcategoriesSection.style.position = '';
                subcategoriesSection.style.left = '';
                subcategoriesSection.style.top = '';
                subcategoriesSection.style.width = '';
                subcategoriesSection.style.height = '';
                subcategoriesSection.style.zIndex = '';
                subcategoriesSection.style.overflow = '';

                imageSection.style.flex = '';
                imageSection.style.maxWidth = '';
                imageSection.style.position = '';
                imageSection.style.left = '';
                imageSection.style.top = '';
                imageSection.style.width = '';
                imageSection.style.height = '';
                imageSection.style.zIndex = '';
                imageSection.style.borderRadius = '';

                // Управляем видимостью image-section
                if (isMobileView()) {
                    if (subcategoriesSection?.classList.contains('mobile-active')) {
                        toggleImageVisibility(true);
                    } else {
                        toggleImageVisibility(false);
                    }
                } else {
                    imageSection.style.display = 'flex';
                    toggleImageVisibility(true);
                }
            }

            setupClickHandlers();
        }

        // Инициализация при открытии модалки
        if (catalogModal.classList.contains('opened')) {
            if (isDesktopView()) {
                initDesktopHoverLogic();
            }
            setupClickHandlers();
        }

        // Обработчики событий
        window.addEventListener('resize', handleResize);

        document.addEventListener('mousemove', (e) => {
            catalogState.lastMousePosition = [e.clientX, e.clientY];
        });

        // Начальная инициализация
        if (isMobileView()) {
            toggleImageVisibility(false);
        }

        if (isDesktopView()) {
            initDesktopHoverLogic();
        }

        setupClickHandlers();
    }

    // ========== ФИЛЬТРЫ ==========

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
                if (content) {
                    content.style.display = 'block';
                    content.style.visibility = 'visible';
                    content.style.opacity = '1';
                    content.style.height = 'auto';
                    content.style.maxHeight = 'none';
                    content.style.overflow = 'visible';
                }
            } else {
                item.classList.remove('expanded');
                item.classList.add('collapsed');
                if (content) {
                    content.style.display = 'none';
                }
            }
        } else if (header.classList.contains('price-filter__legend')) {
            const priceFilter = header.closest('.price-filter');
            const content = priceFilter.querySelector('.price-filter__content');

            if (priceFilter.classList.contains('collapsed')) {
                priceFilter.classList.remove('collapsed');
                priceFilter.classList.add('expanded');

                if (content) {
                    content.style.display = 'block';
                    content.style.visibility = 'visible';
                    content.style.opacity = '1';
                    content.style.height = 'auto';
                    content.style.maxHeight = 'none';
                    content.style.overflow = 'visible';
                }
            } else {
                priceFilter.classList.remove('expanded');
                priceFilter.classList.add('collapsed');

                if (content) {
                    content.style.display = 'none';
                }
            }
        }
    }

    function initModalPriceFilter() {
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
            let value = this.value.replace(/\D/g, '');
            if (value === '') {
                value = minSlider.min;
            }

            value = parseInt(value);
            const minLimit = parseInt(minSlider.min);
            const maxLimit = parseInt(minSlider.max);

            if (value < minLimit) value = minLimit;
            if (value > maxLimit) value = maxLimit;
            if (value > maxVal) value = maxVal;

            minVal = value;
            this.value = minVal;
            minSlider.value = minVal;
            fillSlider();
            setToggleAccessible(minSlider);
        });

        maxPriceInput.addEventListener("input", function() {
            let value = this.value.replace(/\D/g, '');
            if (value === '') {
                value = maxSlider.min;
            }

            value = parseInt(value);
            const minLimit = parseInt(maxSlider.min);
            const maxLimit = parseInt(maxSlider.max);

            if (value < minLimit) value = minLimit;
            if (value > maxLimit) value = maxLimit;
            if (value < minVal) value = minVal;

            maxVal = value;
            this.value = maxVal;
            maxSlider.value = maxVal;
            fillSlider();
            setToggleAccessible(maxSlider);
        });

        minPriceInput.addEventListener("blur", function() {
            let value = this.value.replace(/\D/g, '');
            if (value === '') {
                value = minSlider.min;
            }

            value = parseInt(value);
            const minLimit = parseInt(minSlider.min);
            const maxLimit = parseInt(minSlider.max);

            if (value < minLimit) value = minLimit;
            if (value > maxLimit) value = maxLimit;
            if (value > maxVal) value = maxVal;

            minVal = value;
            this.value = minVal;
            minSlider.value = minVal;
            fillSlider();
            setToggleAccessible(minSlider);
        });

        maxPriceInput.addEventListener("blur", function() {
            let value = this.value.replace(/\D/g, '');
            if (value === '') {
                value = maxSlider.min;
            }

            value = parseInt(value);
            const minLimit = parseInt(maxSlider.min);
            const maxLimit = parseInt(maxSlider.max);

            if (value < minLimit) value = minLimit;
            if (value > maxLimit) value = maxLimit;
            if (value < minVal) value = minVal;

            maxVal = value;
            this.value = maxVal;
            maxSlider.value = maxVal;
            fillSlider();
            setToggleAccessible(maxSlider);
        });

        updatePriceInputs();
        fillSlider();
        setToggleAccessible(maxSlider);
    }

    function initModalFilter() {
        initFilterToggles();
        initModalPriceFilter();
    }

    // ========== ОСНОВНЫЕ ФУНКЦИИ МОДАЛОК ==========

    function openModal(modalElement) {
        // Закрываем другие модалки
        [catalogModal, mobileMenu, feedbackModal, vacancyModal, marketplaceModal, addedCartModal].forEach(m => {
            if (modalElement !== m && m?.classList.contains("opened")) closeModal(m);
        });

        if (modalElement !== modalFilter && modalFilter?.classList.contains("active")) closeModalFilter();

        // Открываем нужную модалку
        if (modalElement === catalogModal) {
            modalElement.classList.add("opened");

            // Применяем начальные стили для десктопа
            applyInitialDesktopStyles();

            if (window.innerWidth <= 760 && overlay) {
                overlay.classList.add("opened");
            }

            // Инициализируем каталог
            requestAnimationFrame(() => {
                void modalElement.offsetWidth;
            });

            initCatalogModal();
            loadCatalogImages();
        } else {
            modalElement?.classList.add("opened");
        }

        // Показываем overlay для некоторых модалок
        if ((modalElement === feedbackModal || modalElement === mobileMenu ||
            modalElement === vacancyModal || modalElement === marketplaceModal ||
            modalElement === addedCartModal) && overlay) {
            overlay.classList.add("opened");
        }

        // Блокируем скролл
        document.body.style.overflow = "hidden";
        document.body.classList.add("modal-opened");
    }

    function closeModal(modalElement) {
        if (modalElement === catalogModal) {
            modalElement.classList.remove("opened");

            if (overlay) {
                overlay.classList.remove("opened");
            }

            setTimeout(() => {
                if (!modalElement.classList.contains("opened")) {
                    document.body.style.overflow = "";
                    document.body.classList.remove("modal-opened");
                }
            }, 400);
        } else {
            modalElement?.classList.remove("opened");

            if ((modalElement === feedbackModal || modalElement === mobileMenu ||
                modalElement === vacancyModal || modalElement === marketplaceModal ||
                modalElement === addedCartModal) && overlay) {
                overlay.classList.remove("opened");
            }

            document.body.style.overflow = "";
            document.body.classList.remove("modal-opened");
        }
    }

    function toggleModal(modalElement) {
        if (modalElement === catalogModal && modalElement?.classList.contains("opened")) {
            closeModal(modalElement);
        } else {
            modalElement?.classList.contains("opened") ? closeModal(modalElement) : openModal(modalElement);
        }
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
            document.querySelectorAll(".filter-mobile__btn")
                .forEach(btn => btn.addEventListener("click", openModalFilter));
        }
    }

    // ========== ИНИЦИАЛИЗАЦИЯ ==========

    initFixedMenuObserver();

    // Кнопки каталога
    catalogBtns.forEach(btn => btn?.addEventListener("click", e => {
        e.preventDefault();
        toggleModal(catalogModal);
    }));

    // Клик вне каталога на десктопе
    document.addEventListener("click", e => {
        if (catalogModal?.classList.contains("opened")) {
            const catalogContainer = catalogModal.querySelector(".catalog-container");
            const isClickInsideContainer = catalogContainer?.contains(e.target);
            const isClickOnCatalogBtn = e.target.closest(".catalog-btn");

            if (window.innerWidth <= 760) {
                const isClickOnOverlay = e.target === overlay;
                if ((!isClickInsideContainer && !isClickOnCatalogBtn) || isClickOnOverlay) {
                    closeModal(catalogModal);
                }
            } else {
                if (!isClickInsideContainer && !isClickOnCatalogBtn) {
                    closeModal(catalogModal);
                }
            }
        }
    });

    // Мобильное меню
    burgerBtn?.addEventListener("click", e => {
        e.preventDefault();
        toggleModal(mobileMenu);
    });

    closeMobileMenuBtn?.addEventListener("click", e => {
        e.preventDefault();
        closeModal(mobileMenu);
    });

    // Форма обратной связи
    feedbackBtns.forEach(btn => btn?.addEventListener("click", e => {
        e.preventDefault();
        openModal(feedbackModal);
    }));

    feedbackCloseBtn?.addEventListener("click", e => {
        e.preventDefault();
        closeModal(feedbackModal);
    });

    // Вакансии
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

    vacancyCloseBtn?.addEventListener("click", e => {
        e.preventDefault();
        closeModal(vacancyModal);
    });

    // Корзина
    addedCartCloseBtn?.addEventListener("click", e => {
        e.preventDefault();
        closeModal(addedCartModal);
    });

    // Фильтры
    filterButtons.forEach(btn => btn.addEventListener("click", openModalFilter));
    filterCloseButtons.forEach(btn => btn.addEventListener("click", closeModalFilter));
    filterBtnClose.forEach(btn => btn.addEventListener("click", closeModalFilter));

    modalFilter?.addEventListener("click", e => {
        if (e.target === modalFilter) closeModalFilter();
    });

    // Overlay
    overlay?.addEventListener("click", e => {
        if (e.target === overlay) {
            [mobileMenu, feedbackModal, vacancyModal, marketplaceModal, addedCartModal].forEach(modal => {
                if (modal?.classList.contains("opened")) closeModal(modal);
            });

            if (modalFilter?.classList.contains("active")) closeModalFilter();

            if (catalogModal?.classList.contains("opened") && window.innerWidth <= 760) {
                closeModal(catalogModal);
            }
        }
    });

    // Escape
    document.addEventListener("keydown", e => {
        if (e.key === "Escape") {
            if (catalogModal?.classList.contains("opened")) {
                closeModal(catalogModal);
            } else {
                [mobileMenu, feedbackModal, vacancyModal, marketplaceModal, addedCartModal].forEach(m => {
                    if (m?.classList.contains("opened")) closeModal(m);
                });
            }
            if (modalFilter?.classList.contains("active")) closeModalFilter();
        }
    });

    // Ресайз окна
    window.addEventListener("resize", () => {
        if (window.innerWidth > 992 && mobileMenu?.classList.contains("opened")) closeModal(mobileMenu);
    });

    // Загрузка изображений каталога
    catalogBtns.forEach(btn => {
        btn.addEventListener('click', () => setTimeout(loadCatalogImages, 50));
    });
}