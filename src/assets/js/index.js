import "../styles/reset.scss";
import "../styles/styles.scss";
import LazyLoad from "vanilla-lazyload";
import Swiper from 'swiper';
import 'swiper/swiper-bundle.css';
import { Pagination, Navigation, Autoplay, Thumbs } from 'swiper/modules';
import { SlidersInit } from "./sliders";
import { InitModals } from "./modals";
import { InitVideo } from "./video";
import { InitPrint } from "./print";
import { InitSticky } from "./stucky";
import { InitTabs } from "./tabs";
import { BannerAnimation } from "./animation.js";
import { ScrollAnimations } from "./scroll-animations.js";
import IMask from 'imask';

Swiper.use([Pagination, Navigation, Autoplay, Thumbs]);

// Инициализация всех модулей
class App {
        constructor() {
                this.lazyLoadInstance = null;
                this.bannerAnimation = null;
                this.scrollAnimations = null;
                this.init();
        }

        init() {
                if (document.readyState === 'loading') {
                        document.addEventListener('DOMContentLoaded', () => this.initAll());
                } else {
                        this.initAll();
                }
        }

        initAll() {
                console.log('🚀 Initializing application...');


                this.initCoreModules();


                this.initForms();
                this.initUIComponents();


                this.initAnimations();


                this.initHMR();
        }

        initCoreModules() {
                console.log('📦 Initializing core modules...');

                // Слайдеры
                SlidersInit();

                // Ленивая загрузка
                this.lazyLoadInstance = new LazyLoad({});

                // Модальные окна
                InitModals();

                // Видео
                InitVideo();

                // Печать
                InitPrint();

                // Липкие элементы
                InitSticky();

                // Табы
                InitTabs();
        }

        initForms() {
                console.log('📝 Initializing forms...');
                this.initPhoneMasksWithPlaceholder();
                this.initMasks();
                this.initINNValidation();
        }

        initUIComponents() {
                console.log('🎨 Initializing UI components...');
                this.initSearch();
                this.initFixedHeader();
                this.initQuantityCounters();
                this.initCheckboxes();
                this.initPriceSlider();
                this.initPriceFilterToggle();
                this.initFilterVariants();


                document.querySelectorAll('.price-filter, .filter-variants__item').forEach(item => {
                        item.classList.add('collapsed');
                });
        }

        initAnimations() {
                console.log('🎬 Initializing animations...');

                // Баннерная анимация (только на главной)
                this.bannerAnimation = new BannerAnimation();
                console.log('🎯 BannerAnimation initialized:', this.bannerAnimation);


                this.scrollAnimations = new ScrollAnimations();
                console.log('📜 ScrollAnimations initialized:', this.scrollAnimations);


                setTimeout(() => {
                        if (this.scrollAnimations && typeof this.scrollAnimations.refresh === 'function') {
                                this.scrollAnimations.refresh();
                                console.log('🔄 ScrollAnimations refreshed after initialization');
                        }
                }, 1000);
        }

        initHMR() {
                if (module.hot) {
                        module.hot.accept();
                }
        }

        // Маски для телефонов
        initPhoneMasksWithPlaceholder() {
                const phoneInputs = document.querySelectorAll(`
            input[type="tel"][name="tel"],
            input[type="tel"][name="representative-phone"],
            input[type="tel"][data-phone-input]
        `);

                phoneInputs.forEach(input => {
                        let mask = null;

                        input.addEventListener('focus', () => {
                                if (!mask) {
                                        input.classList.add('phone-mask-active');
                                        mask = IMask(input, {
                                                mask: '+{7} (000) 000-00-00',
                                                lazy: false
                                        });

                                        if (!input.value) {
                                                input.value = '+7 (';
                                        }
                                }
                        });

                        input.addEventListener('blur', () => {
                                if (mask) {
                                        const phoneNumber = input.value.replace(/\D/g, '');
                                        if (phoneNumber.length < 11 || phoneNumber === '7') {
                                                input.value = '';
                                        }
                                        input.classList.remove('phone-mask-active');
                                        mask.destroy();
                                        mask = null;
                                }
                        });

                        input.addEventListener('input', (e) => {
                                if (mask && input.value === '+7 (' && e.inputType === 'deleteContentBackward') {
                                        input.value = '';
                                        input.classList.remove('phone-mask-active');
                                        mask.destroy();
                                        mask = null;
                                }
                        });
                });
        }

