import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function shouldRunAnimations() {
    return window.innerWidth >= 1301;
}

function initStaticDotsPulsation(svgElement) {
    if (!svgElement) return;

    const staticDots = [
        svgElement.querySelector('circle[cx="775.5"]'),
        svgElement.querySelector('circle[cx="870.5"]'),
        svgElement.querySelector('circle[cx="965.5"]')
    ].filter(Boolean);

    staticDots.forEach((dot) => {
        if (!dot) return;

        const originalR = dot.getAttribute('r') || '5';
        dot.setAttribute('data-original-r', originalR);

        const randomDelay = Math.random() * 0.5;
        const randomDuration = 1.5 + Math.random() * 1.5;

        const pulseTimeline = gsap.timeline({
            repeat: -1,
            delay: randomDelay
        });

        pulseTimeline.to(dot, {
            attr: { r: 6 },
            duration: randomDuration * 0.4,
            ease: "sine.out"
        });

        pulseTimeline.to(dot, {
            attr: { r: originalR },
            duration: randomDuration * 0.6,
            ease: "sine.in"
        });

        dot._pulseTimeline = pulseTimeline;
    });
}

function getLineDrawingDirection(lineElement, hexagonCenterX, hexagonCenterY) {
    if (!lineElement) return { reverse: false };

    const pathLength = lineElement.getTotalLength();
    const startPoint = lineElement.getPointAtLength(0);
    const endPoint = lineElement.getPointAtLength(pathLength);

    const startDistance = Math.sqrt(
        Math.pow(startPoint.x - hexagonCenterX, 2) +
        Math.pow(startPoint.y - hexagonCenterY, 2)
    );

    const endDistance = Math.sqrt(
        Math.pow(endPoint.x - hexagonCenterX, 2) +
        Math.pow(endPoint.y - hexagonCenterY, 2)
    );

    return {
        reverse: endDistance < startDistance,
        startPoint,
        endPoint,
        startDistance,
        endDistance
    };
}

function getMinDistanceFromHexagon(lineElement, hexagonCenterX, hexagonCenterY) {
    if (!lineElement) return Infinity;

    const pathLength = lineElement.getTotalLength();
    const startPoint = lineElement.getPointAtLength(0);
    const endPoint = lineElement.getPointAtLength(pathLength);

    const startDistance = Math.sqrt(
        Math.pow(startPoint.x - hexagonCenterX, 2) +
        Math.pow(startPoint.y - hexagonCenterY, 2)
    );

    const endDistance = Math.sqrt(
        Math.pow(endPoint.x - hexagonCenterX, 2) +
        Math.pow(endPoint.y - hexagonCenterY, 2)
    );

    return Math.min(startDistance, endDistance);
}

function getCloserPointToHexagon(lineElement, hexagonCenterX, hexagonCenterY) {
    const pathLength = lineElement.getTotalLength();
    const startPoint = lineElement.getPointAtLength(0);
    const endPoint = lineElement.getPointAtLength(pathLength);

    const startDistance = Math.sqrt(
        Math.pow(startPoint.x - hexagonCenterX, 2) +
        Math.pow(startPoint.y - hexagonCenterY, 2)
    );

    const endDistance = Math.sqrt(
        Math.pow(endPoint.x - hexagonCenterX, 2) +
        Math.pow(endPoint.y - hexagonCenterY, 2)
    );

    return startDistance < endDistance ? 'start' : 'end';
}

