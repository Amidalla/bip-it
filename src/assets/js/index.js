import "../styles/reset.scss";
import "../styles/styles.scss";
import LazyLoad from "vanilla-lazyload";
import Swiper from 'swiper';
import 'swiper/swiper-bundle.css';
import { Pagination, Navigation, Autoplay, Thumbs } from 'swiper/modules';
import { SlidersInit } from "./sliders";
import { InitModals } from "./modals";
import { BannerAnimation } from "./animation.js"
import IMask from 'imask';

Swiper.use([Pagination, Navigation, Autoplay, Thumbs]);

function initPhoneMasksWithPlaceholder() {
        const phoneInputs = document.querySelectorAll('input[type="tel"][name="tel"]');

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

function initMasks() {
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
                        default:
                                if (input.dataset.maskPattern) {
                                        IMask(input, {
                                                mask: input.dataset.maskPattern
                                        });
                                }
                                break;
                }
        });
}

class Tabs {
        constructor(container) {
                this.container = container;
                this.buttons = container.querySelectorAll('.tab__btn');
                this.panes = container.querySelectorAll('.tab__pane');
                this.init();
        }

        init() {
                this.buttons.forEach(btn => {
                        btn.addEventListener('click', (e) => {
                                this.switchTab(e.target);
                        });
                });
        }

        switchTab(button) {
                const tabId = button.dataset.tab;
                this.buttons.forEach(btn => btn.classList.remove('active'));
                this.panes.forEach(pane => pane.classList.remove('active'));
                button.classList.add('active');
                const activePane = this.container.querySelector(`#${tabId}`);
                if (activePane) {
                        activePane.classList.add('active');
                }
        }
}

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


window.addEventListener('DOMContentLoaded', () => {
        const bannerAnimation = new BannerAnimation();
});

window.addEventListener('load', () => {
        const bannerAnimation = new BannerAnimation();
});

window.addEventListener('DOMContentLoaded', () => {
        const lazyLoadInstance = new LazyLoad({});
        SlidersInit();
        InitModals();
        initPhoneMasksWithPlaceholder();
        initMasks();

        const menuNormal = document.querySelector('.menu_normal');
        const menuFixed = document.querySelector('.menu_fixed');
        const scrollOffset = 100;
        let isFixed = false;
        let ticking = false;

        if (menuNormal && menuFixed) {
                function checkScroll() {
                        const currentScrollY = window.scrollY;
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
                }

                checkScroll();
                window.addEventListener('scroll', () => {
                        if (!ticking) {
                                window.requestAnimationFrame(() => {
                                        checkScroll();
                                        ticking = false;
                                });
                                ticking = true;
                        }
                });
        }

        const tabsContainer = document.querySelector('.bestsellers__tabs');
        if (tabsContainer) {
                new Tabs(tabsContainer);
        }

        const counters = document.querySelectorAll('.quantity-counter');
        counters.forEach(container => new QuantityCounter(container));

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
        });
});