        // Общие маски
        initMasks() {
                const maskedInputs = document.querySelectorAll('[data-mask]');
                maskedInputs.forEach(input => {
                        const maskType = input.dataset.mask;
                        switch(maskType) {
                                case 'phone':
                                        IMask(input, {
                                                mask: '+{7} (000) 000-00-00'
                                        });
                                        break;
                                case 'card':
                                        IMask(input, {
                                                mask: '0000 0000 0000 0000'
                                        });
                                        break;
                                case 'date':
                                        IMask(input, {
                                                mask: '00.00.0000'
                                        });
                                        break;
                                case 'cvc':
                                        IMask(input, {
                                                mask: '000'
                                        });
                                        break;
                                case 'inn-legal':
                                        IMask(input, {
                                                mask: '0000000000',
                                                lazy: true,
                                                placeholderChar: ' '
                                        });
                                        break;
                                default:
                                        if (input.dataset.maskPattern) {
                                                IMask(input, {
                                                        mask: input.dataset.maskPattern
                                                });
                                        }
                                        break;
                        }
                });

                const phoneInputs = document.querySelectorAll('input[data-phone-input]');
                phoneInputs.forEach(input => {
                        if (!input.hasAttribute('data-mask')) {
                                IMask(input, {
                                        mask: '+{7} (000) 000-00-00'
                                });
                        }
                });
        }