function createAndAnimateElementOnLine(svgElement, lineData, lineIndex, totalLines, hexagonCenterX, hexagonCenterY) {
    const line = lineData.element;
    const lineLength = line.getTotalLength();

    const shouldAnimate = lineIndex % 4 === 0 || lineIndex % 5 === 0;
    if (!shouldAnimate || lineLength < 60) return null;

    const closerPoint = getCloserPointToHexagon(line, hexagonCenterX, hexagonCenterY);
    const fartherPoint = closerPoint === 'start' ? 'end' : 'start';

    let defs = svgElement.querySelector('defs');
    if (!defs) {
        defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        svgElement.insertBefore(defs, svgElement.firstChild);
    }

    const filterId = `moving-glow-${lineIndex}`;

    let filter = svgElement.querySelector(`#${filterId}`);
    if (!filter) {
        filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        filter.setAttribute('id', filterId);
        filter.setAttribute('x', '-70%');
        filter.setAttribute('y', '-70%');
        filter.setAttribute('width', '240%');
        filter.setAttribute('height', '240%');

        const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
        feGaussianBlur.setAttribute('in', 'SourceGraphic');
        feGaussianBlur.setAttribute('stdDeviation', '3');
        feGaussianBlur.setAttribute('result', 'blur');

        const feColorMatrix = document.createElementNS('http://www.w3.org/2000/svg', 'feColorMatrix');
        feColorMatrix.setAttribute('type', 'matrix');
        feColorMatrix.setAttribute('values', '1 0 0 0 0  0 0.88 0 0 0  0 0 0.55 0 0  0 0 0 1 0');
        feColorMatrix.setAttribute('result', 'coloredBlur');

        const feMerge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
        const feMergeNode1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
        feMergeNode1.setAttribute('in', 'coloredBlur');
        const feMergeNode2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
        feMergeNode2.setAttribute('in', 'SourceGraphic');

        feMerge.appendChild(feMergeNode1);
        feMerge.appendChild(feMergeNode2);
        filter.appendChild(feGaussianBlur);
        filter.appendChild(feColorMatrix);
        filter.appendChild(feMerge);
        defs.appendChild(filter);
    }

    const animatedGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    animatedGroup.classList.add('moving-line-element');
    animatedGroup.setAttribute('data-line-index', lineIndex);
    animatedGroup.setAttribute('data-direction', 'to-hexagon');

    const animatedPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const strokeColor = line.getAttribute('stroke') || '#FF9100';
    const strokeWidth = parseFloat(line.getAttribute('stroke-width') || '1');

    animatedPath.setAttribute('d', line.getAttribute('d'));
    animatedPath.setAttribute('stroke', strokeColor);
    animatedPath.setAttribute('stroke-width', (strokeWidth + 0.55).toString());
    animatedPath.setAttribute('stroke-linecap', 'round');
    animatedPath.setAttribute('stroke-linejoin', 'round');
    animatedPath.setAttribute('fill', 'none');
    animatedPath.setAttribute('filter', `url(#${filterId})`);
    animatedPath.style.opacity = '0.8';
    animatedPath.style.pointerEvents = 'none';

    const segmentLength = Math.min(22, lineLength * 0.19);
    const gapLength = lineLength * 0.81;

    animatedPath.style.strokeDasharray = `${segmentLength} ${gapLength}`;
    animatedPath.style.strokeDashoffset = '0';

    animatedGroup.appendChild(animatedPath);
    line.parentNode.insertBefore(animatedGroup, line.nextSibling);

    startLineElementAnimationToHexagon(
        animatedPath,
        lineLength,
        segmentLength,
        gapLength,
        lineIndex,
        fartherPoint
    );

    return {
        group: animatedGroup,
        path: animatedPath,
        lineIndex: lineIndex,
        direction: 'to-hexagon'
    };
}

function startLineElementAnimationToHexagon(path, lineLength, segmentLength, gapLength, index, startPoint) {
    const totalDash = segmentLength + gapLength;

    if (startPoint === 'end') {
        path.style.strokeDashoffset = lineLength + totalDash;

        const animateToStart = () => {
            gsap.to(path, {
                strokeDashoffset: -totalDash,
                duration: 15 + (index % 6) * 2,
                ease: "none",
                opacity: 0.88,
                onComplete: () => {
                    gsap.set(path, {
                        strokeDashoffset: lineLength + totalDash,
                        immediateRender: true
                    });
                    animateToStart();
                }
            });
        };

        setTimeout(() => {
            animateToStart();
        }, (index % 7) * 75);

    } else {
        path.style.strokeDashoffset = -totalDash;

        const animateToEnd = () => {
            gsap.to(path, {
                strokeDashoffset: lineLength + totalDash,
                duration: 15 + (index % 6) * 2,
                ease: "none",
                opacity: 0.88,
                onComplete: () => {
                    gsap.set(path, {
                        strokeDashoffset: -totalDash,
                        immediateRender: true
                    });
                    animateToEnd();
                }
            });
        };

        setTimeout(() => {
            animateToEnd();
        }, (index % 7) * 75);
    }
}

