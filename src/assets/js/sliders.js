import Swiper from 'swiper';
let productSlider = null;

function initProductFancybox(sliderInstance) {
    const galleryItems = document.querySelectorAll('[data-fancybox="product-gallery"]');

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();

            const images = Array.from(galleryItems).map(img => img.getAttribute('href'));
            createCustomLightbox(images, index, sliderInstance);
        });
    });
}

function createCustomLightbox(images, startIndex, sliderInstance) {
    const oldLightbox = document.getElementById('custom-lightbox');
    if (oldLightbox) oldLightbox.remove();


    const closeIcon = `
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.56641 5.56641L33.4365 32.4365" stroke="white" stroke-width="3" stroke-linecap="round"/>
            <path d="M32.7266 4.85938L5.8565 31.7294" stroke="white" stroke-width="3" stroke-linecap="round"/>
        </svg>
    `;


    const prevArrow = `
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23 9L13 19L23 29" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;


    const nextArrow = `
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 9L25 19L15 29" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;

    const lightboxHTML = `
        <div id="custom-lightbox" class="custom-lightbox">
            <div class="lightbox-backdrop"></div>
            <div class="lightbox-container">
                <button class="lightbox-close" aria-label="Закрыть">
                    ${closeIcon}
                </button>
                <div class="lightbox-content">
                    <img src="${images[startIndex]}" alt="" class="lightbox-image">
                </div>
                ${images.length > 1 ? `
                    <button class="lightbox-nav lightbox-prev" aria-label="Предыдущее изображение">
                        ${prevArrow}
                    </button>
                    <button class="lightbox-nav lightbox-next" aria-label="Следующее изображение">
                        ${nextArrow}
                    </button>
                    <div class="lightbox-counter">${startIndex + 1} / ${images.length}</div>
                ` : ''}
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', lightboxHTML);

    const lightbox = document.getElementById('custom-lightbox');
    const backdrop = lightbox.querySelector('.lightbox-backdrop');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const image = lightbox.querySelector('.lightbox-image');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    const counter = lightbox.querySelector('.lightbox-counter');

    let currentIndex = startIndex;
    document.body.style.overflow = 'hidden';

    function updateImage() {
        image.src = images[currentIndex];
        if (counter) {
            counter.textContent = `${currentIndex + 1} / ${images.length}`;
        }

        if (sliderInstance && !sliderInstance.destroyed) {
            sliderInstance.slideTo(currentIndex);
        }
    }

    function closeLightbox() {
        document.body.style.overflow = '';
        lightbox.remove();
    }

    backdrop.addEventListener('click', closeLightbox);
    closeBtn.addEventListener('click', closeLightbox);

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateImage();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            updateImage();
        });
    }

    document.addEventListener('keydown', function(e) {
        if (document.getElementById('custom-lightbox')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
            if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
        }
    });

    if (!document.querySelector('#custom-lightbox-styles')) {
        const style = document.createElement('style');
        style.id = 'custom-lightbox-styles';
        style.textContent = `
            .custom-lightbox {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 99999;
            }
            
            .lightbox-backdrop {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
                animation: fadeIn 0.3s ease;
            }
            
            .lightbox-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 40px;
                box-sizing: border-box;
                z-index: 100000;
            }
            
            .lightbox-close {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(255, 255, 255, 0.1);
                border: none;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                cursor: pointer;
                z-index: 100001;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                padding: 0;
            }
            
            .lightbox-close:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: scale(1.1);
            }
            
            .lightbox-close:active {
                transform: scale(0.95);
            }
            
            .lightbox-close svg {
                width: 20px;
                height: 20px;
            }
            
            .lightbox-content {
                max-width: 90vw;
                max-height: 90vh;
                animation: zoomIn 0.3s ease;
                position: relative;
                z-index: 10000;
            }
            
            .lightbox-image {
                max-width: 100%;
                max-height: 80vh;
                object-fit: contain;
                border-radius: 8px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
            }
            
            .lightbox-nav {
                position: fixed;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(255, 255, 255, 0.1);
                border: none;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                cursor: pointer;
                z-index: 100001;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                padding: 0;
            }
            
            .lightbox-nav:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: translateY(-50%) scale(1.1);
            }
            
            .lightbox-nav:active {
                transform: translateY(-50%) scale(0.95);
            }
            
            .lightbox-nav svg {
                width: 24px;
                height: 24px;
            }
            
            .lightbox-prev { 
                left: 20px; 
            }
            
            .lightbox-prev svg {
                margin-left: -2px;
            }
            
            .lightbox-next { 
                right: 20px; 
            }
            
            .lightbox-next svg {
                margin-right: -2px;
            }
            
            .lightbox-counter {
                position: fixed;
                bottom: 20px;
                left: 0;
                width: 100%;
                text-align: center;
                color: white;
                font-size: 16px;
                font-weight: 500;
                z-index: 100001;
                background: rgba(0, 0, 0, 0.5);
                padding: 8px 16px;
                border-radius: 20px;
                display: inline-block;
                width: auto;
                left: 50%;
                transform: translateX(-50%);
                backdrop-filter: blur(10px);
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes zoomIn {
                from { 
                    opacity: 0;
                    transform: scale(0.9);
                }
                to { 
                    opacity: 1;
                    transform: scale(1);
                }
            }
            
            /* Для мобильных устройств */
            @media (max-width: 768px) {
                .lightbox-container {
                    padding: 50px;
                }
                
                .lightbox-close {
                    top: 10px;
                    right: 10px;
                    width: 40px;
                    height: 40px;
                }
                
                .lightbox-close svg {
                  width: 15px;
                  height: 15px;
                }
                
                .lightbox-nav {
                    width: 40px;
                    height: 40px;
                }
                
                .lightbox-nav svg {
                    width: 20px;
                    height: 20px;
                }
                
                .lightbox-prev {
                    left: 5px;
                }
                
                .lightbox-next {
                    right: 5px;
                }
                
                .lightbox-counter {
                    font-size: 14px;
                    padding: 6px 12px;
                    bottom: 10px;
                }
            }
            
            /* Для очень маленьких экранов */
            @media (max-width: 480px) {
                .lightbox-counter {
                    font-size: 13px;
                }
            }
        `;
        document.head.appendChild(style);
    }
}
function initSliderHover(swiperInstance) {
    const sliderElement = swiperInstance.el;
    const arrows = {
        prev: sliderElement.querySelector('.swiper-button-prev'),
        next: sliderElement.querySelector('.swiper-button-next')
    };

    sliderElement.addEventListener('mouseenter', () => {
        sliderElement.classList.add('is-hovered');
    });

    sliderElement.addEventListener('mouseleave', () => {
        sliderElement.classList.remove('is-hovered');
        arrows.prev.classList.remove('show');
        arrows.next.classList.remove('show');
    });

    sliderElement.addEventListener('mousemove', (e) => {
        if (!sliderElement.classList.contains('is-hovered')) return;

        const rect = sliderElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const threshold = width * 0.5;

        arrows.prev.classList.remove('show');
        arrows.next.classList.remove('show');

        if (x < threshold) {
            arrows.prev.classList.add('show');
        } else if (x > width - threshold) {
            arrows.next.classList.add('show');
        }
    });
}

function updateArrowStates(swiperInstance) {
    const sliderElement = swiperInstance.el;
    const arrows = {
        prev: sliderElement.querySelector('.swiper-button-prev'),
        next: sliderElement.querySelector('.swiper-button-next')
    };

    if (swiperInstance.isBeginning) {
        arrows.prev.classList.add('disabled');
        arrows.prev.setAttribute('disabled', 'disabled');
    } else {
        arrows.prev.classList.remove('disabled');
        arrows.prev.removeAttribute('disabled');
    }

    if (swiperInstance.isEnd) {
        arrows.next.classList.add('disabled');
        arrows.next.setAttribute('disabled', 'disabled');
    } else {
        arrows.next.classList.remove('disabled');
        arrows.next.removeAttribute('disabled');
    }
}

function initProductSlider() {
    const sliderElement = document.querySelector('.slider-product');
    if (!sliderElement) return null;

    productSlider = new Swiper(".slider-product", {
        autoplay: false,
        speed: 500,
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        pagination: {
            el: ".slider-product .swiper-pagination",
            clickable: true
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        on: {
            init: function () {
                initSliderHover(this);
                updateArrowStates(this);
                initProductFancybox(this);
            },
            slideChange: function () {
                updateArrowStates(this);
            }
        }
    });

    return productSlider;
}


export function SlidersInit() {
    const mainSlider = new Swiper(".slider-main", {
        autoplay: false,
        speed: 1000,
        pagination: {
            el: ".slider-main .swiper-pagination",
            clickable: true
        }
    });


    const nextButton = document.querySelector('.main-slider .swiper-button-next');
    const prevButton = document.querySelector('.main-slider .swiper-button-prev');

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            mainSlider.slideNext();
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            mainSlider.slidePrev();
        });
    }

    const bestsellersSlider = new Swiper(".slider-bestsellers", {
        autoplay: false,
        slidesPerView: 2,
        spaceBetween: 30,
        speed: 1000,
        pagination: {
            el: ".slider-bestsellers .swiper-pagination",
            clickable: true
        },
        navigation: {
            nextEl: '.slider-bestsellers .swiper-button-next',
            prevEl: '.slider-bestsellers .swiper-button-prev'
        },
        breakpoints: {
            0: {
                slidesPerView: 1.2,
                spaceBetween: 30
            },
            1000: {
                slidesPerView: 1.5,
                spaceBetween: 30
            },
            1366: {
                slidesPerView: 2,
                spaceBetween: 30
            }
        }
    });

    const partnersSlider = new Swiper(".slider-partners", {
        autoplay: {
            delay: 3000
        },
        slidesPerView: 8,
        loop: true,
        speed: 500,
        spaceBetween: 0,
        centeredSlides: false,
        initialSlide: 0,
        breakpoints: {
            0: {
                slidesPerView: 5
            },
            1365: {
                slidesPerView: 6
            },
            1640: {
                slidesPerView: 8
            }
        },
        on: {
            init: function () {
                const sliderElement = this.el;

                sliderElement.addEventListener('mouseenter', () => {
                    this.autoplay.stop();
                });

                sliderElement.addEventListener('mouseleave', () => {
                    this.autoplay.start();
                });
            }
        }
    });

    const mainNewsSlider = new Swiper(".slider-main-news", {
        autoplay: false,
        slidesPerView: 3,
        spaceBetween: 32,
        speed: 1000,
        pagination: {
            el: ".slider-main-news .swiper-pagination",
            clickable: true
        },
        navigation: {
            nextEl: '.slider-main-news .swiper-button-next',
            prevEl: '.slider-main-news .swiper-button-prev'
        },
        breakpoints: {
            0: {
                slidesPerView: 2,
                spaceBetween: 15,
                pagination: false,
                navigation: false
            },
            500: {
                slidesPerView: 2.5,
                spaceBetween: 32
            },
            1301: {
                slidesPerView: 3,
                spaceBetween: 32
            }
        }
    });

    const productSlider = initProductSlider();

    const similarSlider = new Swiper(".slider-similar", {
        autoplay: false,
        slidesPerView: 2,
        spaceBetween: 30,
        speed: 1000,
        pagination: {
            el: ".slider-similar .swiper-pagination",
            clickable: true
        },
        navigation: {
            nextEl: '.slider-similar .swiper-button-next',
            prevEl: '.slider-similar .swiper-button-prev'
        },
        breakpoints: {
            0: {
                slidesPerView: 1.2,
                spaceBetween: 30
            },
            1000: {
                slidesPerView: 1.5,
                spaceBetween: 30
            },
            1366: {
                slidesPerView: 2,
                spaceBetween: 30
            }
        }
    });

    const newsSlider = new Swiper(".slider-news-detail", {
        autoplay: false,
        speed: 1000,
        navigation: {
            nextEl: '.news-detail__controls .swiper-button-next',
            prevEl: '.news-detail__controls .swiper-button-prev'
        }
    });


    return {
        mainSlider,
        bestsellersSlider,
        partnersSlider,
        mainNewsSlider,
        productSlider,
        similarSlider,
        newsSlider
    };
}