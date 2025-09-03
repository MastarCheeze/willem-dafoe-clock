const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

/* Get rotation of long and short clock hand */
function getRotation(date) {
  const minInSecs = date.getMinutes() * 60 + date.getSeconds();
  const hourInSecs = date.getHours() * 3600 + minInSecs;

  return [
    (minInSecs / 3600) * 2 * Math.PI,
    (hourInSecs / (12 * 3600)) * 2 * Math.PI,
  ];
}

/* Create images */
const imgSources = {
  background: "assets/background.jpg",
  clockFace: "assets/clock-face.png",
  body: "assets/dafoe-body.png",
  longLeg: "assets/dafoe-long-leg.png",
  shortLeg: "assets/dafoe-short-leg.png",
};
const img = {};
for (const key in imgSources) {
  img[key] = new Image();
  img[key].src = imgSources[key];
}

const baseScalePx = [1200, 1200]; // width and height of max sized image element
let mainScale; // scale set by resizeCanvas based on canvas dimensions
const clockScale = 0.9; // size multiplier of the clock

/* Draw function that calls every draw tick */
function draw() {
  ctx.clearRect(
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width / 2,
    canvas.height / 2,
  );
  ctx.save();
  ctx.save();

  drawInCentre(img.background);
  drawInCentre(img.clockFace, clockScale);

  const [minRot, hourRot] = getRotation(new Date());

  ctx.rotate(minRot);
  drawInCentre(img.longLeg, clockScale);
  ctx.restore();

  ctx.rotate(hourRot);
  drawInCentre(img.shortLeg, clockScale);
  ctx.restore();

  drawInCentre(img.body, clockScale);
}

// draw image centered on the canvas
function drawInCentre(img, scale = 1) {
  ctx.drawImage(
    img,
    (-img.width * mainScale * scale) / 2,
    (-img.height * mainScale * scale) / 2,
    img.width * mainScale * scale,
    img.height * mainScale * scale,
  );
}

/* Resize canvas and set new scale to fit screen */
function resizeCanvas() {
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;

  mainScale = Math.min(
    canvas.width / baseScalePx[0],
    canvas.height / baseScalePx[1],
  );

  // move context to centre of canvas
  ctx.reset();
  ctx.translate(canvas.width / 2, canvas.height / 2);
}

/* Wait for all images to load */
const imagesToLoad = Object.values(img);
Promise.all(
  imagesToLoad.map(
    (img) =>
      new Promise((resolve) => {
        img.onload = resolve;
      }),
  ),
).then(() => {
  resizeCanvas();
  window.addEventListener("resize", () => {
    resizeCanvas();
    draw();
  });

  setInterval(draw, 200);
});
