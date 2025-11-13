import { gsap } from 'gsap';

export class BannerAnimation {
    constructor() {
        // Проверяем, главная ли это страница
        this.isMainPage = document.querySelector('.main-slider') !== null;

        // Проверяем мобильное устройство
        this.isMobile = window.innerWidth <= 900;

        // Если не главная страница ИЛИ мобильное устройство - не создаем прелоадер и не запускаем анимацию
        if (!this.isMainPage || this.isMobile) {
            // Скрываем прелоадер
            this.hidePreloaderImmediately();

            // На мобильных запускаем только анимацию заголовка
            if (this.isMobile) {
                setTimeout(() => {
                    this.animateMobileContent();
                }, 500);
            }
            return;
        }

        // Только для главной страницы показываем прелоадер
        this.showPreloader();

        this.banner = document.querySelector('.banner');
        this.preloader = document.getElementById('preloader');
        this.svgLines = null;
        this.otherElements = null;
        this.lightningElements = null;

        this.animationEnabled = true;
        this.pageLoaded = false;
        this.animationReady = false;

        // Сразу скрываем линии при создании экземпляра
        this.hideElementsImmediately();

        setTimeout(() => {
            this.initWithPreloader();
        }, 100);

        this.initResizeHandler();
    }

    // Добавляем метод для обработки изменения размера
    initResizeHandler() {
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= 900;
        });
    }

    // Метод: скрываем линии и другие элементы (кроме clip-path и filter элементов)
    hideElementsImmediately() {
        const linesContainer = this.banner?.querySelector('.banner__lines');
        if (!linesContainer) return;

        // Скрываем основные линии
        const allPaths = linesContainer.querySelectorAll('path');
        if (!allPaths.length) return;

        const pathsToAnimate = [
            'M238.5 202.452L746 131.5',
            'M711.5 394.452L505.5 172.452V162.952',
            'M382.438 174.529C382.438 181.601 382.438 185.565 382.438 192.637L591.075 440.461',
            'M819.5 355.452L622.5 157.452V139.952',
            'M445 497.705L919.5 321.205',
            'M449.747 539.089C446.863 541.399 446.436 544.807 446.435 547.976L445.975 732.5C445.983 733 446.107 734.117 447.5 735C456.09 740.445 514.862 773.038 515.5 773.5L518.5 771.5L450.979 733.075C450.354 732.72 449.968 732.056 449.968 731.337V547.978C449.969 544.976 450.425 543.087 451.936 541.863L472.684 525.971L472.736 525.932L472.784 525.889C474.856 524.048 476.315 522.385 477.181 520.119C478.023 517.917 478.235 515.316 478.235 511.76V489.009C478.235 488.033 477.444 487.242 476.468 487.242C475.493 487.242 474.702 488.033 474.702 489.009V511.76C474.702 515.27 474.474 517.306 473.881 518.858C473.316 520.337 472.354 521.537 470.474 523.212L449.778 539.065L449.762 539.077L449.747 539.089Z',
            'M238.5 206.5L92.9171 370.295C90.6243 372.874 92.4573 376.966 95.9083 377.01C103.746 377.11 109.175 377.285 121.354 377.077C125.239 377.011 128.971 378.657 131.509 381.6L143.5 395.5',
            'M874.5 460.155L966.729 489.167L972 491L975 489L874.5 456.5V460.155Z',
            'M437 820.314C437.887 820.955 439.077 820.986 439.995 820.391L975.001 492.314V489L966.955 494L438.582 817.096L437 818V820.314Z',
            'M438.5 818.5L4 562.452',
            'M4 562.452C53.8156 550.842 97.6844 541.11 147.5 529.5',
            'M214 527V593.5L102 620',
            'M918.13 318.952L914.887 328.681V337.33C914.887 346.41 914.887 348.68 906.78 352.464C899.753 355.743 893.018 357.881 888.5 360.5C884.971 362.546 874.018 368.5 874.018 379L872.518 510.5C872.518 520 873.5 522 884 526.5L904.5 535',
            'M916 322.204L745 148.134V133',
            'M238 196V206.5L446 498.5'
        ];

        // Скрываем основные линии через stroke-dash
        allPaths.forEach(path => {
            const dAttribute = path.getAttribute('d');
            if (pathsToAnimate.includes(dAttribute)) {
                const length = path.getTotalLength();

                if (path.getAttribute('stroke') && path.getAttribute('stroke') !== 'none') {
                    path.style.strokeDasharray = length;
                    path.style.strokeDashoffset = length;
                }

                if (path.getAttribute('fill') && path.getAttribute('fill') !== 'none') {
                    path.style.fillOpacity = '0';
                }
            }
        });

        // Скрываем все остальные элементы (path, ellipse, rect), кроме тех что в g с clip-path или filter
        const allElements = linesContainer.querySelectorAll('path, ellipse, rect');
        allElements.forEach(element => {
            // Пропускаем основные линии, которые уже скрыты через stroke-dash
            if (element.tagName === 'path') {
                const dAttribute = element.getAttribute('d');
                if (pathsToAnimate.includes(dAttribute)) {
                    return;
                }
            }

            // Пропускаем элементы внутри g с clip-path
            const parentGWithClipPath = element.closest('g[clip-path]');
            if (parentGWithClipPath) {
                return;
            }

            // Пропускаем элементы внутри g с filter (молния) - они остаются видимыми
            const parentGWithFilter = element.closest('g[filter]');
            if (parentGWithFilter) {
                return;
            }

            // Скрываем все остальные элементы через opacity
            element.style.opacity = '0';
        });
    }

    showPreloader() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.display = 'flex';
            preloader.style.opacity = '1';
            preloader.style.visibility = 'visible';
        }
    }

    hidePreloaderImmediately() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.display = 'none';
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        }
    }

    animateMobileContent() {
        const activeSlide = document.querySelector('.swiper-slide-active');
        if (activeSlide && activeSlide.classList.contains('main-animation')) {
            const content = activeSlide.querySelector('.main-slider__content');
            if (content) {
                content.classList.add('main-slider__content--animated');

                gsap.fromTo(content,
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
                );
            }
        }
    }

    // Анимация плавной отрисовки только указанных линий SVG
    animateSVGLines() {
        if (this.isMobile) return;
        const linesContainer = this.banner?.querySelector('.banner__lines');
        if (!linesContainer) return;

        const allPaths = linesContainer.querySelectorAll('path');
        if (!allPaths.length) return;

        const pathsToAnimate = [
            'M238.5 202.452L746 131.5',
            'M711.5 394.452L505.5 172.452V162.952',
            'M382.438 174.529C382.438 181.601 382.438 185.565 382.438 192.637L591.075 440.461',
            'M819.5 355.452L622.5 157.452V139.952',
            'M445 497.705L919.5 321.205',
            'M449.747 539.089C446.863 541.399 446.436 544.807 446.435 547.976L445.975 732.5C445.983 733 446.107 734.117 447.5 735C456.09 740.445 514.862 773.038 515.5 773.5L518.5 771.5L450.979 733.075C450.354 732.72 449.968 732.056 449.968 731.337V547.978C449.969 544.976 450.425 543.087 451.936 541.863L472.684 525.971L472.736 525.932L472.784 525.889C474.856 524.048 476.315 522.385 477.181 520.119C478.023 517.917 478.235 515.316 478.235 511.76V489.009C478.235 488.033 477.444 487.242 476.468 487.242C475.493 487.242 474.702 488.033 474.702 489.009V511.76C474.702 515.27 474.474 517.306 473.881 518.858C473.316 520.337 472.354 521.537 470.474 523.212L449.778 539.065L449.762 539.077L449.747 539.089Z',
            'M238.5 206.5L92.9171 370.295C90.6243 372.874 92.4573 376.966 95.9083 377.01C103.746 377.11 109.175 377.285 121.354 377.077C125.239 377.011 128.971 378.657 131.509 381.6L143.5 395.5',
            'M874.5 460.155L966.729 489.167L972 491L975 489L874.5 456.5V460.155Z',
            'M437 820.314C437.887 820.955 439.077 820.986 439.995 820.391L975.001 492.314V489L966.955 494L438.582 817.096L437 818V820.314Z',
            'M438.5 818.5L4 562.452',
            'M4 562.452C53.8156 550.842 97.6844 541.11 147.5 529.5',
            'M214 527V593.5L102 620',
            'M918.13 318.952L914.887 328.681V337.33C914.887 346.41 914.887 348.68 906.78 352.464C899.753 355.743 893.018 357.881 888.5 360.5C884.971 362.546 874.018 368.5 874.018 379L872.518 510.5C872.518 520 873.5 522 884 526.5L904.5 535',
            'M916 322.204L745 148.134V133',
            'M238 196V206.5L446 498.5'
        ];

        this.svgLines = Array.from(allPaths).filter(path => {
            const dAttribute = path.getAttribute('d');
            return pathsToAnimate.includes(dAttribute);
        });

        if (!this.svgLines.length) {
            return;
        }

        // Запускаем анимацию остальных элементов, когда дорисовывается предпоследняя линия
        const totalAnimationTime = 2;
        const otherElementsDelay = totalAnimationTime * 0.7;

        setTimeout(() => {
            this.animateOtherElements();
        }, otherElementsDelay * 1000);

        // Запускаем молнию, когда начинается отрисовка последней линии
        const lightningDelay = totalAnimationTime * 0.85;
        setTimeout(() => {
            this.animateLightning();
        }, lightningDelay * 1000);

        // Анимация отрисовки линий БЕЗ ЗАДЕРЖКИ
        gsap.to(this.svgLines, {
            strokeDashoffset: 0,
            fillOpacity: 1,
            duration: totalAnimationTime,
            delay: 0,
            stagger: {
                amount: 1.5,
                from: "random"
            },
            ease: "power2.out",
            onComplete: () => {
                this.svgLines.forEach(line => {
                    if (line.getAttribute('stroke') && line.getAttribute('stroke') !== 'none') {
                        line.style.strokeDasharray = '';
                        line.style.strokeDashoffset = '';
                    }
                });
            }
        });
    }

