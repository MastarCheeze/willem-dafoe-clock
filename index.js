const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;

  scale = Math.min(
    canvas.height / clockFaceImg.height,
    canvas.width / clockFaceImg.width,
  );
}

const clockFaceImg = new Image();
clockFaceImg.src = "assets/clock-face.png";
const bodyImg = new Image();
bodyImg.src = "assets/dafoe-body.png";
const longLegImg = new Image();
longLegImg.src = "assets/dafoe-long-leg.png";
const shortLegImg = new Image();
shortLegImg.src = "assets/dafoe-short-leg.png";
let scale = 1;

function draw() {
  ctx.reset();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.save();
  ctx.save();

  ctx.drawImage(
    clockFaceImg,
    (-clockFaceImg.width * scale) / 2,
    (-clockFaceImg.height * scale) / 2,
    clockFaceImg.width * scale,
    clockFaceImg.height * scale,
  );

  const [minRot, hourRot] = getRot(new Date());

  ctx.rotate(minRot);
  ctx.drawImage(
    longLegImg,
    (-longLegImg.width * scale) / 2,
    (-longLegImg.height * scale) / 2,
    longLegImg.width * scale,
    longLegImg.height * scale,
  );
  ctx.restore();

  ctx.rotate(hourRot);
  ctx.drawImage(
    shortLegImg,
    (-shortLegImg.width * scale) / 2,
    (-shortLegImg.height * scale) / 2,
    shortLegImg.width * scale,
    shortLegImg.height * scale,
  );
  ctx.restore();

  ctx.drawImage(
    bodyImg,
    (-bodyImg.width * scale) / 2,
    (-bodyImg.height * scale) / 2,
    bodyImg.width * scale,
    bodyImg.height * scale,
  );
}

function getRot(date) {
  const minSecs = date.getMinutes() * 60 + date.getSeconds();
  const hourSecs = date.getHours() * 3600 + minSecs;

  return [
    (minSecs / 3600) * 2 * Math.PI,
    (hourSecs / (12 * 3600)) * 2 * Math.PI,
  ];
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);
window.addEventListener("resize", draw);

setInterval(draw, 100);