function animateAllLinesByDistance(svgElement, hexagonCenterX, hexagonCenterY) {
    if (!svgElement) return null;

    const allPaths = svgElement.querySelectorAll('path');
    const linesToAnimate = [];

    allPaths.forEach(path => {
        const className = path.className.baseVal || '';
        const d = path.getAttribute('d') || '';

        if (
            !path.getAttribute('fill')?.includes('paint0_radial') &&
            !path.getAttribute('fill')?.includes('#FF9F31') &&
            !className.includes('animated-line') &&
            !path.getAttribute('stroke')?.includes('#FF9100') &&
            !path.getAttribute('stroke')?.includes('#E5530A') &&
            path.getAttribute('stroke') &&
            d && d.length > 30
        ) {
            linesToAnimate.push(path);
        }
    });

    if (linesToAnimate.length === 0) return null;

    const sortedLines = linesToAnimate.map(line => ({
        element: line,
        distance: getMinDistanceFromHexagon(line, hexagonCenterX, hexagonCenterY)
    })).sort((a, b) => a.distance - b.distance);

    const masterTimeline = gsap.timeline();
    const animatedElements = [];

    sortedLines.forEach((lineData, index) => {
        const line = lineData.element;
        line.style.opacity = '0';

        const lineClone = line.cloneNode(true);
        lineClone.style.visibility = 'hidden';
        lineClone.style.position = 'absolute';
        document.body.appendChild(lineClone);
        const lineLength = lineClone.getTotalLength();
        document.body.removeChild(lineClone);

        line.style.strokeDasharray = 'none';
        line.style.strokeDashoffset = '0';
        line.style.strokeDasharray = `${lineLength}`;
        line.style.strokeDashoffset = `${lineLength}`;

        const delay = index * 0.18;

        const direction = getLineDrawingDirection(line, hexagonCenterX, hexagonCenterY);

        masterTimeline.to(line, {
            strokeDashoffset: 0,
            opacity: 1,
            duration: 0.85,
            ease: "power2.inOut",
            onComplete: () => {
                gsap.set(line, {
                    strokeDasharray: 'none',
                    strokeDashoffset: '0',
                    opacity: '1',
                    immediateRender: true
                });

                const animatedElement = createAndAnimateElementOnLine(
                    svgElement,
                    lineData,
                    index,
                    sortedLines.length,
                    hexagonCenterX,
                    hexagonCenterY
                );

                if (animatedElement) {
                    animatedElements.push(animatedElement);
                }
            }
        }, delay);
    });

    return masterTimeline;
}

