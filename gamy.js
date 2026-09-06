const drawZone = document.getElementById("draw-zone");
const clearBtn = document.getElementById("clear");
const ctx = drawZone.getContext("2d");
const cestparti = document.getElementById("cestparti");

cestparti.addEventListener("mouseenter", function () {
  cestparti.src = " ./graphics/cestparti-invert.png";
});

cestparti.addEventListener("mouseleave", function () {
  cestparti.src = " ./graphics/cestparti.png";
});

clearBtn.addEventListener("click", function () {
  ctx.clearRect(0, 0, drawZone.width, drawZone.height);
});

let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Réglages du brush
ctx.lineJoin = "round";
ctx.lineCap = "round";
ctx.strokeStyle = "#000000";
ctx.lineWidth = 2;

function getPos(event) {
  const rect = drawZone.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

function startDrawing(event) {
  isDrawing = true;
  const pos = getPos(event);
  lastX = pos.x;
  lastY = pos.y;
}

function draw(event) {
  if (!isDrawing) return;

  const pos = getPos(event);

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();

  lastX = pos.x;
  lastY = pos.y;
}

function stopDrawing() {
  isDrawing = false;
}

drawZone.addEventListener("mousedown", startDrawing);
drawZone.addEventListener("mousemove", draw);
drawZone.addEventListener("mouseup", stopDrawing);
drawZone.addEventListener("mouseleave", stopDrawing);

let doodleModel;
let classNames = []; // à charger depuis categories.txt

async function loadDoodleModel() {
  doodleModel = await tf.loadLayersModel("./doodle-model/model.json");
  console.log("DoodleNet chargé !");
}

function classifyCanvas() {
  const prediction = tf.tidy(() => {
    let img = tf.browser.fromPixels(drawZone, 1); // 1 = niveaux de gris
    img = tf.image.resizeBilinear(img, [28, 28]);
    img = img.reshape([1, 28, 28, 1]);
    img = img.toFloat().div(255.0);
    // À tester : si les résultats sont mauvais, essaie d'inverser les couleurs
    // (trait blanc sur fond noir vs trait noir sur fond blanc) :
    // img = tf.scalar(1).sub(img);
    return doodleModel.predict(img);
  });

  prediction.data().then((scores) => {
    const top5 = Array.from(scores)
      .map((score, i) => ({ label: classNames[i], score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    console.log(top5);
  });

  prediction.dispose();
}

loadDoodleModel();

const check = document.getElementById("check");
check.addEventListener("click", function () {
  //alert("CLicker!d ");
  classifyCanvas();
});
