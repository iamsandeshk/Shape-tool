const canvas = document.getElementById('canvas');
const shadowToggle = document.getElementById('shadow-toggle');
const generateCodeButton = document.getElementById('generate-code');
const addDotButton = document.getElementById('add-dot');
const htmlCodeOutput = document.getElementById('html-code');
const cssCodeOutput = document.getElementById('css-code');
const htmlCodeBox = document.getElementById('html-code-box');
const cssCodeBox = document.getElementById('css-code-box');
const copyHtmlButton = document.getElementById('copy-html');
const copyCssButton = document.getElementById('copy-css');
const shapeSvg = document.getElementById('shape-svg');

let selectedDot = null;
let offsetX, offsetY;

// Handle dot dragging
canvas.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('dot')) {
        selectedDot = e.target;
        offsetX = e.clientX - selectedDot.getBoundingClientRect().left;
        offsetY = e.clientY - selectedDot.getBoundingClientRect().top;
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (selectedDot) {
        const rect = canvas.getBoundingClientRect();
        selectedDot.style.left = `${e.clientX - rect.left - offsetX}px`;
        selectedDot.style.top = `${e.clientY - rect.top - offsetY}px`;
        drawShape();
    }
});

canvas.addEventListener('mouseup', () => {
    selectedDot = null;
});

// Add new dot to canvas
addDotButton.addEventListener('click', () => {
    const newDot = document.createElement('div');
    newDot.classList.add('dot');
    newDot.style.left = '100px';
    newDot.style.top = '100px';
    canvas.appendChild(newDot);
    drawShape();
});

generateCodeButton.addEventListener('click', () => {
    generateCode();
    // Show the code boxes after generating the code
    htmlCodeBox.style.display = 'block';
    cssCodeBox.style.display = 'block';
});

// Draw shape by connecting dots
function drawShape() {
    const dots = document.querySelectorAll('.dot');
    const points = Array.from(dots).map(dot => ({
        x: parseInt(dot.style.left),
        y: parseInt(dot.style.top)
    }));

    if (points.length < 2) return;

    // Create the path data
    const pathData = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x},${point.y}`).join(' ') + ' Z';
    
    // Draw the SVG shape
    shapeSvg.innerHTML = `<path d="${pathData}" class="shape ${shadowToggle.checked ? 'shape-shadow' : ''}" stroke="black" stroke-width="2" fill="none" />`;
}

function generateCode() {
    const dots = document.querySelectorAll('.dot');
    const points = Array.from(dots).map(dot => ({
        x: parseInt(dot.style.left),
        y: parseInt(dot.style.top)
    }));

    if (points.length < 2) return;

    const canvasWidth = canvas.offsetWidth;
    const canvasHeight = canvas.offsetHeight;

    // Convert points to percentages
    const polygonPoints = points.map(point => {
        const xPercent = (point.x / canvasWidth) * 100;
        const yPercent = (point.y / canvasHeight) * 100;
        return `${xPercent}% ${yPercent}%`;
    }).join(', ');

    const shadowClass = shadowToggle.checked ? ' shape-shadow' : '';

    const htmlCode = `<div class="wrapper"><div class="shape${shadowClass}"></div></div>`;
    const cssCode = `
    .wrapper {
    filter: drop-shadow(0px 5px 4px black);
}
.shape {
    position: relative;
    width: 600px;
    height: 600px;
    clip-path: polygon(${polygonPoints});
    background-color: #3498db;
    border: 1px solid black; /* Ensures visibility of the shape */
}`;

    htmlCodeOutput.textContent = htmlCode;
    cssCodeOutput.textContent = cssCode;
}

// Copy to clipboard
copyHtmlButton.addEventListener('click', () => {
    copyToClipboard(htmlCodeOutput.textContent);
});

copyCssButton.addEventListener('click', () => {
    copyToClipboard(cssCodeOutput.textContent);
});

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {

    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

// Initial shape drawing
drawShape();