// Анимация молнии - запускается сразу после линий
    animateLightning() {
        const linesContainer = this.banner?.querySelector('.banner__lines');
        if (!linesContainer) return;

        // Находим все элементы молнии (внутри g с filter)
        const lightningGroups = linesContainer.querySelectorAll('g[filter]');
        if (!lightningGroups.length) return;

        // Собираем все path элементов молнии
        const allLightningPaths = [];
        lightningGroups.forEach(group => {
            const paths = group.querySelectorAll('path');
            paths.forEach(path => {
                allLightningPaths.push(path);
            });
        });

        if (!allLightningPaths.length) return;

        // Легкое увеличение яркости молнии
        allLightningPaths.forEach(path => {
            path.style.filter = 'brightness(1.2)';
        });

        // Разделяем элементы молнии на три группы для более сложной анимации
        const group1 = allLightningPaths.slice(0, Math.ceil(allLightningPaths.length / 3));
        const group2 = allLightningPaths.slice(Math.ceil(allLightningPaths.length / 3), Math.ceil(allLightningPaths.length * 2 / 3));
        const group3 = allLightningPaths.slice(Math.ceil(allLightningPaths.length * 2 / 3));

        // Более сдержанная анимация молнии
        const lightningTimeline = gsap.timeline();

        lightningTimeline
            // Первая вспышка - все группы
            .to(allLightningPaths, {
                opacity: 1,
                duration: 0.06,
                ease: "power2.out"
            })
            .to(allLightningPaths, {
                opacity: 0.3,
                duration: 0.04,
                ease: "power2.in"
            })
            // Вторая вспышка - группы 1 и 2
            .to([...group1, ...group2], {
                opacity: 1,
                duration: 0.05,
                ease: "power2.out"
            }, "-=0.015")
            .to([...group1, ...group2], {
                opacity: 0.4,
                duration: 0.03,
                ease: "power2.in"
            })
            // Третья вспышка - все группы
            .to(allLightningPaths, {
                opacity: 1,
                duration: 0.07,
                ease: "power2.out"
            }, "-=0.015")
            .to(allLightningPaths, {
                opacity: 0.2,
                duration: 0.04,
                ease: "power2.in"
            })
            // Четвертая вспышка - группы 2 и 3
            .to([...group2, ...group3], {
                opacity: 1,
                duration: 0.05,
                ease: "power2.out"
            }, "-=0.01")
            .to([...group2, ...group3], {
                opacity: 0.5,
                duration: 0.03,
                ease: "power2.in"
            })
            // Пятая вспышка - все группы
            .to(allLightningPaths, {
                opacity: 1,
                duration: 0.06,
                ease: "power2.out"
            }, "-=0.015")
            .to(allLightningPaths, {
                opacity: 0.3,
                duration: 0.04,
                ease: "power2.in"
            })
            // Финальное затухание до нормального состояния
            .to(allLightningPaths, {
                opacity: 1,
                duration: 0.2,
                ease: "power2.out",
                onComplete: () => {
                    // Убираем временные стили
                    allLightningPaths.forEach(path => {
                        path.style.filter = '';
                    });
                }
            })
            // Сразу после молнии запускаем шарик
            .add(() => {
                this.animateBallAfterLightning();
            });

        return lightningTimeline;
    }

    // Анимация шарика после молнии
    animateBallAfterLightning() {
        if (this.isMobile) return;
        const linesContainer = this.banner?.querySelector('.banner__lines');
        if (!linesContainer) return;

        const targetLine = linesContainer.querySelector('path[d="M505.5 163.452C505.5 99.0156 505.484 12.4521 505.484 12.4521"]');
        if (!targetLine) return;

        const lineLength = targetLine.getTotalLength();

        // Находим начальную точку (12.4521) - это КОНЕЦ линии
        const startPoint = targetLine.getPointAtLength(lineLength);

        // Находим конечную точку (M505.5) - это НАЧАЛО линии
        const endPoint = targetLine.getPointAtLength(0);

        // Создаем шарик
        const ball = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        ball.setAttribute('class', 'pulsing-ball');
        ball.setAttribute('r', '14');
        ball.setAttribute('fill', '#F07000');

        // Шарик полностью скрыт изначально
        ball.setAttribute('opacity', '0');

        linesContainer.querySelector('svg').appendChild(ball);

        // Анимация шарика
        const ballTimeline = gsap.timeline();

        ballTimeline
            // Устанавливаем шарик в начальной точке и полностью скрытым
            .set(ball, {
                attr: {
                    cx: startPoint.x,
                    cy: startPoint.y,
                    r: 14
                },
                opacity: 0
            })
            // Появление в начальной точке
            .to(ball, {
                opacity: 1,
                duration: 0.1,
                ease: "power2.out"
            })
            // Запускаем пульсацию
            .to(ball, {
                attr: { r: 16 },
                duration: 0.4,
                repeat: -1, // Бесконечное повторение
                yoyo: true, // Туда-обратно
                ease: "sine.inOut"
            })
            // Движение по линии от конца к началу - ЧУТЬ БЫСТРЕЕ
            .to(ball, {
                duration: 1, // Было 2.0, стало 1.8 - чуть быстрее
                ease: "power1.inOut",
                onUpdate: function() {
                    const progress = this.progress();
                    const point = targetLine.getPointAtLength(lineLength * (1 - progress));
                    ball.setAttribute('cx', point.x);
                    ball.setAttribute('cy', point.y);
                },
                onComplete: () => {
                    ball.setAttribute('cx', endPoint.x);
                    ball.setAttribute('cy', endPoint.y);
                    this.createBallSplitEffect(endPoint, ball, linesContainer);
                }
            });

        return ballTimeline;
    }

    // Заменяем исчезновение на разделение шарика с взрывом
    createBallSplitEffect(position, originalBall, container) {
        if (this.isMobile) return;
        const linesContainer = this.banner?.querySelector('.banner__lines');
        if (!linesContainer) return;

        const splitLine = linesContainer.querySelector('path[d="M238.5 202.452L746 131.5"]');
        if (!splitLine) return;

        const lineLength = splitLine.getTotalLength();

        // Находим точки начала и конца линии
        const lineStart = splitLine.getPointAtLength(0); // точка M238.5 202.452
        const lineEnd = splitLine.getPointAtLength(lineLength); // точка L746 131.5

        // Создаем взрыв
        this.createExplosionAtPosition(position, container);

        // Создаем два новых шарика меньшего размера
        const ball1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        const ball2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");

        // Настройки шариков
        [ball1, ball2].forEach(ball => {
            ball.setAttribute('class', 'split-ball');
            ball.setAttribute('r', '10');
            ball.setAttribute('fill', '#F07000');
            ball.setAttribute('opacity', '0');
            ball.setAttribute('cx', position.x);
            ball.setAttribute('cy', position.y);
            container.querySelector('svg').appendChild(ball);
        });

        // Скрываем и УДАЛЯЕМ оригинальный шарик
        gsap.set(originalBall, {
            opacity: 0,
            onComplete: () => {
                // УДАЛЯЕМ оригинальный шарик после скрытия
                if (originalBall.parentNode) {
                    originalBall.parentNode.removeChild(originalBall);
                }
            }
        });

        // Анимация разделения
        const splitTimeline = gsap.timeline();

        splitTimeline
            // Появление шариков одновременно
            .to([ball1, ball2], {
                opacity: 1,
                duration: 0.1,
                ease: "power2.out"
            })
            // Запускаем пульсацию одновременно для обоих
            .to([ball1, ball2], {
                attr: { r: 16 },
                duration: 0.4,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            }, 0)
            // Движение первого шарика к началу линии
            .to(ball1, {
                duration: 0.5,
                ease: "power2.out",
                onUpdate: function() {
                    const progress = this.progress();
                    // Двигаемся от точки разделения к началу линии
                    const point = splitLine.getPointAtLength(lineLength * (0.5 - progress * 0.5));
                    ball1.setAttribute('cx', point.x);
                    ball1.setAttribute('cy', point.y);
                },
                onComplete: () => {
                    ball1.setAttribute('cx', lineStart.x);
                    ball1.setAttribute('cy', lineStart.y);
                    // ВМЕСТО ИСЧЕЗНОВЕНИЯ - запускаем движение по следующей линии
                    this.continueBall1Movement(ball1, lineStart);
                }
            }, 0)
            // Движение второго шарика к концу линии
            .to(ball2, {
                duration: 0.5,
                ease: "power2.out",
                onUpdate: function() {
                    const progress = this.progress();
                    // Двигаемся от точки разделения к концу линии
                    const point = splitLine.getPointAtLength(lineLength * (0.5 + progress * 0.5));
                    ball2.setAttribute('cx', point.x);
                    ball2.setAttribute('cy', point.y);
                },
                onComplete: () => {
                    ball2.setAttribute('cx', lineEnd.x);
                    ball2.setAttribute('cy', lineEnd.y);
                    // ВМЕСТО ИСЧЕЗНОВЕНИЯ - запускаем движение по следующей линии
                    this.continueBall2Movement(ball2, lineEnd);
                }
            }, 0);

        return splitTimeline;
    }

    // Движение первого шарика по линии M238 196V206.5L446 498.5
    continueBall1Movement(ball, startPosition) {
        if (this.isMobile) return;
        const linesContainer = this.banner?.querySelector('.banner__lines');
        if (!linesContainer) return;

        const nextLine = linesContainer.querySelector('path[d="M238 196V206.5L446 498.5"]');
        if (!nextLine) {
            this.fadeOutBall(ball);
            return;
        }

        const lineLength = nextLine.getTotalLength();

        // Находим начальную точку линии (M238 196)
        const lineStart = nextLine.getPointAtLength(0);
        // Находим конечную точку линии (L446 498.5)
        const lineEnd = nextLine.getPointAtLength(lineLength);

        // Устанавливаем шарик в начальную точку новой линии
        ball.setAttribute('cx', lineStart.x);
        ball.setAttribute('cy', lineStart.y);

        // Анимация движения по новой линии
        const movementTimeline = gsap.timeline();

        movementTimeline
            .to(ball, {
                duration: 2.2,
                ease: "power1.inOut",
                onUpdate: function() {
                    const progress = this.progress();
                    const point = nextLine.getPointAtLength(lineLength * progress);
                    ball.setAttribute('cx', point.x);
                    ball.setAttribute('cy', point.y);
                },
                onComplete: () => {
                    ball.setAttribute('cx', lineEnd.x);
                    ball.setAttribute('cy', lineEnd.y);
                    // После завершения движения - продолжаем по следующей линии
                    this.continueBall1ToHorizontalLine(ball, lineEnd);
                }
            });

        return movementTimeline;
    }

    // Движение по линии M445 497.705L919.5 321.205 (7% пути)
    continueBall1ToHorizontalLine(ball, startPosition) {
        if (this.isMobile) return;
        const linesContainer = this.banner?.querySelector('.banner__lines');
        if (!linesContainer) return;

        const nextLine = linesContainer.querySelector('path[d="M445 497.705L919.5 321.205"]');
        if (!nextLine) {
            this.fadeOutBall(ball);
            return;
        }

        const lineLength = nextLine.getTotalLength();

        // Находим точку на 7% длины линии
        const linePoint7Percent = nextLine.getPointAtLength(lineLength * 0.07);

        // Устанавливаем шарик в начальную точку новой линии
        ball.setAttribute('cx', startPosition.x);
        ball.setAttribute('cy', startPosition.y);

        // Анимация движения по новой линии
        const movementTimeline = gsap.timeline();

        movementTimeline
            .to(ball, {
                duration: 0.3, // Короткое время для 7% пути
                ease: "power1.inOut",
                onUpdate: function() {
                    const progress = this.progress();
                    const point = nextLine.getPointAtLength(lineLength * 0.07 * progress);
                    ball.setAttribute('cx', point.x);
                    ball.setAttribute('cy', point.y);
                },
                onComplete: () => {
                    ball.setAttribute('cx', linePoint7Percent.x);
                    ball.setAttribute('cy', linePoint7Percent.y);
                    // После 7% пути - переходим к кривой
                    this.continueBall1ToComplexLine(ball, linePoint7Percent);
                }
            });

        return movementTimeline;
    }

    // Движение первого шарика по сложной кривой с хвостом кометы и взрывом
    continueBall1ToComplexLine(ball, startPosition) {
        if (this.isMobile) return;
        const linesContainer = this.banner?.querySelector('.banner__lines');
        if (!linesContainer) return;

        const complexLine = linesContainer.querySelector('path[d="M449.747 539.089C446.863 541.399 446.436 544.807 446.435 547.976L445.975 732.5C445.983 733 446.107 734.117 447.5 735C456.09 740.445 514.862 773.038 515.5 773.5L518.5 771.5L450.979 733.075C450.354 732.72 449.968 732.056 449.968 731.337V547.978C449.969 544.976 450.425 543.087 451.936 541.863L472.684 525.971L472.736 525.932L472.784 525.889C474.856 524.048 476.315 522.385 477.181 520.119C478.023 517.917 478.235 515.316 478.235 511.76V489.009C478.235 488.033 477.444 487.242 476.468 487.242C475.493 487.242 474.702 488.033 474.702 489.009V511.76C474.702 515.27 474.474 517.306 473.881 518.858C473.316 520.337 472.354 521.537 470.474 523.212L449.778 539.065L449.762 539.077L449.747 539.089Z"]');

        if (!complexLine) {
            this.fadeOutBall(ball);
            return;
        }

        const lineLength = complexLine.getTotalLength();

        // Находим начальную точку кривой
        const lineStart = complexLine.getPointAtLength(0);

        // Находим точку на 40% длины кривой
        const targetPoint = complexLine.getPointAtLength(lineLength * 0.4);

        // Создаем хвост кометы
        const cometTail = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        cometTail.setAttribute('cx', startPosition.x);
        cometTail.setAttribute('cy', startPosition.y);
        cometTail.setAttribute('r', '4');
        cometTail.setAttribute('fill', 'rgba(255,255,255,0.6)');
        cometTail.setAttribute('class', 'comet-tail');
        ball.parentNode.appendChild(cometTail);

        // Анимация движения
        const movementTimeline = gsap.timeline();

        movementTimeline
            // Плавный переход от текущей позиции к началу кривой
            .to(ball, {
                duration: 0.2,
                ease: "power1.out",
                onUpdate: function() {
                    const progress = this.progress();
                    const x = startPosition.x + (lineStart.x - startPosition.x) * progress;
                    const y = startPosition.y + (lineStart.y - startPosition.y) * progress;
                    ball.setAttribute('cx', x);
                    ball.setAttribute('cy', y);
                    cometTail.setAttribute('cx', x);
                    cometTail.setAttribute('cy', y);
                },
                onComplete: () => {
                    ball.setAttribute('cx', lineStart.x);
                    ball.setAttribute('cy', lineStart.y);
                    cometTail.setAttribute('cx', lineStart.x);
                    cometTail.setAttribute('cy', lineStart.y);
                }
            })
            // Движение по кривой до 40% длины с эффектом кометы
            .to(ball, {
                duration: 0.8,
                ease: "power1.inOut",
                onUpdate: function() {
                    const progress = this.progress();
                    // Двигаемся по всей траектории кривой
                    const point = complexLine.getPointAtLength(lineLength * 0.4 * progress);
                    ball.setAttribute('cx', point.x);
                    ball.setAttribute('cy', point.y);
                    cometTail.setAttribute('cx', point.x);
                    cometTail.setAttribute('cy', point.y);

                    // Эффект увеличения и свечения на последнем участке
                    if (progress > 0.7) {
                        const scale = 1 + (progress - 0.7) * 1.5;
                        gsap.set(ball, { scale: scale });

                        const tailSize = 4 + (progress - 0.7) * 8;
                        cometTail.setAttribute('r', tailSize);
                        cometTail.setAttribute('fill', `rgba(255,255,255,${0.8 - (progress - 0.7) * 0.8})`);
                    }
                },
                onComplete: () => {
                    ball.setAttribute('cx', targetPoint.x);
                    ball.setAttribute('cy', targetPoint.y);
                    cometTail.setAttribute('cx', targetPoint.x);
                    cometTail.setAttribute('cy', targetPoint.y);

                    // Создаем взрыв в конечной точке
                    this.createPowerfulExplosion(targetPoint, ball, cometTail);
                }
            });

        return movementTimeline;
    }

    // Движение второго шарика по линии M916 322.204L745 148.134V133 (в противоположном направлении)
    continueBall2Movement(ball, startPosition) {
        if (this.isMobile) return;
        const linesContainer = this.banner?.querySelector('.banner__lines');
        if (!linesContainer) return;

        const nextLine = linesContainer.querySelector('path[d="M916 322.204L745 148.134V133"]');
        if (!nextLine) {
            this.fadeOutBall(ball);
            return;
        }

        const lineLength = nextLine.getTotalLength();

        // Двигаемся в противоположном направлении - от конца к началу
        const lineStart = nextLine.getPointAtLength(lineLength);
        const lineEnd = nextLine.getPointAtLength(0);

        // Устанавливаем шарик в начальную точку новой линии (конец)
        ball.setAttribute('cx', lineStart.x);
        ball.setAttribute('cy', lineStart.y);

        // Анимация движения по новой линии в обратном направлении
        const movementTimeline = gsap.timeline();

        movementTimeline
            .to(ball, {
                duration: 1.8,
                ease: "power1.inOut",
                onUpdate: function() {
                    const progress = this.progress();
                    // Двигаемся от конца к началу: lineLength * (1 - progress)
                    const point = nextLine.getPointAtLength(lineLength * (1 - progress));
                    ball.setAttribute('cx', point.x);
                    ball.setAttribute('cy', point.y);
                },
                onComplete: () => {
                    ball.setAttribute('cx', lineEnd.x);
                    ball.setAttribute('cy', lineEnd.y);
                    // После завершения движения - продолжаем по следующей линии
                    this.continueBall2ToComplexLine(ball, lineEnd);
                }
            });

        return movementTimeline;
    }

    // Движение второго шарика по сложной кривой с хвостом кометы и взрывом
    continueBall2ToComplexLine(ball, startPosition) {
        if (this.isMobile) return;
        const linesContainer = this.banner?.querySelector('.banner__lines');
        if (!linesContainer) return;

        const complexLine = linesContainer.querySelector('path[d="M918.13 318.952L914.887 328.681V337.33C914.887 346.41 914.887 348.68 906.78 352.464C899.753 355.743 893.018 357.881 888.5 360.5C884.971 362.546 874.018 368.5 874.018 379L872.518 510.5C872.518 520 873.5 522 884 526.5L904.5 535"]');

        if (!complexLine) {
            this.fadeOutBall(ball);
            return;
        }

        const lineLength = complexLine.getTotalLength();

        // Находим начальную точку сложной кривой
        const lineStart = complexLine.getPointAtLength(0);
        // Находим конечную точку сложной кривой
        const lineEnd = complexLine.getPointAtLength(lineLength);

        // Создаем хвост кометы
        const cometTail = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        cometTail.setAttribute('cx', startPosition.x);
        cometTail.setAttribute('cy', startPosition.y);
        cometTail.setAttribute('r', '4');
        cometTail.setAttribute('fill', 'rgba(255,255,255,0.6)');
        cometTail.setAttribute('class', 'comet-tail');
        ball.parentNode.appendChild(cometTail);

        // Анимация движения по сложной кривой
        const movementTimeline = gsap.timeline();

        movementTimeline
            // Плавный переход от конечной точки предыдущей линии к началу новой кривой
            .to(ball, {
                duration: 0.3,
                ease: "power1.out",
                onUpdate: function() {
                    const progress = this.progress();
                    // Плавно перемещаем от предыдущей конечной точки к началу новой кривой
                    const x = startPosition.x + (lineStart.x - startPosition.x) * progress;
                    const y = startPosition.y + (lineStart.y - startPosition.y) * progress;
                    ball.setAttribute('cx', x);
                    ball.setAttribute('cy', y);
                    cometTail.setAttribute('cx', x);
                    cometTail.setAttribute('cy', y);
                },
                onComplete: () => {
                    // Устанавливаем точно в начальную точку кривой
                    ball.setAttribute('cx', lineStart.x);
                    ball.setAttribute('cy', lineStart.y);
                    cometTail.setAttribute('cx', lineStart.x);
                    cometTail.setAttribute('cy', lineStart.y);
                }
            })
            // Движение по самой сложной кривой с эффектом кометы
            .to(ball, {
                duration: 1,
                ease: "power1.inOut",
                onUpdate: function() {
                    const progress = this.progress();
                    const point = complexLine.getPointAtLength(lineLength * progress);
                    ball.setAttribute('cx', point.x);
                    ball.setAttribute('cy', point.y);
                    cometTail.setAttribute('cx', point.x);
                    cometTail.setAttribute('cy', point.y);

                    // Эффект увеличения и свечения на последнем участке
                    if (progress > 0.7) {
                        const scale = 1 + (progress - 0.7) * 1.5;
                        gsap.set(ball, { scale: scale });

                        const tailSize = 4 + (progress - 0.7) * 8;
                        cometTail.setAttribute('r', tailSize);
                        cometTail.setAttribute('fill', `rgba(255,255,255,${0.8 - (progress - 0.7) * 0.8})`);
                    }
                },
                onComplete: () => {
                    ball.setAttribute('cx', lineEnd.x);
                    ball.setAttribute('cy', lineEnd.y);
                    cometTail.setAttribute('cx', lineEnd.x);
                    cometTail.setAttribute('cy', lineEnd.y);

                    // Создаем взрыв в конечной точке
                    this.createPowerfulExplosion(lineEnd, ball, cometTail);
                }
            });

        return movementTimeline;
    }

    // Метод для создания мощного взрыва
    createPowerfulExplosion(position, ball, cometTail) {
        if (this.isMobile) return;
        // НЕМЕДЛЕННО останавливаем ВСЕ анимации
        gsap.killTweensOf(ball);
        if (cometTail) gsap.killTweensOf(cometTail);

        // НЕМЕДЛЕННО скрываем шарик и хвост
        ball.style.opacity = '0';
        ball.style.visibility = 'hidden';
        ball.style.display = 'none';

        if (cometTail) {
            cometTail.style.opacity = '0';
            cometTail.style.visibility = 'hidden';
            cometTail.style.display = 'none';
        }

        // Создаем основную вспышку взрыва
        const mainFlash = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        mainFlash.setAttribute('cx', position.x);
        mainFlash.setAttribute('cy', position.y);
        mainFlash.setAttribute('r', '5');
        mainFlash.setAttribute('fill', '#ffffff');
        mainFlash.setAttribute('class', 'explosion-flash');
        ball.parentNode.appendChild(mainFlash);

        // Создаем частицы взрыва
        for (let i = 0; i < 5; i++) {
            this.createExplosionParticle(position, ball.parentNode, i);
        }

        // Анимация вспышки
        gsap.to(mainFlash, {
            attr: { r: 40 },
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => {
                if (mainFlash.parentNode) {
                    mainFlash.parentNode.removeChild(mainFlash);
                }

                // Отложенное удаление на всякий случай
                setTimeout(() => {
                    if (ball.parentNode) ball.parentNode.removeChild(ball);
                    if (cometTail && cometTail.parentNode) cometTail.parentNode.removeChild(cometTail);
                }, 100);
            }
        });
    }

    // Метод для создания частиц взрыва
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

    // Метод для создания взрыва с частицами
    createExplosionAtPosition(position, container) {
        if (this.isMobile) return;
        // Создаем основную вспышку
        const mainFlash = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        mainFlash.setAttribute('cx', position.x);
        mainFlash.setAttribute('cy', position.y);
        mainFlash.setAttribute('r', '8');
        mainFlash.setAttribute('fill', '#FFFFFF'); // Изменено на белый цвет
        mainFlash.setAttribute('opacity', '0.8');
        container.querySelector('svg').appendChild(mainFlash);

        // Создаем частицы взрыва
        for (let i = 0; i < 6; i++) {
            this.createExplosionParticle(position, container, i);
        }

        // Анимация вспышки
        gsap.to(mainFlash, {
            attr: { r: 25 },
            opacity: 0,
            duration: 0.4,
            ease: "power2.out",
            onComplete: () => {
                if (mainFlash.parentNode) {
                    mainFlash.parentNode.removeChild(mainFlash);
                }
            }
        });
    }

    // Вспомогательный метод для плавного исчезновения шариков С ПУЛЬСАЦИЕЙ
    fadeOutBall(ball) {
        // Создаем timeline для исчезновения с продолжением пульсации
        const fadeTimeline = gsap.timeline();

        fadeTimeline
            // Продолжаем пульсацию во время исчезновения
            .to(ball, {
                attr: { r: 16 },
                duration: 0.4,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            })
            // Плавное исчезновение
            .to(ball, {
                opacity: 0,
                duration: 0.3,
                ease: "power2.out",
                onComplete: () => {
                    if (ball.parentNode) {
                        ball.parentNode.removeChild(ball);
                    }
                }
            }, 0);
    }

    // Анимация всех остальных элементов
    animateOtherElements() {
        if (this.isMobile) return;
        const linesContainer = this.banner?.querySelector('.banner__lines');
        if (!linesContainer) return;

        // Получаем все элементы кроме тех, что внутри g с clip-path или filter
        const allElements = linesContainer.querySelectorAll('path, ellipse, rect');

        // Фильтруем элементы: исключаем основные линии и элементы с clip-path/filter
        this.otherElements = Array.from(allElements).filter(element => {
            // Пропускаем основные линии
            if (element.tagName === 'path') {
                const dAttribute = element.getAttribute('d');
                const mainLines = [
                    'M238.5 202.452L746 131.5',
                    'M711.5 394.452L505.5 172.452V162.952',
                    'M382.438 174.529C382.438 181.601 382.438 185.565 382.438 192.637L591.075 440.461',
                    'M819.5 355.452L622.5 157.452V139.952',
                    'M445 497.705L919.5 321.205',
                    'M449.747 539.089C446.863 541.399 446.436 544.807 446.435 547.976L445.975 732.5C445.983 733 446.107 734.117 447.5 735C456.09 740.445 514.862 773.038 515.5 773.5L518.5 771.5L450.979 733.075C450.354 732.72 449.968 732.056 449.968 731.337V547.978C449.969 544.976 450.425 543.087 451.936 541.863L472.684 525.971L472.736 525.932L472.784 525.889C474.856 524.048 476.315 522.385 477.181 520.119C478.023 517.917 478.235 515.316 478.235 511.76V489.009C478.235 488.033 477.444 487.242 476.468 487.242C475.493 487.242 474.702 488.033 474.702 489.009V511.76C474.702 515.27 474.474 517.306 473.881 518.858C473.316 520.337 472.354 521.537 470.474 523.212L449.778 539.065L449.762 539.077L449.747 539.089Z',
                    'M238.5 206.5L92.9171 370.295C90.6243 372.874 92.4573 376.966 95.9083 377.01C103.746 377.11 109.175 377.285 121.354 377.077C125.239 377.011 128.971 378.657 131.509 381.6L143.5 395.5',
                    'M874.5 460.155L966.729 489.167L972 491L975 489L874.5 456.5V460.155Z',
                    'M437 820.314C437.887 820.955 439.077 820.986 439.995 820.391L975.001 492.314V489L966.955 494L438.582 817.096L437 818V820.314Z',
                    'M438.5 818.5L4 562.452',
                    'M4 562.452C53.8156 550.842 97.6844 541.11 147.5 529.5',
                    'M214 527V593.5L102 620',
                    'M918.13 318.952L914.887 328.681V337.33C914.887 346.41 914.887 348.68 906.78 352.464C899.753 355.743 893.018 357.881 888.5 360.5C884.971 362.546 874.018 368.5 874.018 379L872.518 510.5C872.518 520 873.5 522 884 526.5L904.5 535',
                    'M916 322.204L745 148.134V133',
                    'M238 196V206.5L446 498.5'
                ];
                if (mainLines.includes(dAttribute)) {
                    return false;
                }
            }

            // Пропускаем элементы с clip-path
            const parentGWithClipPath = element.closest('g[clip-path]');
            if (parentGWithClipPath) {
                return false;
            }

            // Пропускаем элементы с filter (молния)
            const parentGWithFilter = element.closest('g[filter]');
            if (parentGWithFilter) {
                return false;
            }

            // Включаем только элементы, которые скрыты через opacity
            return element.style.opacity === '0';
        });

        if (!this.otherElements.length) {
            return;
        }

        // Плавное появление остальных элементов
        gsap.to(this.otherElements, {
            opacity: 1,
            duration: 0.9,
            delay: 0,
            stagger: {
                amount: 0.9,
                from: "random"
            },
            ease: "power2.out"
        });
    }

    // Анимация контента слайда
    animateSlideContent() {
        const activeSlide = document.querySelector('.swiper-slide-active');
        if (!activeSlide || !activeSlide.classList.contains('main-animation')) return;

        const content = activeSlide.querySelector('.main-slider__content');
        if (!content) return;

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

    startAnimation() {
        this.animateSlideContent();
        this.animateSVGLines();
    }

    initWithPreloader() {
        const progressCircle = this.preloader ? this.preloader.querySelector('.preloader__circle-progress') : null;

        if (progressCircle) {
            gsap.to(progressCircle, {
                strokeDashoffset: 0,
                duration: 0.8,
                ease: 'power2.inOut',
                onComplete: () => {
                    this.hidePreloader();
                }
            });
        } else {
            this.hidePreloader();
        }

        this.prepareAnimation();
    }

    hidePreloader() {
        if (this.preloader) {
            gsap.to(this.preloader, {
                opacity: 0,
                duration: 0.2,
                ease: 'power2.out',
                onComplete: () => {
                    this.preloader.classList.add('preloader--hidden');

                    if (this.preloader) {
                        this.preloader.style.display = 'none';
                    }

                    this.init();
                }
            });
        } else {
            this.init();
        }
    }

    prepareAnimation() {
        this.animationReady = true;
    }

    init() {
        if (!this.animationReady) {
            return;
        }

        this.startAnimation();
    }

    destroy() {
        // Удаляем все созданные шарики
        const allBalls = document.querySelectorAll('.pulsing-ball, .split-ball, .comet-tail, .explosion-flash, .explosion-particle');
        allBalls.forEach(ball => {
            if (ball.parentNode) {
                ball.parentNode.removeChild(ball);
            }
        });

        // Останавливаем все анимации GSAP
        gsap.globalTimeline.clear();

        // Оставляем линии в их конечном состоянии (видимыми)
    }
}
/*import { gsap } from 'gsap';

export class BannerAnimation {
    constructor() {
        // Проверяем, главная ли это страница
        this.isMainPage = document.querySelector('.main-slider') !== null;

        // Если не главная страница - не создаем прелоадер и не запускаем анимацию
        if (!this.isMainPage) {
            // Скрываем прелоадер если это не главная страница
            this.hidePreloaderImmediately();
            return;
        }

        // Проверяем мобильное устройство ДО показа прелоадера
        if (window.innerWidth <= 900) {
            // На мобильных сразу скрываем прелоадер и выходим
            this.hidePreloaderImmediately();
            // Дальнейшая инициализация для мобильных
            this.initForMobile();
            return;
        }

        // Только для десктопных главных страниц показываем прелоадер
        this.showPreloader();

        this.banner = document.querySelector('.banner');
        this.preloader = document.getElementById('preloader');

        // Десктопная логика
        this.bannerLines = this.banner ? this.banner.querySelector('.banner__lines') : null;
        this.lines = this.banner ? this.banner.querySelectorAll('.banner__lines .line') : [];
        this.ball = this.banner ? this.banner.querySelector('.pulsing-ball') : null;

        this.bannerImage = this.banner ? this.banner.querySelector('.banner__image') : null;

        if (this.banner) {
            this.specialElements = this.findSpecialElements();
            this.rectElements = this.findRectElements();
            this.pathElements = this.findPathElements();

            // На десктопе ищем все линии
            this.specificLine = this.findSpecificLine();
            this.secondLine = this.findSecondLine();
            this.thirdLine = this.findThirdLine();
            this.fourthLine = this.findFourthLine();
            this.fifthLine = this.findFifthLine();
            this.sixthLine = this.findSixthLine();
            this.seventhLine = this.findSeventhLine();
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
            this.seventhLine = null;
        }

        this.animationEnabled = true;
        this.mobileAnimationPlayed = false;
        this.pageLoaded = false;
        this.animationReady = false;
        this.lastWindowWidth = window.innerWidth;

        this.initResizeHandler();
        this.initImageChangeHandler();

        setTimeout(() => {
            this.initWithPreloader();
        }, 100);
    }

    findSeventhLine() {
        if (!this.banner) return null;
        const allLines = this.banner.querySelectorAll('.banner__lines .line');
        const targetPath = "M955.129 319L951.886 328.729V337.377C951.886 346.458 951.886 348.728 943.779 352.512C936.752 355.791 931 358 926.482 360.619C922.953 362.666 917.5 367.5 917.5 378L916 509.5C916 519 918.5 521 926.483 526.5L946.5 537";
        return Array.from(allLines).find(line => {
            const d = line.getAttribute('d');
            return d && d.replace(/\s+/g, ' ').trim() === targetPath.replace(/\s+/g, ' ').trim();
        });
    }

    initForMobile() {
        this.banner = document.querySelector('.banner');

        // На мобильных удаляем banner__lines
        const bannerLines = this.banner ? this.banner.querySelector('.banner__lines') : null;
        if (bannerLines) {
            bannerLines.remove();
        }

        this.bannerLines = null;
        this.lines = [];
        this.ball = null;
        this.bannerImage = this.banner ? this.banner.querySelector('.banner__image') : null;

        this.specialElements = [];
        this.rectElements = [];
        this.pathElements = [];
        this.specificLine = null;
        this.secondLine = null;
        this.thirdLine = null;
        this.fourthLine = null;
        this.fifthLine = null;
        this.sixthLine = null;
        this.seventhLine = null;

        this.animationEnabled = false;
        this.mobileAnimationPlayed = false;

        this.initResizeHandler();
        this.initImageChangeHandler();

        // Запускаем мобильную анимацию
        setTimeout(() => {
            this.animateMobileContent();
        }, 500);
    }

    showPreloader() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.display = 'flex';
            preloader.style.opacity = '1';
            preloader.style.visibility = 'visible';
        }
    }

    hidePreloaderImmediately() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.display = 'none';
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        }
    }

    initMobileAnimations() {
        // Полностью сбрасываем все предыдущие анимации
        gsap.killTweensOf('.main-slider__content, .main-slider__title, .main-slider__info, .main-slider__link, .bestsellers__title');

        const activeSlide = document.querySelector('.swiper-slide-active');
        if (activeSlide && activeSlide.classList.contains('main-animation')) {
            const content = activeSlide.querySelector('.main-slider__content');
            if (content) {
                // Полностью сбрасываем стили
                gsap.set(content, {
                    opacity: 0,
                    y: 30,
                    clearProps: "all"
                });
            }
        }

        const bestsellersTitle = document.querySelector('.bestsellers__title');
        if (bestsellersTitle) {
            gsap.set(bestsellersTitle, {
                opacity: 0,
                y: 40,
                clearProps: "all"
            });
        }
    }

    animateMobileContent() {
        if (window.innerWidth > 900) return;
        if (this.mobileAnimationPlayed) return;

        this.mobileAnimationPlayed = true;

        const activeSlide = document.querySelector('.swiper-slide-active');
        if (activeSlide && activeSlide.classList.contains('main-animation')) {
            const content = activeSlide.querySelector('.main-slider__content');
            if (content) {
                content.classList.add('main-slider__content--animated');

                gsap.fromTo(content,
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
                );
            }
        }
    }

    // Анимация контента слайда
    animateSlideContent() {
        const activeSlide = document.querySelector('.swiper-slide-active');
        if (!activeSlide || !activeSlide.classList.contains('main-animation')) return;

        const content = activeSlide.querySelector('.main-slider__content');
        if (!content) return;

        // НА МОБИЛЬНЫХ НЕ ЗАПУСКАЕМ АНИМАЦИЮ - она уже запускается в animateMobileContent
        if (window.innerWidth <= 900) {
            return;
        }

        // Десктопная логика
        gsap.set(content, {
            y: 80,
            opacity: 0
        });

        content.classList.add('main-slider__content--animated');

        // Анимация основного контента
        gsap.to(content, {
            y: 0,
            opacity: 1,
            duration: 1.0,
            ease: "power2.out"
        });

        // Анимация внутренних элементов контента
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
        if (!this.banner) return;

        const windowWidth = window.innerWidth;

        if (windowWidth <= 900) {
            this.disableAnimation();

            // Если перешли на мобильное разрешение и banner__lines еще есть - удаляем
            if (this.bannerLines && this.bannerLines.parentNode) {
                this.bannerLines.remove();
                this.bannerLines = null;
            }

            if (!this.mobileAnimationPlayed) {
                setTimeout(() => {
                    this.animateMobileContent();
                }, 100);
            }
            return;
        } else {
            this.enableAnimation();
            this.mobileAnimationPlayed = false;

            // Если перешли на десктоп, но banner__lines был удален - выходим
            if (!this.bannerLines) {
                return;
            }
        }

        // Десктопная логика
        if (!this.bannerLines) return;

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

            // Логика для меньших разрешений
            if (windowWidth <= 950) {
                const scaleX = bannerWidth / originalSvgWidth;
                const scaleY = bannerHeight / originalSvgHeight;
                scale = Math.min(scaleX, scaleY) * 0.94;
                rightOffset = -41;
            }
            else if (windowWidth <= 1100) {
                const scaleX = bannerWidth / originalSvgWidth;
                const scaleY = bannerHeight / originalSvgHeight;
                scale = Math.min(scaleX, scaleY) * 0.94;
                rightOffset = -47;
            }
            else if (windowWidth <= 1200) {
                const scaleX = bannerWidth / originalSvgWidth;
                const scaleY = bannerHeight / originalSvgHeight;
                scale = Math.min(scaleX, scaleY) * 0.95;
                rightOffset = -59;
            }
            else if (windowWidth <= 1300) {
                const scaleX = bannerWidth / originalSvgWidth;
                const scaleY = bannerHeight / originalSvgHeight;
                scale = Math.min(scaleX, scaleY) * 0.95;
                rightOffset = -65;
            } else if (windowWidth <= 1366) {
                const scaleX = bannerWidth / originalSvgWidth;
                const scaleY = bannerHeight / originalSvgHeight;
                scale = Math.min(scaleX, scaleY) * 0.95;
                rightOffset = -67;
            } else if (windowWidth <= 1700) {
                // Для разрешений с 1367 до 1920 - масштаб 0.99
                const scaleX = bannerWidth / originalSvgWidth;
                const scaleY = bannerHeight / originalSvgHeight;
                scale = Math.min(scaleX, scaleY) * 0.99;
                rightOffset = 12;
            } else if (windowWidth <= 1920) {
                // Для разрешений с 1367 до 1920 - масштаб 0.99
                const scaleX = bannerWidth / originalSvgWidth;
                const scaleY = bannerHeight / originalSvgHeight;
                scale = Math.min(scaleX, scaleY) * 0.99;
                rightOffset = 14;
            } else {
                // Для разрешений больше 1920 - масштаб 1
                const scaleX = bannerWidth / originalSvgWidth;
                const scaleY = bannerHeight / originalSvgHeight;
                scale = Math.min(scaleX, scaleY) * 1.0;
                rightOffset = 20;
            }

            const scaledSvgWidth = originalSvgWidth * scale;
            const scaledSvgHeight = originalSvgHeight * scale;

            const topOffset = (windowWidth <= 1366) ? 0.01 : (bannerHeight - scaledSvgHeight) / 2;

            if (this.bannerLines && this.bannerLines.style) {
                this.bannerLines.style.cssText = `
                position: absolute;
                top: ${topOffset}px;
                right: ${rightOffset}px;
                width: ${scaledSvgWidth}px;
                height: ${scaledSvgHeight}px;
                pointer-events: none;
                z-index: 2;
            `;
            }

            const svg = this.bannerLines ? this.bannerLines.querySelector('svg') : null;
            if (svg && svg.style) {
                svg.style.cssText = `
                width: 100%;
                height: 100%;
                display: block;
            `;
            }
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

        // ПОКАЗЫВАЕМ ЛИНИИ ПЕРЕД НАЧАЛОМ АНИМАЦИИ
        if (this.bannerLines) {
            this.bannerLines.style.opacity = '1';
            this.bannerLines.style.visibility = 'visible';
        }

        // Даем небольшой timeout чтобы браузер успел отрендерить элемент
        setTimeout(() => {

            const lineAnimation = gsap.to(this.lines, {
                strokeDashoffset: 0,
                duration: 1.8,
                stagger: {
                    each: 0.25,
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
                delay: 2.5,
                onComplete: () => {
                    if (this.ball && this.specificLine && this.secondLine && this.thirdLine &&
                        this.fourthLine && this.fifthLine && this.sixthLine && this.seventhLine) {
                        this.animateBall();
                    }
                }
            });

            this.animateSlideContent();
        }, 50);
    }

    disableAnimation() {
        if (!this.animationEnabled) return;

        this.animationEnabled = false;

        if (this.bannerLines) {
            this.bannerLines.style.display = 'none';
        }

        gsap.globalTimeline.clear();
    }

    enableAnimation() {
        if (this.animationEnabled) return;

        this.animationEnabled = true;
        this.mobileAnimationPlayed = false;

        if (this.bannerLines) {
            this.bannerLines.style.display = 'block';
        }
    }

    initWithPreloader() {
        // На мобильных устройствах не используем прелоадер
        if (window.innerWidth <= 900) {
            return;
        }

        this.handleResize();

        const progressCircle = this.preloader ? this.preloader.querySelector('.preloader__circle-progress') : null;

        if (progressCircle) {

            gsap.to(progressCircle, {
                strokeDashoffset: 0,
                duration: 0.8,
                ease: 'power2.inOut',
                onComplete: () => {

                    setTimeout(() => {
                        this.hidePreloader();
                    }, 100);
                }
            });
        } else {

            setTimeout(() => {
                this.hidePreloader();
            }, 600);
        }

        // Параллельно готовим анимацию
        this.prepareAnimation();
    }

    hidePreloader() {
        if (window.innerWidth <= 900) {
            return;
        }


        if (this.preloader) {
            gsap.to(this.preloader, {
                opacity: 0,
                duration: 0.2,
                ease: 'power2.out',
                onComplete: () => {
                    this.preloader.classList.add('preloader--hidden');

                    // Полностью скрываем прелоадер после анимации
                    setTimeout(() => {
                        if (this.preloader) {
                            this.preloader.style.display = 'none';
                        }
                    }, 200);

                    if (this.bannerLines) {
                        this.bannerLines.classList.add('banner__lines--visible');
                    }

                    // Запускаем анимацию сразу после скрытия прелоадера
                    this.init();
                }
            });
        } else {
            // Если прелоадера нет, сразу запускаем анимацию
            this.init();
        }
    }

    prepareAnimation() {
        // Параллельно с прелоадером готовим анимацию
        if (this.banner && this.lines.length > 0) {
            this.setupAnimation();
            this.animationReady = true;
        }
    }

    init() {
        if (window.innerWidth <= 900) {
            return;
        }

        // Если анимация еще не готова, готовим ее
        if (!this.animationReady) {
            this.setupAnimation();
        }

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

        this.animationReady = true;
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
                    duration: 1.2,
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

        // Первый шарик идет к началу второй линии и затем по третьей линии
        this.moveBallToThirdLine(ball1, secondLineStart);

        // Второй шарик идет к концу второй линии и затем по четвертой линии
        this.moveBallToFourthLine(ball2, secondLineEnd);
    }

    moveBallToThirdLine(ball, targetPoint) {
        gsap.to(ball, {
            attr: {
                cx: targetPoint.x,
                cy: targetPoint.y
            },
            duration: 0.9,
            ease: "power1.out",
            onComplete: () => {
                this.moveToThirdLine(ball, targetPoint);
            }
        });
    }

    moveBallToFourthLine(ball, targetPoint) {
        const fourthLine = this.fourthLine;
        const fourthLineLength = fourthLine.getTotalLength();

        const fourthLineStart = fourthLine.getPointAtLength(0);
        const fourthLineEnd = fourthLine.getPointAtLength(fourthLineLength);

        // Второй шарик идет к началу четвертой линии
        gsap.to(ball, {
            attr: {
                cx: fourthLineStart.x,
                cy: fourthLineStart.y
            },
            duration: 0.5,
            ease: "power1.out",
            onComplete: () => {
                // Затем проходит по четвертой линии до конца
                gsap.to(ball, {
                    attr: {
                        cx: fourthLineEnd.x,
                        cy: fourthLineEnd.y
                    },
                    duration: 1.5,
                    ease: "power1.out",
                    onComplete: () => {
                        // После четвертой линии переходит на седьмую линию
                        this.moveToSeventhLine(ball, fourthLineEnd);
                    }
                });
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
            duration: 0.4,
            ease: "power1.out",
            onComplete: () => {
                gsap.to(ball, {
                    attr: {
                        cx: thirdLineEnd.x,
                        cy: thirdLineEnd.y
                    },
                    duration: 1.2,
                    ease: "power1.out",
                    onComplete: () => {
                        this.moveToFifthLineFromThird(ball, thirdLineEnd);
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


    // Метод для движения первого шарика по шестой линии
    moveToSixthLine(ball, currentPosition) {
        const sixthLine = this.sixthLine;
        const sixthLineLength = sixthLine.getTotalLength();
        const sixthLineEnd = sixthLine.getPointAtLength(sixthLineLength);

        // ОЧИЩАЕМ ВСЕ СУЩЕСТВУЮЩИЕ АНИМАЦИИ ДЛЯ ЭТОГО ШАРИКА
        gsap.killTweensOf(ball);

        // Создаем хвост кометы
        const cometTail = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        cometTail.setAttribute('cx', currentPosition.x);
        cometTail.setAttribute('cy', currentPosition.y);
        cometTail.setAttribute('r', '4');
        cometTail.setAttribute('fill', 'rgba(255,255,255,0.6)');
        cometTail.setAttribute('class', 'comet-tail');
        ball.parentNode.appendChild(cometTail);

        // Анимация движения по кривой
        const animation = gsap.to({progress: 0}, {
            progress: 1,
            duration: 1.2,
            ease: "power2.out",
            onUpdate: function() {
                // Получаем точку на кривой на основе прогресса
                const point = sixthLine.getPointAtLength(this.progress() * sixthLineLength);

                // Обновляем позицию шарика
                ball.setAttribute('cx', point.x);
                ball.setAttribute('cy', point.y);

                // Обновляем позицию хвоста
                cometTail.setAttribute('cx', point.x);
                cometTail.setAttribute('cy', point.y);

                // Эффект увеличения и свечения на последнем участке
                const progress = this.progress();
                if (progress > 0.7) {
                    const scale = 1 + (progress - 0.7) * 1.5;
                    gsap.set(ball, { scale: scale });

                    const tailSize = 4 + (progress - 0.7) * 8;
                    cometTail.setAttribute('r', tailSize);
                    cometTail.setAttribute('fill', `rgba(255,255,255,${0.8 - (progress - 0.7) * 0.8})`);
                }
            },
            onComplete: () => {
                // Гарантируем точное позиционирование в конце
                ball.setAttribute('cx', sixthLineEnd.x);
                ball.setAttribute('cy', sixthLineEnd.y);
                cometTail.setAttribute('cx', sixthLineEnd.x);
                cometTail.setAttribute('cy', sixthLineEnd.y);

                // Создаем взрыв в конечной точке
                this.createPowerfulExplosion(sixthLineEnd, ball, cometTail);
            }
        });
    }

    // Метод для движения второго шарика по седьмой линии
    moveToSeventhLine(ball, currentPosition) {
        const seventhLine = this.seventhLine;
        const seventhLineLength = seventhLine.getTotalLength();
        const seventhLineEnd = seventhLine.getPointAtLength(seventhLineLength);

        // ОЧИЩАЕМ ВСЕ СУЩЕСТВУЮЩИЕ АНИМАЦИИ ДЛЯ ЭТОГО ШАРИКА
        gsap.killTweensOf(ball);

        // Создаем хвост кометы
        const cometTail = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        cometTail.setAttribute('cx', currentPosition.x);
        cometTail.setAttribute('cy', currentPosition.y);
        cometTail.setAttribute('r', '4');
        cometTail.setAttribute('fill', 'rgba(255,255,255,0.6)');
        cometTail.setAttribute('class', 'comet-tail');
        ball.parentNode.appendChild(cometTail);

        // Анимация движения по кривой
        const animation = gsap.to({progress: 0}, {
            progress: 1,
            duration: 1.2,
            ease: "power2.out",
            onUpdate: function() {
                // Получаем точку на кривой на основе прогресса
                const point = seventhLine.getPointAtLength(this.progress() * seventhLineLength);

                // Обновляем позицию шарика
                ball.setAttribute('cx', point.x);
                ball.setAttribute('cy', point.y);

                // Обновляем позицию хвоста
                cometTail.setAttribute('cx', point.x);
                cometTail.setAttribute('cy', point.y);
            },
            onComplete: () => {
                // Гарантируем точное позиционирование в конце
                ball.setAttribute('cx', seventhLineEnd.x);
                ball.setAttribute('cy', seventhLineEnd.y);
                cometTail.setAttribute('cx', seventhLineEnd.x);
                cometTail.setAttribute('cy', seventhLineEnd.y);

                // ВТОРОЙ ШАРИК: Создаем взрыв в конечной точке седьмой линии
                this.createPowerfulExplosion(seventhLineEnd, ball, cometTail);
            }
        });
    }
    createPowerfulExplosion(position, ball, cometTail) {
        console.log('Создание взрыва в точке:', position.x, position.y);

        // НЕМЕДЛЕННО останавливаем ВСЕ анимации
        gsap.killTweensOf(ball);
        gsap.killTweensOf(cometTail);

        // НЕМЕДЛЕННО скрываем шарик и хвост
        ball.style.opacity = '0';
        ball.style.visibility = 'hidden';
        ball.style.display = 'none';

        if (cometTail) {
            cometTail.style.opacity = '0';
            cometTail.style.visibility = 'hidden';
            cometTail.style.display = 'none';
        }

        // Создаем основную вспышку взрыва
        const mainFlash = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        mainFlash.setAttribute('cx', position.x);
        mainFlash.setAttribute('cy', position.y);
        mainFlash.setAttribute('r', '5');
        mainFlash.setAttribute('fill', '#ffffff');
        mainFlash.setAttribute('class', 'explosion-flash');
        ball.parentNode.appendChild(mainFlash);

        // Создаем частицы взрыва
        for (let i = 0; i < 5; i++) {
            this.createExplosionParticle(position, ball.parentNode, i);
        }

        // Анимация вспышки
        gsap.to(mainFlash, {
            attr: { r: 40 },
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => {
                if (mainFlash.parentNode) {
                    mainFlash.parentNode.removeChild(mainFlash);
                }

                // Отложенное удаление на всякий случай
                setTimeout(() => {
                    if (ball.parentNode) ball.parentNode.removeChild(ball);
                    if (cometTail && cometTail.parentNode) cometTail.parentNode.removeChild(cometTail);
                }, 100);
            }
        });
    }
    // Метод для создания частиц взрыва
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
}*/