        // Валидация ИНН
        initINNValidation() {
                const innInputs = document.querySelectorAll('input[data-mask="inn-legal"], #input-inn, #inn-nput');

                innInputs.forEach(input => {
                        const errorElement = this.findErrorElement(input);

                        input.addEventListener('input', function(e) {
                                this.value = this.value.replace(/\D/g, '');

                                if (this.value.length > 10) {
                                        this.value = this.value.slice(0, 10);
                                }

                                this.validateINNField(input, errorElement);
                        });

                        input.addEventListener('blur', function() {
                                this.validateINNField(input, errorElement);
                        });

                        input.addEventListener('focus', function() {
                                if (errorElement) {
                                        errorElement.style.display = 'none';
                                }
                                input.classList.remove('invalid');
                        });

                        input.addEventListener('keydown', function(e) {
                                if ([46, 8, 9, 27, 13].includes(e.keyCode) ||
                                    (e.keyCode === 65 && e.ctrlKey === true) ||
                                    (e.keyCode === 67 && e.ctrlKey === true) ||
                                    (e.keyCode === 86 && e.ctrlKey === true) ||
                                    (e.keyCode === 88 && e.ctrlKey === true) ||
                                    (e.keyCode >= 35 && e.keyCode <= 39)) {
                                        return;
                                }

                                if ((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
                                        e.preventDefault();
                                }
                        });

                        if (input.value) {
                                this.validateINNField(input, errorElement);
                        }
                });
        }

        findErrorElement(input) {
                const label = input.closest('label');
                if (label) {
                        const errorElement = label.querySelector('.inn-error');
                        if (errorElement) return errorElement;
                }

                const nextElement = input.nextElementSibling;
                if (nextElement && nextElement.classList.contains('inn-error')) {
                        return nextElement;
                }

                const parent = input.parentElement;
                if (parent) {
                        const errorElement = parent.querySelector('.inn-error');
                        if (errorElement) return errorElement;
                }

                return null;
        }

        validateINNField(input, errorElement) {
                const value = input.value.replace(/\D/g, '');

                if (!value) {
                        if (errorElement) {
                                errorElement.style.display = 'none';
                        }
                        input.classList.remove('invalid', 'valid');
                        return false;
                }

                if (value.length === 10 && this.validateINN(value)) {
                        input.classList.remove('invalid');
                        input.classList.add('valid');
                        if (errorElement) {
                                errorElement.style.display = 'none';
                        }
                        return true;
                } else {
                        input.classList.remove('valid');
                        input.classList.add('invalid');
                        if (errorElement) {
                                errorElement.textContent = this.getINNError(value);
                                errorElement.style.display = 'block';
                        }
                        return false;
                }
        }

        validateINN(inn) {
                if (!inn || inn.length !== 10) return false;
                if (!/^\d+$/.test(inn)) return false;

                const coefficients = [2, 4, 10, 3, 5, 9, 4, 6, 8];
                let sum = 0;

                for (let i = 0; i < 9; i++) {
                        sum += parseInt(inn[i]) * coefficients[i];
                }

                const controlDigit = (sum % 11) % 10;
                return controlDigit === parseInt(inn[9]);
        }

        getINNError(inn) {
                if (!inn) return 'Введите ИНН юридического лица';

                const length = inn.length;

                if (length < 10) return 'ИНН должен содержать 10 цифр';
                if (length > 10) return 'ИНН юридического лица содержит 10 цифр';

                if (!/^\d+$/.test(inn)) return 'ИНН должен содержать только цифры';

                return 'Неверный ИНН. Проверьте контрольную сумму';
        }

        // Поиск
        initSearch() {
                const searchContainers = document.querySelectorAll('.search');

                searchContainers.forEach(search => {
                        const searchToggle = search.querySelector('.search__toggle');
                        const searchContainer = search.querySelector('.search__form-container');
                        const searchInput = search.querySelector('.search__form input[type="search"]');
                        const searchClose = search.querySelector('.search__close');

                        if (!searchToggle || !searchContainer || !searchInput || !searchClose) {
                                return;
                        }

                        searchToggle.addEventListener('click', function(e) {
                                e.stopPropagation();

                                if (searchContainer.classList.contains('active')) {
                                        searchContainer.classList.remove('active');
                                } else {
                                        document.querySelectorAll('.search__form-container.active').forEach(activeContainer => {
                                                if (activeContainer !== searchContainer) {
                                                        activeContainer.classList.remove('active');
                                                }
                                        });

                                        searchContainer.classList.add('active');
                                        setTimeout(() => {
                                                searchInput.focus();
                                        }, 300);
                                }
                        });

                        searchClose.addEventListener('click', function(e) {
                                e.stopPropagation();
                                searchContainer.classList.remove('active');
                        });

                        document.addEventListener('click', function(e) {
                                if (!e.target.closest('.search') && searchContainer.classList.contains('active')) {
                                        searchContainer.classList.remove('active');
                                }
                        });

                        document.addEventListener('keydown', function(e) {
                                if (e.key === 'Escape' && searchContainer.classList.contains('active')) {
                                        searchContainer.classList.remove('active');
                                }
                        });

                        searchContainer.addEventListener('click', function(e) {
                                e.stopPropagation();
                        });
                });
        }

        // Фиксированный хедер
        initFixedHeader() {
                const menuNormal = document.querySelector('.menu_normal');
                const menuFixed = document.querySelector('.menu_fixed');
                const scrollOffset = 100;

                if (!menuNormal || !menuFixed) return;

                menuFixed.classList.remove('show');
                menuNormal.classList.remove('hide');
                document.body.classList.remove('has-fixed-header');

                let isFixed = false;
                let ticking = false;
                let initialized = false;

                const checkScroll = () => {
                        const currentScrollY = window.scrollY;

                        if (!initialized && currentScrollY > 0) {
                                initialized = true;
                                return;
                        }

                        if (currentScrollY > scrollOffset && !isFixed) {
                                menuNormal.classList.add('hide');
                                menuFixed.classList.add('show');
                                document.body.classList.add('has-fixed-header');
                                isFixed = true;
                        }
                        else if (currentScrollY <= scrollOffset && isFixed) {
                                menuFixed.classList.remove('show');
                                menuNormal.classList.remove('hide');
                                document.body.classList.remove('has-fixed-header');
                                isFixed = false;
                        }

                        initialized = true;
                };

                setTimeout(() => {
                        checkScroll();
                }, 300);

                window.addEventListener('scroll', () => {
                        if (!ticking) {
                                window.requestAnimationFrame(() => {
                                        checkScroll();
                                        ticking = false;
                                });
                                ticking = true;
                        }
                });

                window.addEventListener('resize', () => {
                        checkScroll();
                });
        }

        // Счетчики количества
        initQuantityCounters() {
                const counters = document.querySelectorAll('.quantity-counter');
                counters.forEach(container => new QuantityCounter(container));
        }

        // Чекбоксы
        initCheckboxes() {
                const checkboxes = document.querySelectorAll('.checkbox-label input[type="checkbox"]');
                checkboxes.forEach(checkbox => {
                        checkbox.addEventListener('change', function() {
                                const label = this.parentElement;
                                if (this.checked) {
                                        label.classList.add('checked');
                                } else {
                                        label.classList.remove('checked');
                                }
                        });

                        if (checkbox.checked) {
                                checkbox.parentElement.classList.add('checked');
                        }
                });
        }

        // Слайдер цен
        initPriceSlider() {
                const sliderContainers = document.querySelectorAll('.price-sliders');

                sliderContainers.forEach((container, index) => {
                        const minSlider = container.querySelector('.min-slider');
                        const maxSlider = container.querySelector('.max-slider');
                        const filterForm = container.closest('.filter-form');
                        const minInput = filterForm.querySelector('.min-price');
                        const maxInput = filterForm.querySelector('.max-price');
                        const track = container.querySelector('.slider-track');

                        if (!minSlider || !maxSlider || !minInput || !maxInput || !track) return;

                        const uniqueId = Date.now() + index;
                        minSlider.id = `min-slider-${uniqueId}`;
                        maxSlider.id = `max-slider-${uniqueId}`;

                        const updateTrack = () => {
                                const minVal = parseInt(minSlider.value);
                                const maxVal = parseInt(maxSlider.value);
                                const minPercent = (minVal / 2700) * 100;
                                const maxPercent = (maxVal / 2700) * 100;

                                track.style.background = `linear-gradient(to right, 
                    #FF7031 0%, 
                    #FF7031 ${minPercent}%, 
                    #F6F9FD ${minPercent}%, 
                    #F6F9FD ${maxPercent}%, 
                    #FF7031 ${maxPercent}%, 
                    #FF7031 100%)`;
                        };

                        const updateMinInput = () => {
                                minInput.value = minSlider.value;
                                if (parseInt(minSlider.value) > parseInt(maxSlider.value)) {
                                        maxSlider.value = minSlider.value;
                                        maxInput.value = minSlider.value;
                                }
                                updateTrack();
                        };

                        const updateMaxInput = () => {
                                maxInput.value = maxSlider.value;
                                if (parseInt(maxSlider.value) < parseInt(minSlider.value)) {
                                        minSlider.value = maxSlider.value;
                                        minInput.value = maxSlider.value;
                                }
                                updateTrack();
                        };

                        minSlider.addEventListener('input', updateMinInput);
                        maxSlider.addEventListener('input', updateMaxInput);
                        minInput.addEventListener('input', updateMinInput);
                        maxInput.addEventListener('input', updateMaxInput);

                        updateTrack();
                });
        }

        // Переключение фильтра цен
        initPriceFilterToggle() {
                const priceFilters = document.querySelectorAll('.price-filter');

                priceFilters.forEach(priceFilter => {
                        const legend = priceFilter.querySelector('.price-filter__legend');
                        const content = priceFilter.querySelector('.price-filter__content');

                        if (!legend || !content) return;

                        if (!priceFilter.classList.contains('collapsed')) {
                                content.style.cssText = 'opacity: 0; max-height: 0; overflow: hidden; transition: none;';
                                priceFilter.classList.add('collapsed');
                        }

                        legend.addEventListener('click', function() {
                                if (!content.style.transition) {
                                        content.style.transition = 'all 0.3s ease';
                                }

                                priceFilter.classList.toggle('collapsed');
                        });

                        setTimeout(() => {
                                content.style.transition = 'all 0.3s ease';
                        }, 300);
                });
        }

        // Фильтры вариантов
        initFilterVariants() {
                const filterContainers = document.querySelectorAll('.filter-variants');

                filterContainers.forEach(container => {
                        const filterItems = container.querySelectorAll('.filter-variants__item');

                        filterItems.forEach(item => {
                                const header = item.querySelector('.filter-variants__header');

                                if (!header) return;

                                item.classList.add('collapsed');

                                header.addEventListener('click', function() {
                                        item.classList.toggle('collapsed');
                                });
                        });
                });
        }
}

// Класс счетчика количества
class QuantityCounter {
        constructor(container) {
                this.container = container;
                this.input = container.querySelector('.counter-input');
                this.minusBtn = container.querySelector('.counter-minus');
                this.plusBtn = container.querySelector('.counter-plus');
                this.init();
        }

