const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

// ضبط حجم اللوحة مرة واحدة عند التحميل
function initializeCanvas() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
}
initializeCanvas();
window.addEventListener("resize", initializeCanvas); // تحديث الحجم عند تغيير الحجم

// متغيرات الرسم
let drawing = false;
let color = "#000000";
let brushSize = 5;
let eraser = false;
let rainbow = false;

const history = [];
let historyIndex = -1;

// تحديد العناصر
const colorPicker = document.getElementById("colorPicker");
const brushSizeInput = document.getElementById("brushSize");
const eraserMode = document.getElementById("eraserMode");
const rainbowMode = document.getElementById("rainbowMode");
const undo = document.getElementById("undo");
const clearCanvasButton = document.getElementById("clearCanvas");
const saveCanvasButton = document.getElementById("saveCanvas");

// أحداث الأدوات
colorPicker.addEventListener("input", (e) => {
    color = e.target.value;
    eraser = false;
});

brushSizeInput.addEventListener("input", (e) => {
    brushSize = e.target.value;
});

eraserMode.addEventListener("click", () => {
    eraser = !eraser;
    rainbow = false;
});

rainbowMode.addEventListener("click", () => {
    rainbow = !rainbow;
    eraser = false;
});

undo.addEventListener("click", undoCanvas);
clearCanvasButton.addEventListener("click", clearCanvas);
saveCanvasButton.addEventListener("click", saveCanvas);

// ضبط الرسم مع الماوس
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mousemove", draw);

// ضبط الرسم مع اللمس
canvas.addEventListener("touchstart", (e) => startDrawing(e.touches[0]));
canvas.addEventListener("touchend", stopDrawing);
canvas.addEventListener("touchmove", (e) => draw(e.touches[0]));

function startDrawing(e) {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(getPosition(e).x, getPosition(e).y);
    saveState();
}

function stopDrawing() {
    drawing = false;
    ctx.closePath();
}

function draw(e) {
    if (!drawing) return;

    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.strokeStyle = eraser ? "#ffffff" : (rainbow ? getRandomColor() : color);
    ctx.lineTo(getPosition(e).x, getPosition(e).y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(getPosition(e).x, getPosition(e).y);
}

function getPosition(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
    };
}

function getRandomColor() {
    return `hsl(${Math.random() * 360}, 100%, 50%)`;
}

function undoCanvas() {
    if (historyIndex > 0) {
        historyIndex--;
        restoreCanvas();
    }
}

function saveState() {
    history.splice(historyIndex + 1);
    history.push(canvas.toDataURL());
    historyIndex = history.length - 1;
}

function restoreCanvas() {
    const img = new Image();
    img.src = history[historyIndex];
    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
    };
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveState();
}

function saveCanvas() {
    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = canvas.toDataURL();
    link.click();
}
