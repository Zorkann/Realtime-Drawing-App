const socket = io.connect("http://localhost:3000");

let imgUrl;

socket.on("connect", async () => {
  console.log("connect");
  const response = await fetch("http://localhost:3000/init");
  const resp = await response.json();
  imgUrl = resp.canvas;

  new p5(sketch, "drawing");
});

const sketch = function (p) {
  let color = "#000";
  let strokeWidth = 4;
  let img;
  let firstInit = true;

  socket.on("mouse", (data) => {
    p.stroke(data.color);
    p.strokeWeight(data.strokeWidth);
    p.line(data.x, data.y, data.px, data.py);
  });

  p.setup = function () {
    p.createCanvas(500, 500);
    img = p.loadImage(imgUrl);
  };

  p.draw = function () {
    if (img && firstInit) {
      p.image(img, 0, 0, 500, 500);
      firstInit = false;
    }
  };

  p.mouseDragged = function () {
    p.stroke(color);
    p.strokeWeight(strokeWidth);
    p.line(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY);
    sendmouse(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY);
  };

  p.mouseReleased = function () {
    const canvas = document.getElementById("defaultCanvas0");
    const data = canvas.toDataURL();
    socket.emit("saveCanvas", data);
  };

  sendmouse = function (x, y, pX, pY) {
    const data = {
      x: x,
      y: y,
      px: pX,
      py: pY,
      color: color,
      strokeWidth: strokeWidth,
    };
    socket.emit("mouse", data);
  };
};