        init() {
                this.minusBtn.addEventListener('click', () => this.decrease());
                this.plusBtn.addEventListener('click', () => this.increase());
                this.input.addEventListener('input', () => this.validate());
                this.input.addEventListener('blur', () => this.fixValue());
                this.updateButtons();
        }

        decrease() {
                let value = parseInt(this.input.value) || 1;
                if (value > parseInt(this.input.min)) {
                        this.input.value = value - 1;
                        this.updateButtons();
                        this.emitChangeEvent();
                }
        }

        increase() {
                let value = parseInt(this.input.value) || 1;
                const max = parseInt(this.input.max) || 99;
                if (value < max) {
                        this.input.value = value + 1;
                        this.updateButtons();
                        this.emitChangeEvent();
                }
        }

        validate() {
                let value = this.input.value;
                value = value.replace(/[^\d]/g, '');
                const max = parseInt(this.input.max) || 99;
                if (value > max) {
                        value = max;
                }
                this.input.value = value;
                this.updateButtons();
        }

        fixValue() {
                let value = parseInt(this.input.value);
                if (isNaN(value) || value < parseInt(this.input.min)) {
                        value = parseInt(this.input.min) || 1;
                }
                const max = parseInt(this.input.max) || 99;
                if (value > max) {
                        value = max;
                }
                this.input.value = value;
                this.updateButtons();
                this.emitChangeEvent();
        }

        updateButtons() {
                const value = parseInt(this.input.value);
                const min = parseInt(this.input.min) || 1;
                const max = parseInt(this.input.max) || 99;
                this.minusBtn.disabled = value <= min;
                this.plusBtn.disabled = value >= max;
        }

        emitChangeEvent() {
                this.input.dispatchEvent(new Event('change', { bubbles: true }));
        }

        getValue() {
                return parseInt(this.input.value);
        }

        setValue(value) {
                const numValue = parseInt(value);
                if (!isNaN(numValue)) {
                        const min = parseInt(this.input.min) || 1;
                        const max = parseInt(this.input.max) || 99;
                        this.input.value = Math.max(min, Math.min(max, numValue));
                        this.updateButtons();
                }
        }
}


const app = new App();


window.app = app;