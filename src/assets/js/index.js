import "../styles/reset.scss";
import "../styles/styles.scss";
import LazyLoad from "vanilla-lazyload";
import Swiper from 'swiper';
import 'swiper/swiper-bundle.css';
import { Pagination, Navigation, Autoplay, Thumbs } from 'swiper/modules';
import { SlidersInit } from "./sliders";
import { InitModals } from "./modals";

// Initializing Swiper modules
Swiper.use([Pagination, Navigation, Autoplay, Thumbs]);

window.addEventListener('DOMContentLoaded', () => {
        // Initializing Lazy
        const lazyLoadInstance = new LazyLoad({});

        // Initializing sliders
        SlidersInit();

        // Modal functions
        InitModals();

        // Menu fixed

        const menuNormal = document.querySelector('.menu_normal');
        const menuFixed = document.querySelector('.menu_fixed');
        const scrollOffset = 100;
        let isFixed = false;
        let ticking = false;

        if (menuNormal && menuFixed) {
                function checkScroll() {
                        const currentScrollY = window.scrollY;

                        if (currentScrollY > scrollOffset && !isFixed) {
                                // Переключаем на фиксированное меню
                                menuNormal.classList.add('hide');
                                menuFixed.classList.add('show');
                                document.body.classList.add('has-fixed-header');
                                isFixed = true;
                        }
                        else if (currentScrollY <= scrollOffset && isFixed) {
                                // Возвращаем обычное меню
                                menuFixed.classList.remove('show');
                                menuNormal.classList.remove('hide');
                                document.body.classList.remove('has-fixed-header');
                                isFixed = false;
                        }
                }


                checkScroll();

                // Оптимизированный обработчик скролла
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

        //tabs functionality
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

        const tabsContainer = document.querySelector('.bestsellers__tabs');
        if (tabsContainer) {
                new Tabs(tabsContainer);
        }

        //counter functionality
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

        const counters = document.querySelectorAll('.quantity-counter');
        counters.forEach(container => new QuantityCounter(container));

        //checkbox
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