// canvas-converter.js
export function parseSVGPaths(svgElement) {
    if (!svgElement) return null;

    // Получение всех элементов path из SVG
    const allPaths = Array.from(svgElement.querySelectorAll('path'));

    // Фильтрация только радиальных линий
    const radialLines = allPaths.filter(path => {
        const fill = path.getAttribute('fill') || '';
        const d = path.getAttribute('d') || '';

        // Критерии отбора: градиенты paint*_linear с достаточной длиной
        return fill.includes('paint') &&
            fill.includes('linear') &&
            d && d.length > 10 &&
            !fill.includes('paint0_radial') &&
            !fill.includes('#FF9F31');
    });

    // Парсинг данных линий
    const parsedLines = radialLines.map((path, index) => {
        const d = path.getAttribute('d');
        const fill = path.getAttribute('fill') || '';
        const stroke = path.getAttribute('stroke') || '';
        const strokeWidth = path.getAttribute('stroke-width') || '1';

        const points = parsePathData(d);

        return {
            element: path,
            d,
            points,
            fill,
            stroke,
            strokeWidth: parseFloat(strokeWidth),
            length: calculatePathLength(points),
            gradientId: fill.includes('url(#') ? fill.match(/url\(#([^)]+)\)/)?.[1] : null
        };
    });

    return parsedLines;
}

// Парсинг координат из SVG path data
function parsePathData(d) {
    const points = [];
    const commands = d.split(/(?=[A-Z])/);

    commands.forEach(cmd => {
        if (!cmd.trim()) return;

        const type = cmd[0];
        const coords = cmd.slice(1).trim().split(/[\s,]+/).map(Number);

        if (type === 'M' || type === 'L') {
            points.push({ x: coords[0], y: coords[1] });
        } else if (type === 'C') {
            // Для кривых Безье берем конечную точку
            points.push({ x: coords[4], y: coords[5] });
        }
    });

    return points;
}

// Расчет длины пути по точкам
function calculatePathLength(points) {
    let length = 0;
    for (let i = 1; i < points.length; i++) {
        const dx = points[i].x - points[i-1].x;
        const dy = points[i].y - points[i-1].y;
        length += Math.sqrt(dx * dx + dy * dy);
    }
    return length;
}