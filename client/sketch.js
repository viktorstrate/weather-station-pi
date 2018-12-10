const socket = io();

const flipPoint = x => 255 - x[0];

//canvas
var can;
var yMargin = 10;
var startSlider;
var startTime = 0;

var bars = [
  {
    title: "Light sensor",
    color: "red",
    data: []
  },
  {
    title: "Temperature sensor",
    color: "blue",
    data: []
  }
];

socket.on("light_sensor_start_values", data => {
  console.log("data from light", data);
  bars[0].data = data;
  draw();
});

socket.on("light_sensor_new_values", newData => {
  console.log("received new data from light", newData);
  bars[0].data = bars[0].data.concat(newData);
  draw();
});

socket.on("temp_sensor_start_values", data => {
  data = data.map(flipPoint);
  console.log("data from temp", data);
  bars[1].data = data;
  draw();
});

socket.on("temp_sensor_new_values", newData => {
  data = data.map(flipPoint);
  console.log("received new data from temp", newData);
  bars[1].data = bars[1].data.concat(newData);
  draw();
});

//runs once at program start
function setup() {
  can = createCanvas(800, 400);

  // Add bar labels to the right of the canvas
  const labelContainer = document.getElementById("bar-labels");
  for (let bar of bars) {
    let elm = createP(bar.title);
    elm.style("color", bar.color);
    elm.parent(labelContainer);
  }

  const settings = createElement("div");
  settings.id("settings");
  createSpan("Zoom:").parent(settings);

  startSlider = createSlider(0, 1, 0, 0.01);
  startSlider.parent(settings);
  startSlider.changed(() => {
    let data = bars[0].data;
    startTime = data[Math.floor(startSlider.value() * (data.length - 2))][0];
    draw();
  });

  // frameRate(1)
  noLoop(); // draw is manually called when new data should be rendered
}

//Infinite loop
function draw() {
  background(255);

  var maxMin = xMaxMin();
  var xmin = max(maxMin[0], startTime);
  var xmax = maxMin[1];

  drawTimestampLines(xmin, xmax);

  noFill();

  for (var graph of bars) {
    var array = graphAdjustment(graph.data, xmin, xmax);
    stroke(color(graph.color));
    beginShape();
    for (var item of array) {
      vertex(item[0], item[1]);
    }
    endShape();
  }
}

function graphAdjustment(arr, xmin, xmax) {
  var returnArray = new Array();
  var xAjust;

  var ymax = -1;
  var ymin = Infinity;
  var yAjust;

  for (var item of arr) {
    if (item[1] > ymax) {
      ymax = item[1];
    }
    if (item[1] < ymin) {
      ymin = item[1];
    }
  }
  xAjust = width / (xmax - xmin);
  yAjust = height / (ymax - ymin + yMargin * 2);

  for (var item of arr) {
    returnArray.push([
      (item[0] - xmin) * xAjust,
      (item[1] - ymin + yMargin) * yAjust * -1 + height
    ]);
  }
  return returnArray;
}

function xMaxMin() {
  var xmax = -1;
  var xmin = Infinity;
  for (var bar of bars) {
    for (var item of bar.data) {
      if (item[0] > xmax) {
        xmax = item[0];
      }
      if (item[0] < xmin) {
        xmin = item[0];
      }
    }
  }
  return [xmin, xmax];
}

function drawTimestampLines(min, max) {
  let distance = max - min;

  let distSecs = distance / 1000;
  let distDeciSecs = distSecs / 10;
  let distMins = distDeciSecs / 6;
  let distDeciMins = distMins / 10;
  let distHours = distDeciMins / 6;
  let distDays = distHours / 24;

  // interval in milliseconds, default to 1 sec
  let interval = 1000;

  if (distDeciSecs > 2) interval *= 10;
  if (distMins > 2) interval *= 6;
  if (distDeciMins > 2) interval *= 10;
  if (distHours > 2) interval *= 6;
  if (distDays > 2) interval *= 24;

  fill(100);
  strokeWeight(1);
  stroke(200);

  let time = 0;
  while (time < distance) {
    let x = map(time, 0, distance, 0, width);

    line(x, 0, x, height);
    let timestamp = new Date(min + time);
    if (distDays > 1 || time == 0) {
      timestamp = timestamp.toDateString();
    } else {
      timestamp = timestamp.toTimeString().split(" ")[0];
    }

    push(); // Rotate text 90˚
    translate(x + 4, 10);
    rotate(HALF_PI);
    text(timestamp, 0, 0);
    pop();

    time += interval;
  }
}
