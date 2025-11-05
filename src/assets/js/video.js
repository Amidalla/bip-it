export function InitVideo() {
    class MediaBlock {
        constructor(container) {
            this.container = container;
            this.videoContent = container.querySelector('.media-content--video');
            this.videoElement = container.querySelector('video');
            this.playBtn = container.querySelector('.media-play-btn');
            this.loader = container.querySelector('.media-loader');

            // Флаг для отслеживания первой загрузки
            this.isFirstLoad = true;
            this.hasError = false;

            if (this.videoContent) {
                this.initVideo();
            }
        }

        initVideo() {
            // Предзагрузка только метаданных для iOS
            this.videoElement.preload = 'metadata';

            // Добавляем атрибут playsinline для iOS
            this.videoElement.setAttribute('playsinline', '');
            this.videoElement.setAttribute('webkit-playsinline', '');

            this.playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.playVideo();
            });

            this.videoContent.addEventListener('click', () => {
                if (this.videoElement.paused) {
                    this.playVideo();
                } else {
                    this.pauseVideo();
                }
            });

            // Обработчики событий видео
            this.videoElement.addEventListener('loadstart', () => {
                if (this.isFirstLoad) {
                    this.showLoader();
                }
            });

            this.videoElement.addEventListener('loadeddata', () => {
                this.hideLoader();
                this.isFirstLoad = false;
            });

            this.videoElement.addEventListener('canplay', () => {
                this.hideLoader();
            });

            this.videoElement.addEventListener('canplaythrough', () => {
                this.hideLoader();
            });

            this.videoElement.addEventListener('play', () => {
                this.videoContent.classList.add('playing');
                this.hideLoader();
            });

            this.videoElement.addEventListener('pause', () => {
                this.videoContent.classList.remove('playing');
                this.playBtn.style.display = 'block';
            });

            this.videoElement.addEventListener('ended', () => {
                this.videoContent.classList.remove('playing');
                this.playBtn.style.display = 'block';
            });

            this.videoElement.addEventListener('waiting', () => {
                this.showLoader();
            });

            this.videoElement.addEventListener('playing', () => {
                this.hideLoader();
            });

            // Обработка ошибок
            this.videoElement.addEventListener('error', (e) => {
                console.error('Ошибка видео:', e);
                this.hasError = true;
                this.hideLoader();
            });

            // Таймаут для скрытия лоадера на случай проблем с загрузкой
            setTimeout(() => {
                if (this.loader.style.display === 'block') {
                    this.hideLoader();
                }
            }, 10000); // 10 секунд таймаут

            // Для iOS также обрабатываем событие suspend
            this.videoElement.addEventListener('suspend', () => {
                // На iOS может возникнуть suspend до полной загрузки
                if (this.isFirstLoad) {
                    setTimeout(() => {
                        this.hideLoader();
                        this.isFirstLoad = false;
                    }, 500);
                }
            });
        }

        playVideo() {
            // На iOS может потребоваться пользовательское взаимодействие
            try {
                this.showLoader();
                const playPromise = this.videoElement.play();

                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            this.hideLoader();
                        })
                        .catch(error => {
                            console.error('Ошибка воспроизведения видео:', error);
                            this.hideLoader();
                        });
                }
            } catch (error) {
                console.error('Ошибка при попытке воспроизведения:', error);
                this.hideLoader();
            }
        }

        pauseVideo() {
            this.videoElement.pause();
        }

        showLoader() {
            if (this.hasError) return;

            this.loader.style.display = 'block';
            this.videoContent.classList.add('loading');
            this.playBtn.style.display = 'none';
        }

        hideLoader() {
            this.loader.style.display = 'none';
            this.videoContent.classList.remove('loading');

            // Показываем кнопку воспроизведения только если видео на паузе
            if (this.videoElement.paused) {
                this.playBtn.style.display = 'block';
            }
        }
    }

    function initMediaBlocks() {
        const mediaBlocks = document.querySelectorAll('.media-block');
        mediaBlocks.forEach(block => new MediaBlock(block));
    }

    // Инициализация когда DOM готов
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMediaBlocks);
    } else {
        initMediaBlocks();
    }
}