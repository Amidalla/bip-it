import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {

        if (!this.isMainPage()) {
            console.log('Not main page - scroll animations disabled');
            return;
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.setupAnimations(), 100);
            });
        } else {
            setTimeout(() => this.setupAnimations(), 100);
        }
    }


    isMainPage() {
        return document.querySelector('main.main-page') !== null;
    }

    setupAnimations() {

        if (!this.isMainPage()) {
            console.log('Not main page - skipping animations setup');
            return;
        }

        console.log('Setting up scroll animations with GSAP', gsap.version);

        if (typeof ScrollTrigger === 'undefined') {
            console.error('ScrollTrigger not available');
            return;
        }

        // Анимация появления элементов при скролле
        this.animateOnScroll();

        // Анимация для секции "Хиты продаж"
        this.animateBestsellersSection();

        // Анимация для секции "Преимущества"
        this.animateAdvantagesSection();

        // Анимация для секции "Партнеры"
        this.animatePartnersSection();

        // Анимация для секции "Новости"
        this.animateNewsSection();

        // Анимация для секции "Форма"
        this.animateFormSection();

        setTimeout(() => {
            ScrollTrigger.refresh();
            console.log('ScrollTrigger refreshed');
        }, 500);
    }

    // Анимация для секции "Хиты продаж"
    animateBestsellersSection() {
        const bestsellersTabs = document.querySelector('.bestsellers__tabs');
        if (!bestsellersTabs) {
            console.log('Bestsellers tabs not found');
            return;
        }

        console.log('Animating bestsellers tabs');

        // Анимация табов
        gsap.fromTo(bestsellersTabs, {
            y: 120,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 0.3,
            ease: "power3.out",
            scrollTrigger: {
                trigger: bestsellersTabs,
                start: "top 85%",
                end: "bottom 15%",
                toggleActions: "play none none none",
                markers: false
            }
        });

        // Анимация заголовка
        const title = document.querySelector('.bestsellers__title');
        if (title) {
            gsap.fromTo(title, {
                y: 60,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 1.0,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: bestsellersTabs,
                    start: "top 85%",
                    end: "bottom 15%",
                    toggleActions: "play none none none"
                }
            });
        }
    }

    // Анимация для секции "Преимущества"
    animateAdvantagesSection() {
        const advantagesSection = document.querySelector('.advantages');
        if (!advantagesSection) {
            console.log('Advantages section not found');
            return;
        }

        console.log('Animating advantages section');

        // Анимация заголовка
        const title = advantagesSection.querySelector('h2.animate-title');
        if (title) {
            gsap.fromTo(title, {
                y: 80,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 1.0,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: advantagesSection,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none none"
                }
            });
        }

        // Анимация элементов справа
        const rightItems = advantagesSection.querySelectorAll('.animate-right');
        if (rightItems.length > 0) {
            gsap.fromTo(rightItems, {
                x: 200,
                opacity: 0
            }, {
                x: 0,
                opacity: 1,
                duration: 1.0,
                stagger: 0.15,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: advantagesSection,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none none"
                }
            });
        }

        // Анимация элементов слева
        const leftItems = advantagesSection.querySelectorAll('.animate-left');
        if (leftItems.length > 0) {
            gsap.fromTo(leftItems, {
                x: -200,
                opacity: 0
            }, {
                x: 0,
                opacity: 1,
                duration: 1.0,
                stagger: 0.15,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: advantagesSection,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none none"
                }
            });
        }

        // Анимация элемента снизу
        const topItem = advantagesSection.querySelector('.animate-top');
        if (topItem) {
            gsap.fromTo(topItem, {
                y: -160,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 1.0,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: advantagesSection,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none none"
                }
            });
        }
    }

    // Анимация для секции "Партнеры"
    animatePartnersSection() {
        const partnersSection = document.querySelector('.partners.animate-section');
        if (!partnersSection) {
            console.log('Partners section not found');
            return;
        }

        console.log('Animating partners section');

        // Анимация заголовка
        const title = partnersSection.querySelector('h2.animate-title');
        if (title) {
            gsap.fromTo(title, {
                y: 60,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 1.0,
                delay: 0.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: partnersSection,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none none"
                }
            });
        }

        // Анимация слайдера
        const slider = partnersSection.querySelector('.partners__slider.animate-slider');
        if (slider) {
            gsap.fromTo(slider, {
                y: 80,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 1.0,
                delay: 0.4,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: partnersSection,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none none"
                }
            });
        }
    }

    // Анимация для секции "Новости"
    animateNewsSection() {
        const newsSection = document.querySelector('.main-news.animate-section');
        if (!newsSection) {
            console.log('News section not found');
            return;
        }

        console.log('Animating news section');

        // Анимация заголовка
        const title = newsSection.querySelector('.main-news__title.animate-title');
        if (title) {
            gsap.fromTo(title, {
                y: 80,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 1.0,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: newsSection,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none none"
                }
            });
        }

        // Анимация слайдов новостей
        const newsSlides = newsSection.querySelectorAll('.swiper-slide.animate-card');
        if (newsSlides.length > 0) {
            gsap.fromTo(newsSlides, {
                y: 60,
                opacity: 0,
                scale: 0.3
            }, {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 1.0,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: newsSection,
                    start: "top 70%",
                    end: "bottom 0%",
                    toggleActions: "play none none none"
                }
            });
        }

        const sliderControls = newsSection.querySelector('.main-news__slider-controls');
        if (sliderControls) {
            gsap.fromTo(sliderControls, {
                y: 40,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                delay: 0.3,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: newsSection,
                    start: "top 70%",
                    end: "bottom 0%",
                    toggleActions: "play none none none"
                }
            });
        }
    }

    // Анимация для секции "Форма"
    animateFormSection() {
        const formSection = document.querySelector('.main-form');
        if (!formSection) {
            console.log('Form section not found');
            return;
        }

        console.log('Animating form section');

        // Анимация левой части
        const leftContent = formSection.querySelector('.animate-left');
        if (leftContent) {
            gsap.fromTo(leftContent, {
                x: -250,
                opacity: 0
            }, {
                x: 0,
                opacity: 1,
                duration: 1.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: formSection,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none none"
                }
            });
        }

        // Анимация правой части
        const rightContent = formSection.querySelector('.animate-right');
        if (rightContent) {
            gsap.fromTo(rightContent, {
                x: 250,
                opacity: 0
            }, {
                x: 0,
                opacity: 1,
                duration: 1.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: formSection,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none none"
                }
            });
        }

        // Анимация заголовка
        const title = formSection.querySelector('.animate-title');
        if (title) {
            gsap.fromTo(title, {
                y: 60,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 1.0,
                delay: 0.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: formSection,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none none"
                }
            });
        }

        // Анимация текста
        const texts = formSection.querySelectorAll('.animate-text');
        if (texts.length > 0) {
            gsap.fromTo(texts, {
                y: 40,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                delay: 0.4,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: formSection,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none none"
                }
            });
        }

        // Анимация полей формы
        const formFields = formSection.querySelectorAll('input, textarea');
        if (formFields.length > 0) {
            gsap.fromTo(formFields, {
                y: 30,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.05,
                delay: 0.6,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: formSection,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none none"
                }
            });
        }

        // Анимация кнопки
        const button = formSection.querySelector('.animate-button');
        if (button) {
            gsap.fromTo(button, {
                y: 40,
                opacity: 0,
                scale: 0.95
            }, {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                delay: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: formSection,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none none"
                }
            });
        }
    }

    isInMainSlider(element) {
        return element.closest('.main-slider') !== null;
    }

    // Анимация появления элементов при скролле
    animateOnScroll() {
        // Анимация для заголовков
        gsap.utils.toArray('.animate-title').forEach(title => {
            if (this.isInMainSlider(title)) {
                console.log('Skipping title in main slider:', title);
                return;
            }

            console.log('Animating title:', title);

            gsap.fromTo(title, {
                y: 80,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 1.0,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: title,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none none",
                    markers: false
                }
            });
        });

        // Анимация для текста
        gsap.utils.toArray('.animate-text').forEach(text => {
            if (this.isInMainSlider(text)) {
                console.log('Skipping text in main slider:', text);
                return;
            }

            console.log('Animating text:', text);

            gsap.fromTo(text, {
                y: 50,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: text,
                    start: "top 85%",
                    end: "bottom 15%",
                    toggleActions: "play none none none"
                }
            });
        });

        // Анимация для изображений
        gsap.utils.toArray('.animate-image').forEach(image => {
            if (this.isInMainSlider(image)) {
                console.log('Skipping image in main slider:', image);
                return;
            }

            console.log('Animating image:', image);

            gsap.fromTo(image, {
                scale: 0.95,
                opacity: 0
            }, {
                scale: 1,
                opacity: 1,
                duration: 1.0,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: image,
                    start: "top 75%",
                    end: "bottom 25%",
                    toggleActions: "play none none none"
                }
            });
        });

        // Анимация для карточек
        gsap.utils.toArray('.animate-cards').forEach(container => {
            if (this.isInMainSlider(container)) {
                console.log('Skipping cards container in main slider:', container);
                return;
            }

            const cards = container.querySelectorAll('.card, .service-item, .product-card');

            console.log('Animating cards container:', container, 'with', cards.length, 'cards');

            gsap.fromTo(cards, {
                y: 60,
                opacity: 0,
                scale: 0.1
            }, {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 1.0,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: container,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none none"
                }
            });
        });

        // Анимация для списков
        gsap.utils.toArray('.animate-list').forEach(list => {
            if (this.isInMainSlider(list)) {
                console.log('Skipping list in main slider:', list);
                return;
            }

            const items = list.querySelectorAll('li, .list-item');

            console.log('Animating list:', list, 'with', items.length, 'items');

            gsap.fromTo(items, {
                x: -50,
                opacity: 0
            }, {
                x: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.08,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: list,
                    start: "top 85%",
                    end: "bottom 15%",
                    toggleActions: "play none none none"
                }
            });
        });

        const mainSlider = document.querySelector('.main-slider');
        if (mainSlider) {
            const animatedElementsInSlider = mainSlider.querySelectorAll(
                '.animate-title, .animate-text, .animate-image, .animate-cards, .animate-list'
            );

            animatedElementsInSlider.forEach(element => {
                const triggers = ScrollTrigger.getAll().filter(trigger =>
                    trigger.trigger === element ||
                    (trigger.vars && trigger.vars.trigger === element)
                );

                triggers.forEach(trigger => {
                    trigger.kill();
                    console.log('Killed ScrollTrigger for element in main slider:', element);
                });
            });
        }

        console.log('All scroll animations initialized (main slider excluded)');
    }

    refresh() {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
            console.log('ScrollTrigger manually refreshed');
        }
    }

    destroy() {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        }
    }
}