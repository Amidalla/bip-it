// lines-renderer.js
export class RadialLinesRenderer {
    constructor(ctx, lines, canvasWidth, canvasHeight) {
        this.ctx = ctx;
        this.lines = lines;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.gradientsCache = new Map(); // Кэш для оптимизации создания градиентов
    }

    // Создание градиента по аналогии с SVG
    createGradient(gradientId, startX, startY, endX, endY) {
        const cacheKey = `${gradientId}_${startX}_${startY}_${endX}_${endY}`;

        if (this.gradientsCache.has(cacheKey)) {
            return this.gradientsCache.get(cacheKey);
        }

        let gradient = this.ctx.createLinearGradient(startX, startY, endX, endY);

        if (gradientId.includes('paint85')) {
            // Горизонтальный градиент
            gradient.addColorStop(0, '#FF7031');
            gradient.addColorStop(1, 'rgba(255, 112, 49, 0)');
        } else if (gradientId.includes('paint1') || gradientId.includes('paint2')) {
            // Вертикальные градиенты
            gradient.addColorStop(0, '#FF7031');
            gradient.addColorStop(0.764, 'rgba(255, 112, 49, 0)');
        } else {
            // Градиент по умолчанию
            gradient.addColorStop(0, '#FF7031');
            gradient.addColorStop(1, 'rgba(255, 112, 49, 0)');
        }

        this.gradientsCache.set(cacheKey, gradient);
        return gradient;
    }

    // Отрисовка одной линии с анимацией по прогрессу
    drawLine(line, progress = 1) {
        if (!line || !line.d || progress <= 0) return;

        this.ctx.save();
        this.ctx.strokeStyle = line.stroke || '#FF7031';
        this.ctx.lineWidth = line.strokeWidth || 1;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        // Применение градиента если есть
        if (line.gradientId) {
            const bounds = this.getLineBounds(line.points);
            const gradient = this.createGradient(
                line.gradientId,
                bounds.minX, bounds.minY,
                bounds.maxX, bounds.maxY
            );
            this.ctx.strokeStyle = gradient;
        }

        this.ctx.beginPath();
        this.parseAndDrawPath(line.d, progress);
        this.ctx.stroke();
        this.ctx.restore();
    }

    // Парсинг SVG path и отрисовка с учетом прогресса анимации
    parseAndDrawPath(d, progress) {
        const commands = d.split(/(?=[A-Z])/);
        let currentX = 0, currentY = 0;
        let pathLength = 0, totalLength = 0;

        // Вычисление общей длины path
        commands.forEach(cmd => {
            if (!cmd.trim()) return;
            totalLength += this.getCommandLength(cmd, currentX, currentY);
            const endPoint = this.getCommandEndPoint(cmd, currentX, currentY);
            currentX = endPoint.x;
            currentY = endPoint.y;
        });

        // Сброс для отрисовки
        currentX = 0;
        currentY = 0;
        pathLength = 0;

        // Отрисовка команд с учетом прогресса
        commands.forEach(cmd => {
            if (!cmd.trim()) return;

            const type = cmd[0];
            const coords = cmd.slice(1).trim().split(/[\s,]+/).map(Number);
            const commandLength = this.getCommandLength(cmd, currentX, currentY);

            if (pathLength + commandLength <= totalLength * progress) {
                this.drawCommand(type, coords, currentX, currentY, 1);
            } else if (pathLength < totalLength * progress) {
                const partialProgress = (totalLength * progress - pathLength) / commandLength;
                this.drawCommand(type, coords, currentX, currentY, partialProgress);
            }

            pathLength += commandLength;
            const endPoint = this.getCommandEndPoint(cmd, currentX, currentY);
            currentX = endPoint.x;
            currentY = endPoint.y;
        });
    }

    // Вычисление границ линии для градиента
    getLineBounds(points) {
        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;

        points.forEach(point => {
            minX = Math.min(minX, point.x);
            minY = Math.min(minY, point.y);
            maxX = Math.max(maxX, point.x);
            maxY = Math.max(maxY, point.y);
        });

        return { minX, minY, maxX, maxY };
    }

    // Расчет длины команды path
    getCommandLength(cmd, startX, startY) {
        const type = cmd[0];
        const coords = cmd.slice(1).trim().split(/[\s,]+/).map(Number);

        if (type === 'M' || type === 'L') {
            const dx = coords[0] - startX;
            const dy = coords[1] - startY;
            return Math.sqrt(dx * dx + dy * dy);
        } else if (type === 'C') {
            const dx = coords[4] - startX;
            const dy = coords[5] - startY;
            return Math.sqrt(dx * dx + dy * dy) * 1.5; // Приблизительная длина кривой
        }

        return 0;
    }

    // Получение конечной точки команды
    getCommandEndPoint(cmd, startX, startY) {
        const type = cmd[0];
        const coords = cmd.slice(1).trim().split(/[\s,]+/).map(Number);

        if (type === 'M' || type === 'L') {
            return { x: coords[0], y: coords[1] };
        } else if (type === 'C') {
            return { x: coords[4], y: coords[5] };
        }

        return { x: startX, y: startY };
    }

    // Отрисовка отдельной команды path
    drawCommand(type, coords, startX, startY, progress) {
        if (progress <= 0) return;

        if (type === 'M') {
            this.ctx.moveTo(coords[0], coords[1]);
        } else if (type === 'L') {
            if (progress >= 1) {
                this.ctx.lineTo(coords[0], coords[1]);
            } else {
                const endX = startX + (coords[0] - startX) * progress;
                const endY = startY + (coords[1] - startY) * progress;
                this.ctx.lineTo(endX, endY);
            }
        } else if (type === 'C') {
            if (progress >= 1) {
                this.ctx.bezierCurveTo(
                    coords[0], coords[1],
                    coords[2], coords[3],
                    coords[4], coords[5]
                );
            } else {
                // Частичная отрисовка кривой Безье
                const t = progress;
                const mt = 1 - t;
                const x = mt * mt * mt * startX + 3 * mt * mt * t * coords[0] +
                    3 * mt * t * t * coords[2] + t * t * t * coords[4];
                const y = mt * mt * mt * startY + 3 * mt * mt * t * coords[1] +
                    3 * mt * t * t * coords[3] + t * t * t * coords[5];
                this.ctx.lineTo(x, y);
            }
        }
    }

    // Основной метод отрисовки всех линий
    drawAllLines(progress) {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        // Сортировка линий по удаленности от центра для правильного порядка отрисовки
        const centerX = 619.5;
        const centerY = 367.5;

        const sortedLines = this.lines.map(line => ({
            line,
            distance: this.getMinDistanceFromCenter(line.points, centerX, centerY)
        })).sort((a, b) => b.distance - a.distance); // Сначала дальние, потом ближние

        sortedLines.forEach(({ line }) => {
            this.drawLine(line, progress);
        });
    }

    // Вычисление минимального расстояния от линии до центра
    getMinDistanceFromCenter(points, centerX, centerY) {
        let minDistance = Infinity;

        points.forEach(point => {
            const distance = Math.sqrt(
                Math.pow(point.x - centerX, 2) +
                Math.pow(point.y - centerY, 2)
            );
            minDistance = Math.min(minDistance, distance);
        });

        return minDistance;
    }
}