const xBlock = document.querySelector(".x");
const x = document.getElementById("x");
const yBlock = document.querySelector(".y");
const y = document.getElementById("y");
const gridUnitInput = document.getElementById("gridUnit");
const clearBTN = document.getElementById("clear");
const wrapper = document.querySelector(".wrapper");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let size = 25;

const filledCells = [];

canvas.height = window.innerHeight - (window.innerHeight % size) - 150;
canvas.width = window.innerWidth - (window.innerWidth % size) - 150;

drawGrid(canvas.height, canvas.width, size);

window.addEventListener("wheel", (event) => {
  const delta = Math.sign(event.deltaY);
  delta < 0 ? (size += 5) : (size -= 5);
  if (size < 5) size = 5;
  if (size > 180) size = 180;

  drawGrid(canvas.height, canvas.width, size);
});

canvas.addEventListener("click", (event) => {
  const x = Math.floor(event.x - 82) - ((event.x - 82) % size);
  const y = Math.floor(event.y - 77) - ((event.y - 77) % size);

  if (filledCells.length === 2) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    filledCells.length = 0;
    drawGrid(canvas.height, canvas.width, size);
  }

  filledCells.push({ x, y });

  if (filledCells.length === 2) drawPath(filledCells[0], filledCells[1]);

  ctx.beginPath();
  ctx.fillStyle = "lightblue";
  ctx.fillRect(x, y, size, size);
  ctx.closePath();
});

canvas.addEventListener("mousemove", (event) => {
  xBlock.style.left = `${event.x}px`;
  yBlock.style.top = `${event.y}px`;

  gridUnit = !(gridUnitInput.value * 1) ? 1 : gridUnitInput.value;

  x.innerHTML = Math.floor((event.x - 82) / size + 1) * gridUnit;
  y.innerHTML = Math.floor((event.y - 77) / size + 1) * gridUnit;
});

clearBTN.addEventListener("click", () => {
  drawGrid(canvas.height, canvas.width, size);
  filledCells.length = 0;
});

function drawGrid(height, width, size) {
  ctx.clearRect(0, 0, width, height);
  ctx.beginPath();
  ctx.lineWidth = 0.5;

  for (let i = 0; i <= height; i += size) {
    ctx.moveTo(0, i);
    ctx.lineTo(width, i);
  }

  for (let i = 0; i <= width; i += size) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i, height);
  }

  ctx.strokeStyle = "white";
  ctx.stroke();
  ctx.closePath();

  // origin
  ctx.beginPath();
  ctx.lineWidth = 5;

  ctx.moveTo(0, height);
  ctx.lineTo(0, 0);
  ctx.lineTo(width, 0);

  ctx.strokeStyle = "lightblue";
  ctx.stroke();
  ctx.closePath();
}

function drawPath(A, B) {
  const dx = Math.abs(B.x - A.x);
  const sx = A.x < B.x ? size : -size;
  const dy = -Math.abs(B.y - A.y);
  const sy = A.y < B.y ? size : -size;
  let e2;
  let er = dx + dy;
  let end = false;

  ctx.beginPath();

  while (!end) {
    ctx.rect(A.x, A.y, size, size);

    if (A.x === B.x && A.y === B.y) {
      end = true;
    }

    e2 = 2 * er;
    if (e2 > dy) {
      er += dy;
      A.x += sx;
    }
    if (e2 < dx) {
      er += dx;
      A.y += sy;
    }
  }

  ctx.fill();
}
