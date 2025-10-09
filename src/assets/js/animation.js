import { gsap } from 'gsap';

export class BannerAnimation {
    constructor() {
        // Проверяем, есть ли секция main-slider (главная страница)
        this.isMainPage = document.querySelector('.main-slider') !== null;

        // Если не главная страница - не создаем прелоадер и не запускаем анимацию
        if (!this.isMainPage) return;

        this.banner = document.querySelector('.banner');
        this.bannerLines = this.banner ? this.banner.querySelector('.banner__lines') : null;
        this.bannerImage = this.banner ? this.banner.querySelector('.banner__image') : null;

        this.lines = this.banner ? this.banner.querySelectorAll('.banner__lines .line') : [];
        this.ball = this.banner ? this.banner.querySelector('.pulsing-ball') : null;

        if (this.banner) {
            this.specialElements = this.findSpecialElements();
            this.rectElements = this.findRectElements();
            this.pathElements = this.findPathElements();

            this.specificLine = this.findSpecificLine();
            this.secondLine = this.findSecondLine();
            this.thirdLine = this.findThirdLine();
            this.fourthLine = this.findFourthLine();
            this.fifthLine = this.findFifthLine();
            this.sixthLine = this.findSixthLine();
        } else {
            this.specialElements = [];
            this.rectElements = [];
            this.pathElements = [];
            this.specificLine = null;
            this.secondLine = null;
            this.thirdLine = null;
            this.fourthLine = null;
            this.fifthLine = null;
            this.sixthLine = null;
        }

        this.animationEnabled = true;

        this.initResizeHandler();
        this.initImageChangeHandler();
        this.addPreloaderStyles();
        this.createPreloader();


        if (window.innerWidth <= 900) {
            this.initMobileAnimations();
        }

        if (this.lines.length > 0 && this.ball && this.specificLine && this.secondLine &&
            this.thirdLine && this.fourthLine && this.fifthLine && this.sixthLine) {

            window.addEventListener('load', () => {

                if (window.innerWidth <= 900) {
                    this.animateMobileContent();
                } else {
                    this.initWithPreloader();
                }
            });
        }
    }
    initMobileAnimations() {
        console.log('📱 Initializing mobile animations');


        const activeSlide = document.querySelector('.swiper-slide-active');
        if (activeSlide && activeSlide.classList.contains('main-animation')) {
            const content = activeSlide.querySelector('.main-slider__content');
            if (content) {
                // НЕ добавляем класс здесь - это сделает GSAP
                gsap.set(content, {
                    opacity: 0,
                    y: 30
                });
            }
        }


        const bestsellersTitle = document.querySelector('.bestsellers__title');
        if (bestsellersTitle) {
            gsap.set(bestsellersTitle, {
                opacity: 0,
                y: 40
            });
        }
    }


    animateMobileContent() {
        if (window.innerWidth > 900) return;


        if (this.mobileAnimationPlayed) return;
        this.mobileAnimationPlayed = true;

        console.log('📱 Starting mobile content animation');

        // Анимация контента главного слайдера
        const activeSlide = document.querySelector('.swiper-slide-active');
        if (activeSlide && activeSlide.classList.contains('main-animation')) {
            const content = activeSlide.querySelector('.main-slider__content');
            if (content && !content.classList.contains('main-slider__content--animated')) {


                content.classList.add('main-slider__content--animated');

                gsap.to(content, {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out"
                });

                // Анимация элементов внутри контента
                const title = content.querySelector('.main-slider__title');
                const info = content.querySelector('.main-slider__info');
                const link = content.querySelector('.main-slider__link');

                if (title) {
                    gsap.to(title, {
                        y: 0,
                        opacity: 1,
                        duration: 0.6,
                        delay: 0.2,
                        ease: "power2.out"
                    });
                }

                if (info) {
                    gsap.to(info, {
                        y: 0,
                        opacity: 1,
                        duration: 0.5,
                        delay: 0.3,
                        ease: "power2.out"
                    });
                }

                if (link) {
                    gsap.to(link, {
                        y: 0,
                        opacity: 1,
                        duration: 0.4,
                        delay: 0.4,
                        ease: "power2.out"
                    });
                }
            }
        }

        // Анимация заголовка хитов продаж
        this.animateBestsellersTitle();
    }

// Анимация заголовка хитов продаж
    animateBestsellersTitle() {
        const bestsellersTitle = document.querySelector('.bestsellers__title');
        if (bestsellersTitle && !bestsellersTitle.classList.contains('bestsellers__title--animated')) {


            bestsellersTitle.classList.add('bestsellers__title--animated');

            gsap.to(bestsellersTitle, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                delay: 0.5,
                ease: "power2.out"
            });
        }
    }

