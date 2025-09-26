export function InitVideo() {
    class MediaBlock {
        constructor(container) {
            this.container = container;
            this.videoContent = container.querySelector('.media-content--video');
            this.videoElement = container.querySelector('video');
            this.playBtn = container.querySelector('.media-play-btn');
            this.loader = container.querySelector('.media-loader');

            if (this.videoContent) {
                this.initVideo();
            }
        }

        initVideo() {

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


            this.videoElement.addEventListener('loadstart', () => {
                this.showLoader();
            });

            this.videoElement.addEventListener('canplay', () => {
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
        }

        playVideo() {
            this.showLoader();
            this.videoElement.play().catch(error => {
                console.error('Ошибка воспроизведения видео:', error);
                this.hideLoader();
            });
        }

        pauseVideo() {
            this.videoElement.pause();
        }

        showLoader() {
            this.loader.style.display = 'block';
            this.videoContent.classList.add('loading');
        }

        hideLoader() {
            this.loader.style.display = 'none';
            this.videoContent.classList.remove('loading');
        }
    }


    function initMediaBlocks() {
        const mediaBlocks = document.querySelectorAll('.media-block');
        mediaBlocks.forEach(block => new MediaBlock(block));
    }

    document.addEventListener('DOMContentLoaded', initMediaBlocks);
}