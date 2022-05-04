let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let lineWidth = document.getElementById("lineWidth");

let model = getModel();

let classMap = getMap();

ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);
let x,
  y,
  xd,
  yd = 0;
let isPressed = false;

canvas.addEventListener("mousemove", function (e) {
  move(e);
});

canvas.addEventListener("mousedown", function (e) {
  isPressed = true;
});

canvas.addEventListener("mouseup", function (e) {
  isPressed = false;
});

canvas.addEventListener("mouseout", function (e) {
  isPressed = false;
});

function move(e) {
  x = e.clientX - ctx.canvas.getBoundingClientRect().left;
  y = e.clientY - ctx.canvas.getBoundingClientRect().top;

  if (isPressed) {
    ctx.beginPath();

    ctx.lineWidth = lineWidth.value;
    ctx.lineCap = "round";
    ctx.strokeStyle = "white";

    ctx.moveTo(xd, yd);
    ctx.lineTo(x, y);

    ctx.stroke();
  }

  xd = x;
  yd = y;
}

function erase() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

async function getModel() {
  let m = await tf.loadLayersModel("./model/model.json");
  console.log("m arrived;");
  return m;
}

async function predict() {
  // gets image data

  model.then(
    function (res) {
      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let image = tf.browser.fromPixels(imageData);
      image = tf.image
        .resizeBilinear(image, [28, 28])
        .sum(2)
        .expandDims(0)
        .expandDims(-1);
      console.log(image);
      //tf.browser.toPixels(image, canvas);
      let pred = res.predict(image);
      document.getElementById("result").innerHTML =
        "I think you wrote " + classMap.get(Number(pred.argMax(1).dataSync())) + " in kuzushiji style.";
    },
    function (err) {
      console.log(err);
    }
  );

  // converts from a canvas data object to a tensor

  // pre-process image

  // gets model prediction

  // replaces the text in the result tag by the model prediction
  //document.getElementById('result').innerHTML = "Prediction: " + y.argMax(1).dataSync();
}

function getMap() {
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", "./class_map/k49_classmap.csv", true);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        var allText = rawFile.responseText;

        classMap = new Map();

        let splitText = allText.split("\n");

        splitText.shift();

        splitText.map((line) => {
          line = line.split(',');
          classMap.set(Number(line[0]), line[2]);
        });

        classMap.set(0, 'あ');

      }
    }
  };
  rawFile.send(null);
}