// Анимация контента слайда
    animateSlideContent() {
        const activeSlide = document.querySelector('.swiper-slide-active');
        // Анимируем только слайды с классом main-animation
        if (!activeSlide || !activeSlide.classList.contains('main-animation')) return;

        const content = activeSlide.querySelector('.main-slider__content');
        if (!content) return;

        console.log('🎯 Animating main animation slide content');


        if (window.innerWidth <= 900) {
            gsap.fromTo(content, {
                y: 30,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power2.out"
            });
        } else {

            gsap.set(content, {
                y: 80,
                opacity: 0
            });

            content.classList.add('main-slider__content--animated');

            gsap.to(content, {
                y: 0,
                opacity: 1,
                duration: 1.0,
                ease: "power2.out"
            });
        }


        this.animateBestsellersTitle();


        if (window.innerWidth > 900) {
            const title = content.querySelector('.main-slider__title');
            const info = content.querySelector('.main-slider__info');
            const link = content.querySelector('.main-slider__link');

            if (title) {
                gsap.fromTo(title, {
                    y: 80,
                    opacity: 0
                }, {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    delay: 0.3,
                    ease: "power2.out"
                });
            }

            if (info) {
                gsap.fromTo(info, {
                    y: 30,
                    opacity: 0
                }, {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    delay: 0.5,
                    ease: "power2.out"
                });
            }

            if (link) {
                gsap.fromTo(link, {
                    y: 20,
                    opacity: 0
                }, {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    delay: 0.7,
                    ease: "power2.out"
                });
            }
        }
    }


    findRectElements() {
        if (!this.banner) return [];

        const allRects = this.banner.querySelectorAll('rect');
        return Array.from(allRects).filter(rect => {
            const x = rect.getAttribute('x');
            const y = rect.getAttribute('y');
            const width = rect.getAttribute('width');
            const height = rect.getAttribute('height');

            return (
                (x === '38' && y === '502' && width === '11' && height === '165') ||
                (x === '1005' && y === '433' && width === '11' && height === '165') ||
                (x === '471' && y === '751' && width === '11' && height === '165')
            );
        });
    }

    findPathElements() {
        if (!this.banner) return [];

        const targetPaths = [
            "M40.3945 557.693C40.3174 558.01 40.2764 558.342 40.2764 558.683C40.2764 560.987 42.1442 562.854 44.4482 562.854C45.5498 562.854 46.5502 562.426 47.2959 561.729L57 567.402L51.2178 577.417L20 559.394L26.1738 549.379L40.3945 557.693Z",
            "M27.5543 554.901L28.7659 556.52L28.4724 558.567L26.8456 559.846L24.8386 559.605L23.6269 557.987L23.9204 555.939L25.5472 554.661L27.5543 554.901Z",
            "M50.6393 568.48L51.851 570.098L51.5574 572.146L49.9307 573.424L47.9236 573.184L46.7119 571.566L47.0054 569.518L48.6322 568.24L50.6393 568.48Z",
            "M468.439 823.613L467.124 825.292L467.497 827.455L469.34 828.834L471.573 828.623L472.888 826.944L472.515 824.781L470.672 823.402L468.439 823.613Z",
            "M493.672 810.619L492.336 812.265L492.66 814.348L494.453 815.649L496.665 815.404L498.001 813.758L497.677 811.674L495.884 810.374L493.672 810.619Z",
            "M479.601 813.854C479.632 814.053 479.649 814.258 479.649 814.466C479.649 816.81 477.59 818.711 475.05 818.711C474.066 818.711 473.155 818.423 472.407 817.938L462 823.847L467.588 833.527L502 815.189L495.194 805L479.601 813.854Z",
            "M1003.12 501.683L1001.87 503.278L1002.22 505.332L1003.97 506.643L1006.09 506.442L1007.34 504.846L1006.99 502.792L1005.24 501.481L1003.12 501.683Z",
            "M1027.09 489.338L1025.82 490.902L1026.13 492.881L1027.83 494.116L1029.93 493.884L1031.2 492.32L1030.89 490.341L1029.19 489.105L1027.09 489.338Z",
            "M1013.72 492.411C1013.75 492.601 1013.77 492.795 1013.77 492.992C1013.77 495.219 1011.81 497.025 1009.4 497.025C1008.46 497.025 1007.6 496.752 1006.89 496.291L997 501.904L1002.31 511.101L1035 493.68L1028.53 484L1013.72 492.411Z",
            "M491.594 804.977L460.999 821.947L466.72 831.979L496.13 815.178L495.447 805.147L491.594 804.977Z",
            "M1024.38 483.999L993.78 500.968L999.501 511L1028.91 494.2L1028.23 484.168L1024.38 483.999Z",
            "M30.7583 549.729L61.8808 567.697L56.1165 577.681L24.9941 559.713L25.9996 549.5L30.7583 549.729Z",
            "M493.672 810.619L492.336 812.265L492.66 814.348L494.453 815.649L496.665 815.404L498.001 813.758L497.677 811.674L495.884 810.374L493.672 810.619Z"
        ];

        const allPaths = this.banner.querySelectorAll('path');
        const pathElements = [];

        targetPaths.forEach(targetPath => {
            const element = Array.from(allPaths).find(path => {
                const d = path.getAttribute('d');
                return d && d.replace(/\s+/g, ' ').trim() === targetPath.replace(/\s+/g, ' ').trim();
            });
            if (element) {
                pathElements.push(element);
            }
        });

        return [...new Set(pathElements)];
    }

    findSpecialElements() {
        return [...this.findRectElements(), ...this.findPathElements()];
    }

    findSpecificLine() {
        if (!this.banner) return null;
        const allLines = this.banner.querySelectorAll('.banner__lines .line');
        const targetPath = "M552.5 163.5C552.5 99.0635 552.484 12.5 552.484 12.5";
        return Array.from(allLines).find(line => {
            const d = line.getAttribute('d');
            return d && d.replace(/\s+/g, ' ').trim() === targetPath.replace(/\s+/g, ' ').trim();
        });
    }

    findSecondLine() {
        if (!this.banner) return null;
        const allLines = this.banner.querySelectorAll('.banner__lines .line');
        const targetPath = "M275.5 202.5L787 130";
        return Array.from(allLines).find(line => {
            const d = line.getAttribute('d');
            return d && d.replace(/\s+/g, ' ').trim() === targetPath.replace(/\s+/g, ' ').trim();
        });
    }

    findThirdLine() {
        if (!this.banner) return null;
        const allLines = this.banner.querySelectorAll('.banner__lines .line');
        const targetPath = "M275.5 204.5L483.5 496.5";
        return Array.from(allLines).find(line => {
            const d = line.getAttribute('d');
            return d && d.replace(/\s+/g, ' ').trim() === targetPath.replace(/\s+/g, ' ').trim();
        });
    }

    findFourthLine() {
        if (!this.banner) return null;
        const allLines = this.banner.querySelectorAll('.banner__lines .line');
        const targetPath = "M780 130.93L958 319";
        return Array.from(allLines).find(line => {
            const d = line.getAttribute('d');
            return d && d.replace(/\s+/g, ' ').trim() === targetPath.replace(/\s+/g, ' ').trim();
        });
    }

    findFifthLine() {
        if (!this.banner) return null;
        const allLines = this.banner.querySelectorAll('.banner__lines .line');
        const targetPath = "M483.5 496.5L958 320";
        return Array.from(allLines).find(line => {
            const d = line.getAttribute('d');
            return d && d.replace(/\s+/g, ' ').trim() === targetPath.replace(/\s+/g, ' ').trim();
        });
    }

    findSixthLine() {
        if (!this.banner) return null;
        const allLines = this.banner.querySelectorAll('.banner__lines .line');
        const targetPath = "M511.948 487.929C513.899 487.929 514.69 488.72 514.69 489.695V512.446C514.69 516.003 514.478 518.604 513.636 520.806C512.771 523.072 511.312 524.734 509.239 526.575L488.391 542.55C486.88 543.773 486.425 545.662 486.424 548.664V769.323L478.083 820.782";
        return Array.from(allLines).find(line => {
            const d = line.getAttribute('d');
            return d && d.replace(/\s+/g, ' ').trim() === targetPath.replace(/\s+/g, ' ').trim();
        });
    }

    // Метод для инициализации обработчика ресайза
    initResizeHandler() {

        setTimeout(() => {
            this.handleResize();
        }, 100);


        this.resizeTimeout = null;
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {

                setTimeout(() => {
                    this.handleResize();
                }, 150);
            }, 100);
        });
    }

    // Метод для отслеживания изменения изображения
    initImageChangeHandler() {
        if (!this.bannerImage) return;

        // Отслеживаем загрузку lazy изображения
        if (this.bannerImage.classList.contains('lazy')) {
            this.bannerImage.addEventListener('load', () => {
                setTimeout(() => {
                    this.handleResize();
                }, 100);
            });
        }


        const picture = this.bannerImage.closest('picture');
        if (picture) {

            this.resizeObserver = new ResizeObserver((entries) => {
                for (let entry of entries) {
                    if (entry.target === this.bannerImage) {
                        setTimeout(() => {
                            this.handleResize();
                        }, 50);
                    }
                }
            });

            this.resizeObserver.observe(this.bannerImage);
        }


        this.mediaQueryList = window.matchMedia('(max-width: 1366px)');
        this.mediaQueryList.addListener(() => {
            setTimeout(() => {
                this.handleResize();
            }, 200);
        });
    }

    handleResize() {
        if (!this.banner || !this.bannerLines) return;

        const windowWidth = window.innerWidth;

        if (windowWidth <= 900) {
            this.disableAnimation();

            if (!this.mobileAnimationPlayed) {
                setTimeout(() => {
                    this.animateMobileContent();
                }, 100);
            }
            return;
        } else {
            this.enableAnimation();

            this.mobileAnimationPlayed = false;
        }

        const bannerRect = this.banner.getBoundingClientRect();
        const bannerWidth = bannerRect.width;
        const bannerHeight = bannerRect.height;


        setTimeout(() => {

            let imgRect;
            if (this.bannerImage && this.bannerImage.offsetWidth > 0) {
                imgRect = this.bannerImage.getBoundingClientRect();
            } else {
                imgRect = bannerRect;
            }


            const originalSvgWidth = 1130;
            const originalSvgHeight = 860;


            let scale, rightOffset;

            if (windowWidth <= 1100) {
                // ЛОГИКА ДЛЯ 1100px И МЕНЬШЕ
                const scaleX = bannerWidth / originalSvgWidth;
                const scaleY = bannerHeight / originalSvgHeight;
                scale = Math.min(scaleX, scaleY) * 0.96;
                rightOffset = -45; // Отступ для 1100px
            }
            else if (windowWidth <= 1300) {
                // ЛОГИКА ДЛЯ 1300px И МЕНЬШЕ
                const scaleX = bannerWidth / originalSvgWidth;
                const scaleY = bannerHeight / originalSvgHeight;
                scale = Math.min(scaleX, scaleY) * 0.95;
                rightOffset = -55;
            } else if (windowWidth <= 1366) {
                // ЛОГИКА ДЛЯ 1366px И МЕНЬШЕ (но больше 1300px)
                const scaleX = bannerWidth / originalSvgWidth;
                const scaleY = bannerHeight / originalSvgHeight;
                scale = Math.min(scaleX, scaleY) * 0.95;
                rightOffset = -65;
            } else {
                // ЛОГИКА ДЛЯ ЭКРАНОВ ВЫШЕ 1366px
                const scaleX = bannerWidth / originalSvgWidth;
                const scaleY = bannerHeight / originalSvgHeight;
                scale = Math.min(scaleX, scaleY) * 0.98;
                rightOffset = 20;
            }


            const scaledSvgWidth = originalSvgWidth * scale;
            const scaledSvgHeight = originalSvgHeight * scale;


            const topOffset = (windowWidth <= 1366) ? 0.01 : (bannerHeight - scaledSvgHeight) / 2;


            this.bannerLines.style.cssText = `
            position: absolute;
            top: ${topOffset}px;
            right: ${rightOffset}px;
            width: ${scaledSvgWidth}px;
            height: ${scaledSvgHeight}px;
            pointer-events: none;
            z-index: 2;
        `;


            const svg = this.bannerLines.querySelector('svg');
            if (svg) {
                svg.style.cssText = `
                width: 100%;
                height: 100%;
                display: block;
            `;
            }

            console.log('SVG resized:', {
                screenWidth: windowWidth,
                is1300: windowWidth <= 1300,
                is1366: windowWidth <= 1366,
                scale: scale,
                bannerSize: { width: bannerWidth, height: bannerHeight },
                imageSize: { width: imgRect.width, height: imgRect.height },
                svgSize: { width: scaledSvgWidth, height: scaledSvgHeight },
                position: { top: topOffset, right: rightOffset }
            });
        }, 50);
    }


    animateSliderText() {
        // Анимируем текст только в активном слайде
        const activeSlide = document.querySelector('.swiper-slide-active');
        if (!activeSlide || !activeSlide.classList.contains('main-animation')) return;

        const titles = activeSlide.querySelectorAll('.animate-title');
        const texts = activeSlide.querySelectorAll('.animate-text');

        // Анимация заголовков с задержкой после основной анимации
        gsap.fromTo(titles, {
            y: 50,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: 1.5,
            stagger: 0.2,
            ease: "power2.out"
        });

        // Анимация текста
        gsap.fromTo(texts, {
            y: 30,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            delay: 2.0,
            stagger: 0.1,
            ease: "power2.out"
        });
    }


    startAnimation() {

        if (window.innerWidth <= 900) {
            return;
        }

        // Анимация линий
        const lineAnimation = gsap.to(this.lines, {
            strokeDashoffset: 0,
            duration: 2,
            stagger: {
                each: 0.3,
                from: "start"
            },
            ease: "power2.out",
            onComplete: () => {
                gsap.to(this.pathElements, {
                    opacity: 1,
                    duration: 1.0,
                    stagger: 0.08,
                    ease: "power2.out"
                });
            }
        });

        gsap.to(this.rectElements, {
            opacity: 1,
            duration: 1.0,
            stagger: 0.1,
            ease: "power2.out",
            delay: 3.0,
            onComplete: () => {
                if (this.ball && this.specificLine && this.secondLine && this.thirdLine &&
                    this.fourthLine && this.fifthLine && this.sixthLine) {
                    this.animateBall();
                }
            }
        });


        this.animateSlideContent();
    }


    disableAnimation() {
        if (!this.animationEnabled) return;

        this.animationEnabled = false;


        if (this.bannerLines) {
            this.bannerLines.style.display = 'none';
        }


        gsap.globalTimeline.clear();

        console.log('Animation disabled for mobile devices (<= 900px)');
    }


    enableAnimation() {
        if (this.animationEnabled) return;

        this.animationEnabled = true;
        this.mobileAnimationPlayed = false;


        if (this.bannerLines) {
            this.bannerLines.style.display = 'block';
        }

        console.log('Animation enabled for desktop devices (> 900px)');
    }

    addPreloaderStyles() {
        const style = document.createElement('style');
        style.textContent = `
    .banner__lines {
        opacity: 0;
        visibility: hidden;
        position: absolute;
        top: 0;
        right: 0;
        pointer-events: none;
        z-index: 2;
    }
    .banner__lines--visible {
        opacity: 1;
        visibility: visible;
    }
    .banner {
        position: relative;
        width: 100%;
        overflow: hidden;
    }
    .banner__image {
        width: 100%;
        height: auto;
        display: block;
        transition: opacity 0.3s ease;
    }
    .main-animation {
        position: relative;
    }
    picture {
        display: block;
        width: 100%;
    }
    
    /* ИЗМЕНЕНО: Изначально скрываем контент на всех устройствах */
    .main-slider__content {
        opacity: 0;
        visibility: hidden;
        transform: translateY(30px);
    }
    
    /* ИЗМЕНЕНО: Убрали принудительное отображение для мобильных */
    .main-slider__content--animated {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }

    /* ИЗМЕНЕНО: Скрываем заголовок хитов продаж изначально */
    .bestsellers__title {
        opacity: 0;
        transform: translateY(40px);
    }
    
    .bestsellers__title--animated {
        opacity: 1;
        transform: translateY(0);
    }
    
    @media (max-width: 1366px) {
        .banner__lines {
            right: 10px;
        }
    }

    @media (max-width: 900px) {
        .banner__lines {
            display: none;
        }
    }
`;
        document.head.appendChild(style);
    }
    createPreloader() {

        if (window.innerWidth <= 900) {
            console.log('Preloader skipped for mobile devices');


            this.initMobileAnimations();


            setTimeout(() => {
                this.animateMobileContent();
            }, 300);
            return;
        }

        // Создаем элемент прелоадера
        this.preloader = document.createElement('div');
        this.preloader.className = 'preloader';
        this.preloader.innerHTML = `
            <div class="preloader__content">
                <div class="preloader__icon">
                    <svg width="18" height="40" viewBox="0 0 18 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.6471 0V16.6185H17.2352L7.41075 39.9997V23.2599H0.764771L10.6471 0Z" fill="#F99A1C"></path>
                        <g filter="url(#filter0_i_150_6133)">
                            <path d="M10.6466 16.6187H17.2348L7.41028 39.9998V23.26L10.6466 16.6187Z" fill="#F07000"></path>
                        </g>
                        <defs>
                            <filter id="filter0_i_150_6133" x="7.41028" y="16.6187" width="9.82449" height="24.5576" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                                <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
                                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feFlood>
                                <feOffset dy="1.17646"></feOffset>
                                <feGaussianBlur stdDeviation="1.76469"></feGaussianBlur>
                                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
                                <feColorMatrix type="matrix" values="0 0 0 0 0.735577 0 0 0 0 0.196154 0 0 0 0 0 0 0 0 1 0"></feColorMatrix>
                                <feBlend mode="normal" in2="shape" result="effect1_innerShadow_150_6133"></feBlend>
                            </filter>
                        </defs>
                    </svg>
                </div>
                <div class="preloader__circle">
                    <svg class="preloader__circle-svg" viewBox="0 0 100 100">
                        <circle class="preloader__circle-bg" cx="50" cy="50" r="45"/>
                        <circle class="preloader__circle-progress" cx="50" cy="50" r="45"/>
                    </svg>
                </div>
            </div>
        `;


        const preloaderStyle = document.createElement('style');
        preloaderStyle.textContent = `
            .preloader {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: #0F162B;
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                opacity: 1;
                transition: opacity 0.5s ease;
            }

            .preloader__content {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 40px;
                position: relative;
            }

            .preloader__icon {
                animation: pulse 1.5s ease-in-out infinite;
                z-index: 2;
                position: relative;
            }

            .preloader__circle {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 80px;
                height: 80px;
            }

            .preloader__circle-svg {
                width: 100%;
                height: 100%;
                transform: rotate(-90deg);
            }

            .preloader__circle-bg {
                fill: none;
                stroke: rgba(255, 255, 255, 0.1);
                stroke-width: 3;
            }

            .preloader__circle-progress {
                fill: none;
                stroke: #F99A1C;
                stroke-width: 3;
                stroke-linecap: round;
                stroke-dasharray: 283;
                stroke-dashoffset: 283;
                transition: stroke-dashoffset 0.3s ease;
            }

            @keyframes pulse {
                0% {
                    transform: scale(1);
                    opacity: 1;
                }
                50% {
                    transform: scale(1.1);
                    opacity: 0.8;
                }
                100% {
                    transform: scale(1);
                    opacity: 1;
                }
            }

            .preloader--hidden {
                opacity: 0;
                pointer-events: none;
            }

            /* Скрываем прелоадер на мобильных устройствах */
            @media (max-width: 900px) {
                .preloader {
                    display: none;
                }
            }
        `;

        document.head.appendChild(preloaderStyle);
        document.body.appendChild(this.preloader);
    }

    initWithPreloader() {

        if (window.innerWidth <= 900) {
            console.log('Animation skipped for mobile devices');
            this.animateMobileContent();
            return;
        }


        this.handleResize();

        // Анимация кругового прогресс-бара
        const progressCircle = this.preloader.querySelector('.preloader__circle-progress');

        // Анимация заполнения круга
        gsap.to(progressCircle, {
            strokeDashoffset: 0,
            duration: 2,
            ease: 'power2.inOut',
            onComplete: () => {
                setTimeout(() => {
                    this.hidePreloader();
                }, 500);
            }
        });
    }

    hidePreloader() {

        if (window.innerWidth <= 900) {
            return;
        }

        // Анимация скрытия прелоадера
        gsap.to(this.preloader, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out',
            onComplete: () => {
                this.preloader.classList.add('preloader--hidden');


                if (this.bannerLines) {
                    this.bannerLines.classList.add('banner__lines--visible');
                }


                this.init();
            }
        });
    }

    init() {

        if (window.innerWidth <= 900) {
            console.log('Animation initialization skipped for mobile devices');
            return;
        }

        this.setupAnimation();
        this.startAnimation();
    }

    setupAnimation() {

        if (window.innerWidth <= 900) {
            return;
        }


        this.specialElements.forEach(element => {
            gsap.set(element, {
                opacity: 0
            });
        });


        this.lines.forEach(line => {
            const length = line.getTotalLength();
            gsap.set(line, {
                strokeDasharray: length,
                strokeDashoffset: length,
                opacity: 1
            });
        });

        if (this.ball && this.specificLine) {
            const length = this.specificLine.getTotalLength();
            const endPoint = this.specificLine.getPointAtLength(length);

            gsap.set(this.ball, {
                attr: {
                    cx: endPoint.x,
                    cy: endPoint.y,
                    r: 12
                },
                opacity: 0,
                scale: 0
            });
        }
    }




    animateBall() {

        if (window.innerWidth <= 900) {
            return;
        }

        const line = this.specificLine;
        const length = line.getTotalLength();
        const startPoint = line.getPointAtLength(0);
        const endPoint = line.getPointAtLength(length);

        gsap.to(this.ball, {
            opacity: 1,
            scale: 1,
            duration: 0.1,
            ease: "power2.out",
            onComplete: () => {

                gsap.to(this.ball, {
                    attr: {
                        cx: startPoint.x,
                        cy: startPoint.y
                    },
                    duration: 1.5,
                    ease: "power1.out",
                    onComplete: () => {
                        this.splitAndMoveBalls();
                    }
                });
            }
        });
    }

    splitAndMoveBalls() {
        const secondLine = this.secondLine;
        const secondLineLength = secondLine.getTotalLength();
        const centerPoint = secondLine.getPointAtLength(secondLineLength / 2);

        const ball1 = this.ball.cloneNode(true);
        const ball2 = this.ball.cloneNode(true);

        ball1.setAttribute('r', '8');
        ball2.setAttribute('r', '8');

        ball1.setAttribute('cx', centerPoint.x);
        ball1.setAttribute('cy', centerPoint.y);
        ball2.setAttribute('cx', centerPoint.x);
        ball2.setAttribute('cy', centerPoint.y);

        this.ball.parentNode.appendChild(ball1);
        this.ball.parentNode.appendChild(ball2);

        gsap.set(this.ball, { opacity: 0 });

        const secondLineStart = secondLine.getPointAtLength(0);
        const secondLineEnd = secondLine.getPointAtLength(secondLineLength);

        this.moveBallToThirdLine(ball1, secondLineStart);
        this.moveBallToFourthLine(ball2, secondLineEnd);
    }

    moveBallToThirdLine(ball, targetPoint) {
        gsap.to(ball, {
            attr: {
                cx: targetPoint.x,
                cy: targetPoint.y
            },
            duration: 1,
            ease: "power1.out",
            onComplete: () => {
                this.moveToThirdLine(ball, targetPoint);
            }
        });
    }

    moveBallToFourthLine(ball, targetPoint) {
        gsap.to(ball, {
            attr: {
                cx: targetPoint.x,
                cy: targetPoint.y
            },
            duration: 1,
            ease: "power1.out",
            onComplete: () => {
                this.moveToFourthLine(ball, targetPoint);
            }
        });
    }

    moveToThirdLine(ball, currentPosition) {
        const thirdLine = this.thirdLine;
        const thirdLineLength = thirdLine.getTotalLength();

        const thirdLineStart = thirdLine.getPointAtLength(0);
        const thirdLineEnd = thirdLine.getPointAtLength(thirdLineLength);

        gsap.to(ball, {
            attr: {
                cx: thirdLineStart.x,
                cy: thirdLineStart.y
            },
            duration: 0.5,
            ease: "power1.out",
            onComplete: () => {
                gsap.to(ball, {
                    attr: {
                        cx: thirdLineEnd.x,
                        cy: thirdLineEnd.y
                    },
                    duration: 1.5,
                    ease: "power1.out",
                    onComplete: () => {
                        this.moveToFifthLineFromThird(ball, thirdLineEnd);
                    }
                });
            }
        });
    }

    moveToFourthLine(ball, currentPosition) {
        const fourthLine = this.fourthLine;
        const fourthLineLength = fourthLine.getTotalLength();

        const fourthLineStart = fourthLine.getPointAtLength(0);
        const fourthLineEnd = fourthLine.getPointAtLength(fourthLineLength);

        gsap.to(ball, {
            attr: {
                cx: fourthLineStart.x,
                cy: fourthLineStart.y
            },
            duration: 0.5,
            ease: "power1.out",
            onComplete: () => {
                gsap.to(ball, {
                    attr: {
                        cx: fourthLineEnd.x,
                        cy: fourthLineEnd.y
                    },
                    duration: 1.5,
                    ease: "power1.out",
                    onComplete: () => {
                        this.moveToFifthLineFromFourth(ball, fourthLineEnd);
                    }
                });
            }
        });
    }

    moveToFifthLineFromThird(ball, currentPosition) {
        const fifthLine = this.fifthLine;
        const fifthLineLength = fifthLine.getTotalLength();

        const startPoint = fifthLine.getPointAtLength(0);
        const targetPoint = fifthLine.getPointAtLength(fifthLineLength * 0.05);

        gsap.to(ball, {
            attr: {
                cx: startPoint.x,
                cy: startPoint.y
            },
            duration: 0.3,
            ease: "power1.out",
            onComplete: () => {
                gsap.to(ball, {
                    attr: {
                        cx: targetPoint.x,
                        cy: targetPoint.y
                    },
                    duration: 0.8,
                    ease: "power1.out",
                    onComplete: () => {
                        this.moveToSixthLine(ball, targetPoint);
                    }
                });
            }
        });
    }

    moveToFifthLineFromFourth(ball, currentPosition) {
        const fifthLine = this.fifthLine;
        const fifthLineLength = fifthLine.getTotalLength();

        const fifthLineStart = fifthLine.getPointAtLength(0);
        const fifthLineEnd = fifthLine.getPointAtLength(fifthLineLength);

        const distanceToStart = Math.sqrt(
            Math.pow(currentPosition.x - fifthLineStart.x, 2) +
            Math.pow(currentPosition.y - fifthLineStart.y, 2)
        );

        const distanceToEnd = Math.sqrt(
            Math.pow(currentPosition.x - fifthLineEnd.x, 2) +
            Math.pow(currentPosition.y - fifthLineEnd.y, 2)
        );

        let targetPoint;

        if (distanceToStart < distanceToEnd) {
            targetPoint = fifthLine.getPointAtLength(fifthLineLength * 0.95);
        } else {
            targetPoint = fifthLine.getPointAtLength(fifthLineLength * 0.05);
        }

        gsap.to(ball, {
            attr: {
                cx: targetPoint.x,
                cy: targetPoint.y
            },
            duration: 1.8,
            ease: "power1.out",
            onComplete: () => {
                this.moveToSixthLine(ball, targetPoint);
            }
        });
    }

    moveToSixthLine(ball, currentPosition) {
        const sixthLine = this.sixthLine;
        const sixthLineLength = sixthLine.getTotalLength();
        const sixthLineEnd = sixthLine.getPointAtLength(sixthLineLength);

        const cometTail = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        cometTail.setAttribute('cx', currentPosition.x);
        cometTail.setAttribute('cy', currentPosition.y);
        cometTail.setAttribute('r', '4');
        cometTail.setAttribute('fill', 'rgba(255,255,255,0.6)');
        cometTail.setAttribute('class', 'comet-tail');
        ball.parentNode.appendChild(cometTail);

        gsap.to(ball, {
            attr: {
                cx: sixthLineEnd.x,
                cy: sixthLineEnd.y
            },
            duration: 1.5,
            ease: "power2.out",
            onUpdate: function() {
                const progress = this.progress();
                const currentX = parseFloat(ball.getAttribute('cx'));
                const currentY = parseFloat(ball.getAttribute('cy'));

                cometTail.setAttribute('cx', currentX);
                cometTail.setAttribute('cy', currentY);

                if (progress > 0.7) {
                    const scale = 1 + (progress - 0.7) * 1.5;
                    gsap.set(ball, { scale: scale });

                    const tailSize = 4 + (progress - 0.7) * 8;
                    cometTail.setAttribute('r', tailSize);
                    cometTail.setAttribute('fill', `rgba(255,255,255,${0.8 - (progress - 0.7) * 0.8})`);
                }
            },
            onComplete: () => {
                this.createPowerfulExplosion(sixthLineEnd, ball, cometTail);
            }
        });
    }

    createPowerfulExplosion(position, ball, cometTail) {
        const mainFlash = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        mainFlash.setAttribute('cx', position.x);
        mainFlash.setAttribute('cy', position.y);
        mainFlash.setAttribute('r', '5');
        mainFlash.setAttribute('fill', '#ffffff');
        mainFlash.setAttribute('class', 'explosion-flash');
        ball.parentNode.appendChild(mainFlash);

        for (let i = 0; i < 5; i++) {
            this.createExplosionParticle(position, ball.parentNode, i);
        }

        gsap.to(mainFlash, {
            attr: { r: 40 },
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => {
                if (mainFlash.parentNode) {
                    mainFlash.parentNode.removeChild(mainFlash);
                }
            }
        });

        gsap.to(ball, {
            attr: { r: 25 },
            duration: 0.1,
            ease: "power2.out",
            onComplete: () => {
                gsap.to(ball, {
                    opacity: 0,
                    scale: 0,
                    duration: 0.2,
                    onComplete: () => {
                        if (cometTail.parentNode) {
                            cometTail.parentNode.removeChild(cometTail);
                        }
                        if (ball.parentNode) {
                            ball.parentNode.removeChild(ball);
                        }
                    }
                });
            }
        });
    }

    createExplosionParticle(position, parent, index) {
        const particle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        particle.setAttribute('cx', position.x);
        particle.setAttribute('cy', position.y);
        particle.setAttribute('r', '3');
        particle.setAttribute('fill', 'rgba(255,255,255,0.8)');
        particle.setAttribute('class', 'explosion-particle');
        parent.appendChild(particle);

        const angle = (index * 72 + Math.random() * 30) * (Math.PI / 180);
        const distance = 30 + Math.random() * 20;

        const targetX = position.x + Math.cos(angle) * distance;
        const targetY = position.y + Math.sin(angle) * distance;

        gsap.to(particle, {
            attr: {
                cx: targetX,
                cy: targetY,
                r: 2
            },
            opacity: 0,
            duration: 0.8 + Math.random() * 0.4,
            ease: "power2.out",
            delay: index * 0.05,
            onComplete: () => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }
        });
    }


    destroy() {
        window.removeEventListener('resize', this.handleResize.bind(this));
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        if (this.mediaQueryList) {
            this.mediaQueryList.removeListener();
        }
    }
}