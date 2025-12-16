// form-animation-final-version.js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function shouldRunAnimations() {
    return window.innerWidth >= 1301;
}

// ========== КЛАСС ДЛЯ РАДИАЛЬНЫХ ЛИНИЙ С ГРАДИЕНТАМИ ==========
class RadialLinesRenderer {
    constructor(ctx, svgElement) {
        this.ctx = ctx;
        this.svgElement = svgElement;
        this.lines = [];
        this.animatedLines = [];
        this.gradientsCache = new Map();
        this.isAnimating = false;
        this.animationFrameId = null;
        this.animationTime = 0;
        this.lastTime = 0;
    }

    // Парсинг всех радиальных линий из SVG
    parseAllLinesFromSVG() {
        const allPaths = Array.from(this.svgElement.querySelectorAll('path'));

        const excludedPaths = [
            'M686 399.915V335.085C686 331.651 684.166 328.42 681.108 326.703L624.341 294.288',
            'M621.376 327V359.822H635L614.684 406V372.939H601L621.376 327Z',
            'M687 369.5H1119.5',
            'M552.537 371.641L-414.463 371.641'
        ];

        const lines = [];

        allPaths.forEach((path, index) => {
            const d = path.getAttribute('d') || '';
            const stroke = path.getAttribute('stroke') || '';

            if (!d || d.length < 20) return;

            let isExcluded = false;
            for (const excludedPath of excludedPaths) {
                if (d.startsWith(excludedPath.substring(0, 30))) {
                    isExcluded = true;
                    break;
                }
            }

            if (isExcluded) return;

            const isCurve = d.includes('C');
            if (isCurve) {
                const hasGradient = stroke.includes('url(#');

                let gradientId = '';
                let gradientData = null;

                if (hasGradient) {
                    const match = stroke.match(/url\(#([^)]+)\)/);
                    if (match) {
                        gradientId = match[1];
                        gradientData = this.parseGradient(gradientId);
                    }
                }

                lines.push({
                    id: `line-${index}`,
                    d,
                    stroke: '#FF7031',
                    strokeWidth: 1,
                    gradientId,
                    gradientData,
                    element: path,
                    originalStroke: stroke,
                    index: index
                });
            }
        });

        return lines;
    }

    // Парсинг данных градиента
    parseGradient(gradientId) {
        if (this.gradientsCache.has(gradientId)) {
            return this.gradientsCache.get(gradientId);
        }

        const gradientElement = this.svgElement.querySelector(`#${gradientId}`);
        if (!gradientElement) return null;

        const stops = Array.from(gradientElement.querySelectorAll('stop'));
        const gradientStops = stops.map(stop => ({
            offset: parseFloat(stop.getAttribute('offset')) || 0,
            color: stop.getAttribute('stop-color') || '#FF7031',
            opacity: parseFloat(stop.getAttribute('stop-opacity')) || 1
        }));

        const x1 = gradientElement.getAttribute('x1');
        const y1 = gradientElement.getAttribute('y1');
        const x2 = gradientElement.getAttribute('x2');
        const y2 = gradientElement.getAttribute('y2');

        const gradientData = {
            id: gradientId,
            x1: x1 ? parseFloat(x1) : 0,
            y1: y1 ? parseFloat(y1) : 0,
            x2: x2 ? parseFloat(x2) : 1,
            y2: y2 ? parseFloat(y2) : 0,
            stops: gradientStops,
            element: gradientElement
        };

        this.gradientsCache.set(gradientId, gradientData);
        return gradientData;
    }

    // Инициализация линий
    init(linesData) {
        this.lines = linesData;

        this.lines.forEach((line, index) => {
            line.points = this.parsePathToPoints(line.d);
            line.length = this.calculatePathLength(line.points);

            if (line.points.length >= 2) {
                line.startPoint = line.points[0];
                line.endPoint = line.points[line.points.length - 1];

                const centerX = 619.5;
                const centerY = 367.5;

                line.startDist = Math.sqrt(
                    Math.pow(line.startPoint.x - centerX, 2) +
                    Math.pow(line.startPoint.y - centerY, 2)
                );
                line.endDist = Math.sqrt(
                    Math.pow(line.endPoint.x - centerX, 2) +
                    Math.pow(line.endPoint.y - centerY, 2)
                );

                line.closerToCenter = line.startDist < line.endDist ? 'start' : 'end';
            }

            const shouldAnimate = index % 3 === 0 || index % 4 === 0;

            if (shouldAnimate && line.length > 60) {
                line.hasAnimation = true;
                const lengths = [20, 30];
                line.animationLength = lengths[Math.floor(Math.random() * lengths.length)];
                this.animatedLines.push(line);
            } else {
                line.hasAnimation = false;
            }
        });

        this.initLineAnimations();
    }

    // Преобразование SVG path в массив точек
    parsePathToPoints(d) {
        const points = [];
        const commands = d.match(/[MCL][^MCL]*/g) || [];

        let currentX = 0;
        let currentY = 0;
        let isFirstPoint = true;

        commands.forEach(cmd => {
            if (!cmd.trim()) return;

            const type = cmd[0];
            const coords = cmd.slice(1).trim().split(/[\s,]+/).map(Number);

            if (type === 'M') {
                currentX = coords[0];
                currentY = coords[1];
                if (isFirstPoint) {
                    points.push({ x: currentX, y: currentY, type: 'move' });
                    isFirstPoint = false;
                }
            } else if (type === 'L') {
                currentX = coords[0];
                currentY = coords[1];
                points.push({ x: currentX, y: currentY, type: 'line' });
            } else if (type === 'C') {
                currentX = coords[4];
                currentY = coords[5];
                points.push({
                    x: currentX,
                    y: currentY,
                    type: 'curve',
                    cp1x: coords[0], cp1y: coords[1],
                    cp2x: coords[2], cp2y: coords[3]
                });
            }
        });

        return points;
    }

    // Вычисление длины пути
    calculatePathLength(points) {
        if (points.length < 2) return 0;

        let length = 0;
        for (let i = 1; i < points.length; i++) {
            const dx = points[i].x - points[i-1].x;
            const dy = points[i].y - points[i-1].y;
            length += Math.sqrt(dx * dx + dy * dy);
        }
        return length;
    }

    // Отрисовка всех статических линий с градиентами
    drawAllLines() {
        if (this.lines.length === 0) return;

        const centerX = 619.5;
        const centerY = 367.5;

        const sortedLines = this.lines.map(line => {
            const firstPoint = line.points[0];
            const distance = Math.sqrt(
                Math.pow(firstPoint.x - centerX, 2) +
                Math.pow(firstPoint.y - centerY, 2)
            );
            return { line, distance };
        }).sort((a, b) => b.distance - a.distance);

        sortedLines.forEach(({ line }, index) => {
            this.drawStaticLineWithGradient(line, index);
        });
    }

    // Отрисовка одной статической линии с градиентом
    drawStaticLineWithGradient(line, index) {
        if (!line.points || line.points.length < 2) return;

        this.ctx.save();

        try {
            if (line.startPoint && line.endPoint) {
                let gradient;
                if (line.startDist < line.endDist) {
                    gradient = this.ctx.createLinearGradient(
                        line.startPoint.x, line.startPoint.y,
                        line.endPoint.x, line.endPoint.y
                    );
                } else {
                    gradient = this.ctx.createLinearGradient(
                        line.endPoint.x, line.endPoint.y,
                        line.startPoint.x, line.startPoint.y
                    );
                }

                gradient.addColorStop(0, 'rgba(255, 112, 49, 0.9)');
                gradient.addColorStop(0.3, 'rgba(255, 112, 49, 0.6)');
                gradient.addColorStop(0.6, 'rgba(255, 112, 49, 0.3)');
                gradient.addColorStop(0.9, 'rgba(255, 112, 49, 0.1)');
                gradient.addColorStop(1, 'rgba(255, 112, 49, 0)');

                this.ctx.strokeStyle = gradient;
            } else {
                this.ctx.strokeStyle = 'rgba(255, 112, 49, 0.8)';
            }
        } catch (error) {
            this.ctx.strokeStyle = 'rgba(255, 112, 49, 0.8)';
        }

        this.ctx.lineWidth = 1.1;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        this.ctx.beginPath();

        const firstPoint = line.points[0];
        if (firstPoint) {
            this.ctx.moveTo(firstPoint.x, firstPoint.y);
        }

        for (let i = 1; i < line.points.length; i++) {
            const prevPoint = line.points[i-1];
            const currentPoint = line.points[i];

            if (currentPoint.type === 'curve') {
                this.ctx.bezierCurveTo(
                    currentPoint.cp1x, currentPoint.cp1y,
                    currentPoint.cp2x, currentPoint.cp2y,
                    currentPoint.x, currentPoint.y
                );
            } else {
                this.ctx.lineTo(currentPoint.x, currentPoint.y);
            }
        }

        this.ctx.stroke();
        this.ctx.restore();
    }

    // Инициализация анимаций на линиях
    initLineAnimations() {
        this.animationCanvas = document.createElement('canvas');
        this.animationCanvas.width = this.ctx.canvas.width;
        this.animationCanvas.height = this.ctx.canvas.height;
        this.animationCanvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: auto;
            pointer-events: none;
            z-index: 15;
            background: transparent;
        `;

        this.animationCtx = this.animationCanvas.getContext('2d');

        if (this.ctx.canvas.parentNode) {
            this.ctx.canvas.parentNode.appendChild(this.animationCanvas);
        }

        this.startLineAnimations();
    }

    // Запуск анимаций линий
    startLineAnimations() {
        this.isAnimating = true;
        this.animationTime = 0;
        this.lastTime = 0;

        const animate = (timestamp) => {
            if (!this.isAnimating) return;

            if (!this.lastTime) this.lastTime = timestamp;
            const delta = timestamp - this.lastTime;
            this.lastTime = timestamp;

            this.animationTime += delta * 0.001;

            if (this.animationTime > 3600) {
                this.animationTime = this.animationTime % 3600;
            }

            this.animationCtx.clearRect(0, 0, this.animationCanvas.width, this.animationCanvas.height);
            this.drawMovingElements();
            this.animationFrameId = requestAnimationFrame(animate);
        };

        this.animationFrameId = requestAnimationFrame(animate);
    }

    // Отрисовка всех движущихся элементов
    drawMovingElements() {
        this.animatedLines.forEach((line, index) => {
            this.drawMovingLineOnPath(line, index);
        });
    }

    // Отрисовка движущегося элемента на линии
    drawMovingLineOnPath(line, lineIndex) {
        if (!line.points || line.points.length < 2) return;

        this.animationCtx.save();

        this.animationCtx.strokeStyle = '#FF7031';
        this.animationCtx.lineWidth = 1.5;
        this.animationCtx.lineCap = 'round';
        this.animationCtx.lineJoin = 'round';
        this.animationCtx.globalAlpha = 0.8;

        const totalLength = line.length;
        const segmentLength = line.animationLength || 25;
        const gapLength = totalLength * 0.8;

        const cycleDuration = 8 + (lineIndex % 6) * 1.5;
        const pixelsPerSecond = totalLength / cycleDuration;
        const offset = (this.animationTime * pixelsPerSecond) % (segmentLength + gapLength);

        this.animationCtx.setLineDash([segmentLength, gapLength]);

        if (line.closerToCenter === 'start') {
            this.animationCtx.lineDashOffset = -offset;
        } else {
            this.animationCtx.lineDashOffset = offset;
        }

        this.animationCtx.beginPath();

        const firstPoint = line.points[0];
        if (firstPoint) {
            this.animationCtx.moveTo(firstPoint.x, firstPoint.y);
        }

        for (let i = 1; i < line.points.length; i++) {
            const prevPoint = line.points[i-1];
            const currentPoint = line.points[i];

            if (currentPoint.type === 'curve') {
                this.animationCtx.bezierCurveTo(
                    currentPoint.cp1x, currentPoint.cp1y,
                    currentPoint.cp2x, currentPoint.cp2y,
                    currentPoint.x, currentPoint.y
                );
            } else {
                this.animationCtx.lineTo(currentPoint.x, currentPoint.y);
            }
        }

        this.animationCtx.stroke();
        this.animationCtx.setLineDash([]);
        this.animationCtx.restore();
    }

    // Получение точки на линии по параметру t
    getPointOnLine(points, t) {
        if (points.length < 2 || t < 0 || t > 1) return null;

        const totalLength = this.calculatePathLength(points);
        const targetLength = totalLength * t;

        let accumulatedLength = 0;

        for (let i = 1; i < points.length; i++) {
            const p0 = points[i-1];
            const p1 = points[i];

            const segmentLength = Math.sqrt(
                Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2)
            );

            if (accumulatedLength + segmentLength >= targetLength) {
                const segmentT = (targetLength - accumulatedLength) / segmentLength;

                if (p1.type === 'curve') {
                    const mt = 1 - segmentT;
                    return {
                        x: mt*mt*mt*p0.x + 3*mt*mt*segmentT*p1.cp1x + 3*mt*segmentT*segmentT*p1.cp2x + segmentT*segmentT*segmentT*p1.x,
                        y: mt*mt*mt*p0.y + 3*mt*mt*segmentT*p1.cp1y + 3*mt*segmentT*segmentT*p1.cp2y + segmentT*segmentT*segmentT*p1.y
                    };
                } else {
                    return {
                        x: p0.x + (p1.x - p0.x) * segmentT,
                        y: p0.y + (p1.y - p0.y) * segmentT
                    };
                }
            }

            accumulatedLength += segmentLength;
        }

        return points[points.length - 1];
    }

    // Остановка анимаций
    stopAnimations() {
        this.isAnimating = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    // Полная очистка
    cleanup() {
        this.stopAnimations();
        this.lines = [];
        this.animatedLines = [];
        this.gradientsCache.clear();

        if (this.animationCanvas && this.animationCanvas.parentNode) {
            this.animationCanvas.parentNode.removeChild(this.animationCanvas);
        }
    }
}

// ========== КЛАСС АНИМАЦИИ ШАРИКОВ ==========
class InfiniteBallAnimation {
    constructor(canvas, hexagonRightEdgeX, y, lineEndX) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.hexagonRightEdge = 686;
        this.y = y;
        this.endX = lineEndX;
        this.balls = [];
        this.isRunning = false;
        this.animationId = null;
        this.lastTime = 0;

        this.targetBallCount = 4;
        this.dotRadius = 6;
        this.glowRadius = 9;
        this.minSpeed = 0.8;
        this.maxSpeed = 1.2;
        this.minSpawnInterval = 1500;
        this.maxSpawnInterval = 4000;
        this.pulseSpeed = 2.0;
        this.pulseIntensity = 0.15;
        this.spawnTimer = null;
    }

    // Запуск анимации шариков
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = performance.now();

        this.startSpawningBalls();
        this.animate();
    }

    // Остановка анимации шариков
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.spawnTimer) {
            clearTimeout(this.spawnTimer);
        }
        this.balls = [];
    }

    // Запуск спавна шариков
    startSpawningBalls() {
        const spawnNextBall = () => {
            if (!this.isRunning) return;

            const ballsOnLine = this.balls.filter(ball =>
                ball.x >= this.hexagonRightEdge && ball.x <= this.endX
            ).length;

            if (ballsOnLine < this.targetBallCount) {
                const newBall = {
                    id: `ball-${Date.now()}`,
                    x: this.hexagonRightEdge,
                    y: this.y,
                    radius: this.dotRadius,
                    currentRadius: this.dotRadius,
                    speed: this.minSpeed + Math.random() * (this.maxSpeed - this.minSpeed),
                    pulseTime: Math.random() * Math.PI * 2,
                    opacity: 0.9 + Math.random() * 0.1,
                    isActive: true
                };
                this.balls.push(newBall);
            }

            if (this.isRunning) {
                const nextSpawnTime = this.minSpawnInterval + Math.random() * (this.maxSpawnInterval - this.minSpawnInterval);
                this.spawnTimer = setTimeout(spawnNextBall, nextSpawnTime);
            }
        };

        const firstSpawnTime = this.minSpawnInterval + Math.random() * (this.maxSpawnInterval - this.minSpawnInterval);
        this.spawnTimer = setTimeout(spawnNextBall, firstSpawnTime);
    }

    // Основной цикл анимации шариков
    animate(currentTime = 0) {
        if (!this.isRunning) return;

        const delta = Math.min(currentTime - this.lastTime, 32);
        this.lastTime = currentTime;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.balls.length; i++) {
            const ball = this.balls[i];
            if (!ball.isActive) continue;

            ball.pulseTime += 0.03 * (delta / 16);
            const pulse = 1 + Math.sin(ball.pulseTime * this.pulseSpeed) * this.pulseIntensity;
            ball.currentRadius = ball.radius * pulse;

            ball.x += ball.speed * (delta / 16);

            if (ball.x > this.endX + 50) {
                this.balls.splice(i, 1);
                i--;
                continue;
            }

            if (ball.x >= this.hexagonRightEdge) {
                this.drawBallLikeInSVG(ball.x, ball.y, ball.currentRadius, ball.opacity);
            }
        }

        this.animationId = requestAnimationFrame((time) => this.animate(time));
    }

    // Отрисовка шарика как в SVG
    drawBallLikeInSVG(x, y, radius, opacity) {
        this.ctx.save();

        this.ctx.globalAlpha = opacity * 0.28;
        this.ctx.fillStyle = '#FF7031';
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.glowRadius, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.globalAlpha = opacity;
        this.ctx.fillStyle = '#FF7031';
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
    }
}

// ========== ФУНКЦИИ ОТРИСОВКИ СТАТИЧЕСКИХ ЭЛЕМЕНТОВ ==========

// Отрисовка шестиугольника
function drawHexagon(ctx, opacity = 1, rotation = 0) {
    ctx.save();
    ctx.globalAlpha = opacity;

    if (rotation !== 0) {
        ctx.translate(619.5, 367.5);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.translate(-619.5, -367.5);
    }

    const gradient = ctx.createRadialGradient(
        619.5, 367.5, 0,
        619.5, 367.5, 200
    );
    gradient.addColorStop(0, 'rgba(255, 112, 49, 0)');
    gradient.addColorStop(1, `rgba(255, 112, 49, ${opacity})`);

    ctx.beginPath();
    ctx.moveTo(686, 399.915);
    ctx.lineTo(686, 335.085);
    ctx.bezierCurveTo(686, 331.651, 684.166, 328.42, 681.108, 326.703);
    ctx.lineTo(624.341, 294.288);
    ctx.bezierCurveTo(621.284, 292.571, 617.615, 292.571, 614.557, 294.288);
    ctx.lineTo(557.892, 326.703);
    ctx.bezierCurveTo(554.834, 328.42, 553, 331.651, 553, 335.085);
    ctx.lineTo(553, 399.915);
    ctx.bezierCurveTo(553, 403.349, 554.834, 406.58, 557.892, 408.297);
    ctx.lineTo(614.557, 440.712);
    ctx.bezierCurveTo(617.615, 442.429, 621.284, 442.429, 624.341, 440.712);
    ctx.lineTo(681.006, 408.297);
    ctx.bezierCurveTo(684.064, 406.58, 685.898, 403.349, 685.898, 399.915);
    ctx.closePath();

    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.strokeStyle = `rgba(229, 83, 10, ${opacity})`;
    ctx.lineWidth = 1.84282;
    ctx.lineJoin = 'miter';
    ctx.miterLimit = 10;
    ctx.stroke();

    ctx.restore();
}

// Отрисовка логотипа
function drawLogo(ctx, opacity = 1) {
    ctx.save();
    ctx.globalAlpha = opacity;

    ctx.beginPath();
    ctx.moveTo(621.376, 327);
    ctx.lineTo(621.376, 359.822);
    ctx.lineTo(635, 359.822);
    ctx.lineTo(614.684, 406);
    ctx.lineTo(614.684, 372.939);
    ctx.lineTo(601, 372.939);
    ctx.lineTo(621.376, 327);
    ctx.closePath();

    ctx.fillStyle = `rgba(255, 159, 49, ${opacity})`;
    ctx.fill();

    ctx.restore();
}

// Отрисовка анимированной основной линии
function drawAnimatedMainLine(ctx, startX, y, endX, progress, opacity = 1) {
    ctx.save();
    ctx.globalAlpha = opacity;

    const lineLength = endX - startX;
    const dashLength = lineLength * progress;
    const remainingLength = lineLength - dashLength;

    ctx.beginPath();
    ctx.moveTo(startX, y);
    ctx.lineTo(endX, y);

    ctx.strokeStyle = '#FF7031';
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';

    ctx.setLineDash([dashLength, remainingLength]);
    ctx.lineDashOffset = 0;

    ctx.stroke();
    ctx.restore();
}

// ========== ОСНОВНАЯ ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ ==========
export function initSVGAnimation() {
    if (!shouldRunAnimations()) {
        return null;
    }

    const mainForm = document.querySelector('.main-form');
    if (!mainForm) return null;

    try {
        const svgElement = document.querySelector('#main-animated-svg');
        if (!svgElement) return null;

        const svgWidth = parseInt(svgElement.getAttribute('width')) || 1120;
        const svgHeight = parseInt(svgElement.getAttribute('height')) || 573;

        const container = document.createElement('div');
        container.style.cssText = `
            position: relative;
            width: 100%;
            max-width: ${svgWidth}px;
            margin: 0 auto;
        `;

        const mainCanvas = document.createElement('canvas');
        mainCanvas.className = 'main-canvas';
        mainCanvas.width = svgWidth;
        mainCanvas.height = svgHeight;
        mainCanvas.style.cssText = `
            width: 100%;
            height: auto;
            display: block;
            max-width: ${svgWidth}px;
            background: transparent;
        `;

        const ballsCanvas = document.createElement('canvas');
        ballsCanvas.className = 'balls-canvas';
        ballsCanvas.width = svgWidth;
        ballsCanvas.height = svgHeight;
        ballsCanvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: auto;
            max-width: ${svgWidth}px;
            z-index: 20;
            pointer-events: none;
            background: transparent;
        `;

        container.appendChild(mainCanvas);
        container.appendChild(ballsCanvas);
        svgElement.parentNode.insertBefore(container, svgElement);

        svgElement.style.display = 'none';

        const mainCtx = mainCanvas.getContext('2d');
        const ballsCtx = ballsCanvas.getContext('2d');

        const hexagonRightEdgeX = 686;
        const lineEndX = 1119.5;
        const lineY = 369.5;

        const linesRenderer = new RadialLinesRenderer(mainCtx, svgElement);
        const linesData = linesRenderer.parseAllLinesFromSVG();
        let hasLines = linesData.length > 0;

        if (hasLines) {
            linesRenderer.init(linesData);
        }

        let ballAnimation = new InfiniteBallAnimation(ballsCanvas, hexagonRightEdgeX, lineY, lineEndX);
        let ballsStarted = false;

        const state = {
            hexagonRotation: 0,
            hexagonOpacity: 0,
            logoOpacity: 0,
            lineProgress: 0,
            isComplete: false
        };

        function drawStaticElements() {
            mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

            if (hasLines) {
                linesRenderer.drawAllLines();
            }

            if (state.hexagonOpacity > 0) {
                drawHexagon(mainCtx, state.hexagonOpacity, state.hexagonRotation);
            }

            if (state.logoOpacity > 0) {
                drawLogo(mainCtx, state.logoOpacity);
            }

            if (state.lineProgress > 0) {
                drawAnimatedMainLine(mainCtx, hexagonRightEdgeX, lineY, lineEndX, state.lineProgress, 1);
            }
        }

        drawStaticElements();

        const masterTimeline = gsap.timeline({
            paused: true,
            onUpdate: () => {
                mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

                if (hasLines) {
                    linesRenderer.drawAllLines();
                }

                if (state.hexagonOpacity > 0) {
                    drawHexagon(mainCtx, state.hexagonOpacity, state.hexagonRotation);
                }

                if (state.logoOpacity > 0) {
                    drawLogo(mainCtx, state.logoOpacity);
                }

                if (state.lineProgress > 0) {
                    drawAnimatedMainLine(mainCtx, hexagonRightEdgeX, lineY, lineEndX, state.lineProgress, 1);
                }

                if (state.lineProgress > 0 && !ballsStarted) {
                    ballsStarted = true;
                    ballAnimation.start();
                }
            }
        });

        masterTimeline.to(state, {
            hexagonOpacity: 1,
            duration: 0.4,
            ease: "power2.out"
        }, 0);

        masterTimeline.to(state, {
            logoOpacity: 1,
            duration: 0.3,
            ease: "power2.out"
        }, 0);

        masterTimeline.to(state, {
            hexagonRotation: 360,
            duration: 1.8,
            ease: "power2.inOut"
        }, 0);

        masterTimeline.to(state, {
            lineProgress: 1,
            duration: 1.2,
            ease: "power2.inOut"
        }, 0);

        const staticDots = [
            svgElement.querySelector('circle[cx="775.5"]'),
            svgElement.querySelector('circle[cx="870.5"]'),
            svgElement.querySelector('circle[cx="965.5"]')
        ].filter(Boolean);

        staticDots.forEach((dot, index) => {
            if (!dot) return;

            const originalR = parseFloat(dot.getAttribute('r')) || 2.5;
            const pulseDelay = 1.8 + (index * 0.5);

            masterTimeline.to(dot, {
                attr: { r: originalR * 1.4 },
                duration: 0.5,
                ease: "sine.out",
                repeat: -1,
                yoyo: true,
                repeatDelay: 1.0
            }, pulseDelay);
        });

        ScrollTrigger.create({
            trigger: mainForm,
            start: "top 80%",
            end: "bottom 20%",
            once: true,
            onEnter: () => {
                masterTimeline.play();
            },
            onEnterBack: () => {
                if (masterTimeline.progress() === 0) {
                    masterTimeline.play();
                }
            }
        });

        return {
            container,
            timeline: masterTimeline,
            cleanup: () => {
                if (ballAnimation) {
                    ballAnimation.stop();
                }

                if (linesRenderer) {
                    linesRenderer.cleanup();
                }

                masterTimeline.kill();
                gsap.killTweensOf('*');

                staticDots.forEach(dot => {
                    if (dot) {
                        gsap.killTweensOf(dot);
                        const originalR = parseFloat(dot.getAttribute('data-original-r')) || 2.5;
                        dot.setAttribute('r', originalR);
                    }
                });

                if (container && container.parentNode) {
                    container.parentNode.removeChild(container);
                }

                if (svgElement) {
                    svgElement.style.display = 'block';
                }
            }
        };

    } catch (error) {
        return null;
    }
}

// Функция очистки анимаций
export function cleanupSVGAnimations() {
    const container = document.querySelector('div[style*="position: relative"]');
    const svgElement = document.querySelector('#main-animated-svg');
    const mainCanvas = document.querySelector('.main-canvas');
    const ballsCanvas = document.querySelector('.balls-canvas');

    if (mainCanvas && mainCanvas.parentNode) {
        mainCanvas.parentNode.removeChild(mainCanvas);
    }

    if (ballsCanvas && ballsCanvas.parentNode) {
        ballsCanvas.parentNode.removeChild(ballsCanvas);
    }

    if (container && container.parentNode) {
        container.parentNode.removeChild(container);
    }

    if (svgElement) {
        svgElement.style.display = 'block';
    }

    gsap.killTweensOf('*');

    document.querySelectorAll('circle[cx="775.5"], circle[cx="870.5"], circle[cx="965.5"]').forEach(dot => {
        const originalR = parseFloat(dot.getAttribute('data-original-r')) || 2.5;
        dot.setAttribute('r', originalR);
        dot.removeAttribute('data-original-r');
    });
}
/*import { gsap } from 'gsap';
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
});*/