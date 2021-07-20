const xBlock = document.querySelector(".x");
const x = document.getElementById("x");
const yBlock = document.querySelector(".y");
const y = document.getElementById("y");
const gridUnit = document.getElementById("gridUnit");
const clearBTN = document.getElementById("clear");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let size = 25;
const height = window.innerHeight - (window.innerHeight % size) - 150;
const width = window.innerWidth - (window.innerWidth % size) - 150;
const filledCells = [];

canvas.height = height;
canvas.width = width;

drawGrid(height, width, size);

window.addEventListener("wheel", (event) => {
  const delta = Math.sign(event.deltaY);
  delta < 0 ? (size += 5) : (size -= 5);
  if (size < 5) size = 5;

  drawGrid(height, width, size);
});

canvas.addEventListener("click", (event) => {
  const x = Math.floor(event.x - 82) - ((event.x - 82) % size);
  const y = Math.floor(event.y - 77) - ((event.y - 77) % size);

  if (filledCells.length === 2) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    filledCells.length = 0;
    drawGrid(height, width, size);
  }

  filledCells.push({ x, y });

  if (filledCells.length === 2) drawPath();

  ctx.beginPath();
  ctx.fillStyle = "lightblue";
  ctx.fillRect(x, y, size, size);
  ctx.closePath();
});

canvas.addEventListener("mousemove", (event) => {
  xBlock.style.left = `${event.x}px`;
  yBlock.style.top = `${event.y}px`;

  //   x.innerHTML = event.x - 82;
  //   y.innerHTML = event.y - 77;
  x.innerHTML = Math.floor((event.x - 82) / size + 1) * (gridUnit.value || 1);
  y.innerHTML = Math.floor((event.y - 77) / size + 1) * (gridUnit.value || 1);
});

clearBTN.addEventListener("click", () => {
  drawGrid(height, width, size);
});

function drawGrid(height, width, size) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.lineWidth = 1;

  for (let i = 0; i <= height; i += size) {
    ctx.moveTo(0, i);
    ctx.lineTo(width + 500, i);
  }

  for (let i = 0; i <= width; i += size) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i, height + 500);
  }

  ctx.strokeStyle = "rgb(210,210,210)";
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

function drawPath() {
  const [A, B] = filledCells;
  //   const C = {
  //     x: Math.floor((A.x + B.x) / 2 / size) * size,
  //     y: Math.floor((A.y + B.y) / 2 / size) * size,
  //   };

  const C = {
    x: Math.floor((A.x + (A.x + (A.x + B.x) / 2) / 2) / 2 / size) * size,
    y: Math.floor((A.y + (A.y + (A.y + B.y) / 2) / 2) / 2 / size) * size,
  };
  console.log(A, B);

  //   while (A.x !== B.x || A.y !== B.y) {
  setInterval(() => {
    if (A.x !== C.x || A.y !== C.y) {
      if (A.x !== C.x) A.x > C.x ? (A.x -= 25) : (A.x += 25);
      if (A.y !== C.y) A.y > C.y ? (A.y -= 25) : (A.y += 25);

      console.log(A.x);
      ctx.beginPath();
      ctx.fillRect(A.x, A.y, size, size);
      ctx.closePath();
    } else {
      // calculate center point
      C.x = Math.floor((A.x + (A.x + B.x) / 2) / 2 / size) * size;
      C.y = Math.floor((A.y + (A.y + B.y) / 2) / 2 / size) * size;
    }
  }, 100);
}
