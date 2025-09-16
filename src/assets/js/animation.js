import { gsap } from 'gsap';

export class BannerAnimation {
    constructor() {
        this.banner = document.querySelector('.banner');
        this.lines = this.banner ? this.banner.querySelectorAll('.banner__lines .line') : [];
        this.ball = this.banner ? this.banner.querySelector('.pulsing-ball') : null;


        this.specialElements = this.findSpecialElements();

        this.rectElements = this.findRectElements();

        this.pathElements = this.findPathElements();

        this.specificLine = this.findSpecificLine();
        this.secondLine = this.findSecondLine();
        this.thirdLine = this.findThirdLine();
        this.fourthLine = this.findFourthLine();
        this.fifthLine = this.findFifthLine();
        this.sixthLine = this.findSixthLine();

        if (this.lines.length > 0 && this.ball && this.specificLine && this.secondLine &&
            this.thirdLine && this.fourthLine && this.fifthLine && this.sixthLine) {
            this.init();
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

    init() {
        this.setupAnimation();
        this.startAnimation();
    }

    setupAnimation() {

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

    startAnimation() {

        const lineAnimation = gsap.to(this.lines, {
            strokeDashoffset: 0,
            opacity: 1,
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
    }


    animateBall() {
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
}