export function initSVGAnimation() {
    if (!shouldRunAnimations()) {
        return null;
    }

    const mainForm = document.querySelector('.main-form');
    if (!mainForm) return null;

    const svgElement = document.querySelector('#main-animated-svg');
    if (!svgElement) return null;

    const linePath = svgElement.querySelector('.animated-line');
    const hexagonElement = svgElement.querySelector('path[fill*="paint0_radial"]');

    if (!linePath || !hexagonElement) return null;

    const hexagonBox = hexagonElement.getBBox();
    const hexagonCenterX = hexagonBox.x + hexagonBox.width / 2;
    const hexagonCenterY = hexagonBox.y + hexagonBox.height / 2;

    const staticDots = [
        svgElement.querySelector('circle[cx="775.5"]'),
        svgElement.querySelector('circle[cx="870.5"]'),
        svgElement.querySelector('circle[cx="965.5"]')
    ].filter(Boolean);

    const lineD = linePath.getAttribute('d');
    let lineStartX, lineY, lineEndX;

    const match = lineD.match(/M([\d.]+)\s+([\d.]+)H([\d.]+)/);
    if (match) {
        lineStartX = parseFloat(match[1]);
        lineY = parseFloat(match[2]);
        lineEndX = parseFloat(match[3]);
    } else {
        lineStartX = 687;
        lineY = 369.5;
        lineEndX = 1119.5;
    }

    linePath.style.opacity = '0';
    staticDots.forEach(dot => {
        if (dot) dot.style.opacity = '0';
    });
    hexagonElement.style.opacity = '0';

    const allPaths = svgElement.querySelectorAll('path');
    allPaths.forEach(path => {
        const className = path.className.baseVal || '';
        const fill = path.getAttribute('fill') || '';

        if (
            !fill.includes('paint0_radial') &&
            !fill.includes('#FF9F31') &&
            !className.includes('animated-line') &&
            path.getAttribute('stroke')
        ) {
            path.style.opacity = '0';
        }
    });

    const staticDotCallbacks = [];

    const masterTimeline = gsap.timeline({
        paused: true,
        onComplete: function() {
            linePath.style.opacity = '1';
            hexagonElement.style.opacity = '1';

            staticDots.forEach(dot => {
                if (dot) dot.style.opacity = '1';
            });

            allPaths.forEach(path => {
                const className = path.className.baseVal || '';
                const fill = path.getAttribute('fill') || '';

                if (
                    !fill.includes('paint0_radial') &&
                    !fill.includes('#FF9F31') &&
                    !className.includes('animated-line') &&
                    path.getAttribute('stroke')
                ) {
                    path.style.opacity = '1';
                }
            });

            initStaticDotsPulsation(svgElement);
        }
    });

    masterTimeline.to(hexagonElement, {
        opacity: 1,
        duration: 1.0,
        ease: "power2.out"
    }, 0);

    masterTimeline.to(hexagonElement, {
        rotationZ: 360,
        duration: 2.8,
        ease: "power2.inOut",
        transformOrigin: "center center"
    }, 0.7);

    const lineClone = linePath.cloneNode(true);
    lineClone.style.visibility = 'hidden';
    lineClone.style.position = 'absolute';
    document.body.appendChild(lineClone);
    const lineLength = lineClone.getTotalLength();
    document.body.removeChild(lineClone);

    linePath.style.strokeDasharray = `${lineLength}`;
    linePath.style.strokeDashoffset = `${lineLength}`;

    masterTimeline.to(linePath, {
        strokeDashoffset: 0,
        opacity: 1,
        duration: 2.8,
        ease: "power2.inOut",
        onComplete: () => {
            gsap.set(linePath, {
                strokeDasharray: 'none',
                strokeDashoffset: '0',
                opacity: '1',
                immediateRender: true
            });
        }
    }, 0.7);

    const allLinesTimeline = animateAllLinesByDistance(svgElement, hexagonCenterX, hexagonCenterY);
    if (allLinesTimeline) {
        masterTimeline.add(allLinesTimeline, 0.9);
    }

    const logoIcon = svgElement.querySelector('path[fill="#FF9F31"]');
    if (logoIcon) {
        logoIcon.style.opacity = '0';
        masterTimeline.to(logoIcon, {
            opacity: 1,
            duration: 0.8,
            ease: "power2.out"
        }, 0.4);
    }

    staticDots.forEach((staticDot, index) => {
        const delay = 1.3 + (index * 0.9);
        if (!staticDot) return;

        const dotGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        dotGroup.classList.add('moving-dot-group');

        const glow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        glow.setAttribute('cx', lineStartX);
        glow.setAttribute('cy', lineY);
        glow.setAttribute('r', '7.5');
        glow.setAttribute('fill', '#FF7031');
        glow.setAttribute('fill-opacity', '0.28');
        glow.style.opacity = '0';
        glow.classList.add('dot-glow');

        const movingDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        movingDot.setAttribute('cx', lineStartX);
        movingDot.setAttribute('cy', lineY);
        movingDot.setAttribute('r', '5');
        movingDot.setAttribute('fill', '#FF7031');
        movingDot.style.opacity = '0';
        movingDot.classList.add('moving-dot');

        dotGroup.appendChild(glow);
        dotGroup.appendChild(movingDot);
        svgElement.appendChild(dotGroup);

        let staticDotShown = false;
        const dotTimeline = gsap.timeline();

        dotTimeline.to(glow, {
            opacity: 1,
            attr: { r: 8.5 },
            duration: 0.3,
            ease: "power2.out"
        }, 0);

        dotTimeline.to(movingDot, {
            opacity: 1,
            attr: { r: 5.5 },
            duration: 0.4,
            ease: "power2.out"
        }, 0.1);

        const moveDuration = 2.6;
        dotTimeline.to(dotGroup, {
            duration: moveDuration,
            ease: "power2.inOut",
            attr: {
                transform: `translate(${lineEndX - lineStartX}, 0)`
            },
            onUpdate: function() {
                const progress = this.progress();
                const currentX = lineStartX + ((lineEndX - lineStartX) * progress);

                glow.setAttribute('cx', currentX);
                movingDot.setAttribute('cx', currentX);

                const glowSize = 7 + Math.sin(progress * Math.PI * 5.5) * 2.8;
                glow.setAttribute('r', glowSize);

                const dotSize = 4.8 + Math.sin(progress * Math.PI * 5.5) * 1.7;
                movingDot.setAttribute('r', dotSize);

                const glowOpacity = 0.24 + Math.sin(progress * Math.PI * 2.8) * 0.12;
                glow.setAttribute('fill-opacity', glowOpacity);

                const dotOpacity = 0.88 + Math.sin(progress * Math.PI * 4.2) * 0.12;
                movingDot.style.opacity = dotOpacity;

                if (progress >= 0.88 && !staticDotShown) {
                    staticDotShown = true;
                    gsap.to(staticDot, {
                        opacity: 1,
                        duration: 0.2,
                        ease: "power2.out"
                    });

                    staticDotCallbacks.push(() => {
                        if (staticDot && !staticDot._pulseStarted) {
                            staticDot._pulseStarted = true;
                            setTimeout(() => {
                                const originalR = staticDot.getAttribute('r') || '5';
                                const randomDelay = Math.random() * 0.35;
                                const randomDuration = 1.5 + Math.random() * 1.5;

                                const pulseTimeline = gsap.timeline({
                                    repeat: -1,
                                    delay: randomDelay
                                });

                                pulseTimeline.to(staticDot, {
                                    attr: { r: 6 },
                                    duration: randomDuration * 0.4,
                                    ease: "sine.out"
                                });

                                pulseTimeline.to(staticDot, {
                                    attr: { r: originalR },
                                    duration: randomDuration * 0.6,
                                    ease: "sine.in"
                                });

                                staticDot._pulseTimeline = pulseTimeline;
                            }, 80);
                        }
                    });
                }
            },
            onComplete: function() {
                gsap.to([glow, movingDot], {
                    opacity: 0,
                    duration: 0.15,
                    ease: "power2.in",
                    onComplete: function() {
                        if (dotGroup.parentNode) {
                            dotGroup.parentNode.removeChild(dotGroup);
                        }

                        if (!staticDotShown) {
                            gsap.to(staticDot, {
                                opacity: 1,
                                duration: 0.2,
                                ease: "power2.out"
                            });

                            staticDotCallbacks.push(() => {
                                if (staticDot && !staticDot._pulseStarted) {
                                    staticDot._pulseStarted = true;
                                    const originalR = staticDot.getAttribute('r') || '5';
                                    const randomDelay = Math.random() * 0.35;
                                    const randomDuration = 1.5 + Math.random() * 1.5;

                                    const pulseTimeline = gsap.timeline({
                                        repeat: -1,
                                        delay: randomDelay
                                    });

                                    pulseTimeline.to(staticDot, {
                                        attr: { r: 6 },
                                        duration: randomDuration * 0.4,
                                        ease: "sine.out"
                                    });

                                    pulseTimeline.to(staticDot, {
                                        attr: { r: originalR },
                                        duration: randomDuration * 0.6,
                                        ease: "sine.in"
                                    });

                                    staticDot._pulseTimeline = pulseTimeline;
                                }
                            });
                        }

                        if (staticDotCallbacks[index]) {
                            staticDotCallbacks[index]();
                        }
                    }
                });
            }
        }, 0.2);

        masterTimeline.add(dotTimeline, delay);
    });

    ScrollTrigger.create({
        trigger: mainForm,
        start: "top 80%",
        end: "bottom 20%",
        once: true,
        markers: false,

        onEnter: () => {
            masterTimeline.play();
        },

        onEnterBack: () => {
            if (masterTimeline.progress() === 0) {
                masterTimeline.restart();
            }
        }
    });

    return {
        timeline: masterTimeline
    };
}

export function cleanupSVGAnimations() {
    document.querySelectorAll('circle[cx="775.5"], circle[cx="870.5"], circle[cx="965.5"]').forEach(dot => {
        if (dot._pulseTimeline) {
            dot._pulseTimeline.kill();
            delete dot._pulseTimeline;
        }
        if (dot.hasAttribute('data-original-r')) {
            dot.setAttribute('r', dot.getAttribute('data-original-r'));
            dot.removeAttribute('data-original-r');
        }
        delete dot._pulseStarted;
    });

    gsap.killTweensOf('*');
}

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (window.innerWidth < 1301) {
            cleanupSVGAnimations();
        }
    }, 250);
});