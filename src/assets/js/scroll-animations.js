import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        if (!this.isMainPage()) {
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
            return;
        }

        if (typeof ScrollTrigger === 'undefined') {
            return;
        }


        this.animateVisibleElementsImmediately();


        this.animateOnScroll();
        this.animateBestsellersSection();
        this.animateAdvantagesSection();
        this.animatePartnersSection();
        this.animateNewsSection();
        this.animateFormSection();

        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 500);
    }

    // Метод для проверки видимости элемента
    isElementInViewport(element) {
        if (!element) return false;

        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;

        return (
            rect.top >= 0 &&
            rect.bottom <= windowHeight
        );
    }

    // Анимация сразу видимых элементов при загрузке
    animateVisibleElementsImmediately() {

        const bestsellersTitle = document.querySelector('.bestsellers__title');
        if (bestsellersTitle &&
            !bestsellersTitle.classList.contains('bestsellers__title--animated') &&
            this.isElementInViewport(bestsellersTitle)) {

            gsap.to(bestsellersTitle, {
                y: 0,
                opacity: 1,
                duration: 1.0,
                ease: "power2.out",
                onComplete: () => {
                    bestsellersTitle.classList.add('bestsellers__title--animated');
                }
            });
        }
    }

    // Анимация для секции "Хиты продаж"
    animateBestsellersSection() {
        const bestsellersTabs = document.querySelector('.bestsellers__tabs');
        if (!bestsellersTabs) {
            return;
        }

        // Анимация заголовка (если еще не анимирован)
        const title = document.querySelector('.bestsellers__title');
        if (title && !title.classList.contains('bestsellers__title--animated')) {
            const isMobile = window.innerWidth <= 900;

            gsap.to(title, {
                y: 0,
                opacity: 1,
                duration: isMobile ? 0.8 : 1.0,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: bestsellersTabs,
                    start: "top 90%",
                    end: "bottom 10%",
                    toggleActions: "play none none none",
                    onEnter: () => {
                        title.classList.add('bestsellers__title--animated');
                    },
                    onEnterBack: () => {
                        title.classList.add('bestsellers__title--animated');
                    }
                }
            });
        }

        // Анимация контента (табов и карточек) с задержкой
        const bestsellersContent = document.querySelector('.bestsellers__content');
        if (bestsellersContent) {
            const isMobile = window.innerWidth <= 900;

            gsap.to(bestsellersContent, {
                y: 0,
                opacity: 1,
                duration: 1.0,
                delay: isMobile ? 0.4 : 0.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: bestsellersTabs,
                    start: "top 85%",
                    end: "bottom 15%",
                    toggleActions: "play none none none"
                }
            });
        }

        // Анимация отдельных карточек товаров с дополнительной задержкой
        const productCards = document.querySelectorAll('.bestsellers .product-card, .bestsellers .card');
        if (productCards.length > 0) {
            const isMobile = window.innerWidth <= 900;

            gsap.fromTo(productCards, {
                y: 30,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                delay: isMobile ? 0.6 : 0.4,
                stagger: 0.1,
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
            return;
        }

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
            return;
        }

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
            return;
        }

        const title = newsSection.querySelector('.main-news__title');
        if (title) {
            title.classList.remove('animate-title');

            gsap.fromTo(title, {
                y: 80,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 1.0,
                ease: "none",
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
                scale: 0.95
            }, {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 1.0,
                stagger: 0.15,
                ease: "none",
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
                ease: "none",
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
            return;
        }

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

    // Проверка, является ли элемент input или textarea
    isFormElement(element) {
        return element.tagName === 'INPUT' || element.tagName === 'TEXTAREA';
    }

    // Анимация появления элементов при скролле
    animateOnScroll() {
        // Анимация для заголовков
        gsap.utils.toArray('.animate-title').forEach(title => {
            if (!title || !title.isConnected) return;
            if (this.isInMainSlider(title) || this.isFormElement(title)) {
                return;
            }

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
            if (!text || !text.isConnected) return;
            if (this.isInMainSlider(text) || this.isFormElement(text)) {
                return;
            }

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
            if (!image || !image.isConnected) return;
            if (this.isInMainSlider(image) || this.isFormElement(image)) {
                return;
            }

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
            if (!container || !container.isConnected) return;
            if (this.isInMainSlider(container)) {
                return;
            }

            const cards = container.querySelectorAll('.card, .service-item, .product-card');
            // Исключаем инпуты из анимации карточек
            const filteredCards = Array.from(cards).filter(card =>
                !card.querySelector('input') && !card.querySelector('textarea')
            );

            if (filteredCards.length > 0) {
                gsap.fromTo(filteredCards, {
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
            }
        });

        // Анимация для списков
        gsap.utils.toArray('.animate-list').forEach(list => {
            if (!list || !list.isConnected) return;
            if (this.isInMainSlider(list)) {
                return;
            }

            const items = list.querySelectorAll('li, .list-item');
            // Исключаем инпуты из анимации списков
            const filteredItems = Array.from(items).filter(item =>
                !item.querySelector('input') && !item.querySelector('textarea')
            );

            if (filteredItems.length > 0) {
                gsap.fromTo(filteredItems, {
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
            }
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
                });
            });
        }
    }

    refresh() {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }

    destroy() {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        }
    }
}