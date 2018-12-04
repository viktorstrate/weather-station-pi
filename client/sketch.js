const socket = io()

//canvas
var can

var yMargin = 10

var dataArr = [[1000, 150], [1500, 300], [2000, 350]]

socket.on('light_sensor_start_values', data => {
  console.log('data', data)
  dataArr = data
})

//runs once at program start
function setup() {
  can = createCanvas(800, 400)

  positioning()

  frameRate(1)
}

//Infinite loop
function draw() {
  background(100)

  noFill()
  var array = graphAjustment(dataArr)
  beginShape()
  for(var i = 0; i < array.length; i++){
    vertex(array[i][0], array[i][1])
  }
  endShape()
}


function graphAjustment(arr){
  var returnArray = new Array()
  var xmax = -1
  var xmin = Infinity
  var xAjust
  
  for(var i = 0; i < arr.length; i++){
    if(arr[i][0] > xmax){
      xmax = arr[i][0]
    }
    if(dataArr[i][0] < xmin){
      xmin = arr[i][0]
    }
  }
  xAjust = width / (xmax - xmin)

  var ymax = -1
  var ymin = Infinity
  var yAjust

  for(var i = 0; i < arr.length; i++){
    if(arr[i][1] > ymax){
      ymax = arr[i][1]
    }
    if(arr[i][1] < ymin){
      ymin = arr[i][1]
    }
  }
  yAjust = height / (ymax - ymin + yMargin*2)

  for(var item of arr){
    returnArray.push( [((item[0] - xmin) * xAjust) * (-1) + width, ((item[1] - ymin + yMargin) * yAjust) * (-1) + height] )
  }
  return returnArray
}

function positioning(){
  //position canvas
  var canx = (windowWidth - width) / 2
  var cany = (windowHeight - height) / 2
  can.position(canx, cany)
}