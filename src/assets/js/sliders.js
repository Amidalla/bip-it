import Swiper from "swiper";

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
    });

    const partnersSlider = new Swiper(".slider-partners", {
        autoplay: true,
        slidesPerView: 8, // Меняем на 'auto'
        loop: true,
        speed: 1000,
        spaceBetween: 0,
        centeredSlides: false,
        initialSlide: 0,
    });

    const mainNewsSlider = new Swiper(".slider-main-news", {
        autoplay: false,
        slidesPerView: 3,
        spaceBetween: 20,
        speed: 1000,
        pagination: {
            el: ".slider-main-news .swiper-pagination",
            clickable: true
        },
        navigation: {
            nextEl: '.slider-main-news .swiper-button-next',
            prevEl: '.slider-main-news .swiper-button-prev'
        },
    });
}










