const socket = io()

//canvas
var can

var yMargin = 10

var dataArr = [[1000, 150], [1500, 300], [2000, 350]]

socket.on('light_sensor_start_values', data => {
  console.log('data', data)
  dataArr = data
})

socket.on('light_sensor_new_values', newData => {
  console.log('received new data', newData)
  dataArr.concat(newData)
})

var xmin, ymin
var xAjust, yAjust

//runs once at program start
function setup() {
  can = createCanvas(800, 400)

  //position canvas
  var canx = (windowWidth - width) / 2
  var cany = (windowHeight - height) / 2
  can.position(canx, cany)
}

//Infinite loop
function draw() {
  background(100)


  print(dataArr)
  graphAjustment()

  noFill()
  beginShape()
  for(var i = 0; i < dataArr.length; i++){
    vertex(((dataArr[i][0] - xmin) * xAjust) * (-1) + width, ((dataArr[i][1] - ymin + yMargin) * yAjust) * (-1) + height)
  }
  endShape()
  noLoop()
}


function graphAjustment(){
  //ajust x-axis
  var xmax = -1
  xmin = Infinity
  for(var i = 0; i < dataArr.length; i++){
    if(dataArr[i][0] > xmax){
      xmax = dataArr[i][0]
    }
    if(dataArr[i][0] < xmin){
      xmin = dataArr[i][0]
    }
  }
  xAjust = width / (xmax - xmin)

  //ajust y-axis
  var ymax = -1
  ymin = Infinity
  for(var i = 0; i < dataArr.length; i++){
    if(dataArr[i][1] > ymax){
      ymax = dataArr[i][1]
    }
    if(dataArr[i][1] < ymin){
      ymin = dataArr[i][1]
    }
  }
  yAjust = height / (ymax - ymin + yMargin*2)
}
