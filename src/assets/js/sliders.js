import Swiper from 'swiper';

export function SlidersInit() {
    const mainSlider = new Swiper(".slider-main", {
        autoplay: false,
        speed: 1000,
        pagination: {
            el: ".slider-main .swiper-pagination",
            clickable: true
        },
        navigation: {
            nextEl: '.slider-main .swiper-button-next',
            prevEl: '.slider-main .swiper-button-prev'
        },
        breakpoints: {
            450: {
                navigation: false
            }
        }

    });

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

    const productSlider = new Swiper(".slider-product", {
        autoplay: false,
        speed: 1000,
        pagination: {
            el: ".slider-product .swiper-pagination",
            clickable: true
        }
    });

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