const socket = io()

//canvas
var can

var yMargin = 10

var dataArr = []

socket.on('light_sensor_start_values', data => {
  console.log('data', data)
  dataArr = data
})

socket.on('light_sensor_new_values', newData => {
  console.log('received new data', newData)
  dataArr = dataArr.concat(newData)
})

var xmin, ymin
var xAjust, yAjust

//runs once at program start
function setup() {
  can = createCanvas(800, 400)

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
<<<<<<< HEAD
=======

  for(var i = 0; i < arr.length; i++){
    if(arr[i][0] > xmax){
      xmax = arr[i][0]
    }
    if(dataArr[i][0] < xmin){
      xmin = arr[i][0]
    }
  }
  xAjust = width / (xmax - xmin)

>>>>>>> 543a520232755218e129a07359663e488d027048
  var ymax = -1
  var ymin = Infinity
  var yAjust

  for(var item of arr){
    if(item[0] > xmax){
      xmax = item[0]
    }
    if(item[0] < xmin){
      xmin = item[0]
    }
    
    if(item[1] > ymax){
      ymax = item[1]
    }
    if(item[1] < ymin){
      ymin = item[1]
    }
  }
  xAjust = width / (xmax - xmin)
  yAjust = height / (ymax - ymin + yMargin*2)

  for(var item of arr){
    returnArray.push( [((item[0] - xmin) * xAjust) * (-1) + width, ((item[1] - ymin + yMargin) * yAjust) * (-1) + height] )
  }
  return returnArray
}