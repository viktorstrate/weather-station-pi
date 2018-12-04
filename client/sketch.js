const socket = io()

//canvas
var can

var yMargin = 10

var lightSensorData = []
var tempSensorData = []

socket.on('light_sensor_start_values', data => {
  console.log('data from light', data)
  lightSensorData = data
})

socket.on('light_sensor_new_values', newData => {
  console.log('received new data from light', newData)
  lightSensorData = lightSensorData.concat(newData)
})

socket.on('temp_sensor_start_values', data => {
  console.log('data from temp', data)
  tempSensorData = data
})

socket.on('temp_sensor_new_values', newData => {
  console.log('received new data from temp', newData)
  tempSensorData = tempSensorData.concat(newData)
})

var bars

//runs once at program start
function setup() {
  can = createCanvas(800, 400)

  bars = [
    {
      title: 'Light sensor',
      color: color('red'),
      data: lightSensorData
    },{
      title: 'Temp sensor',
      color: color('blue'),
      data: tempSensorData
    }
  ]

  frameRate(1)
}

//Infinite loop
function draw() {
  background(100)

  noFill()
  for(var graph of bars){
    var array = graphAjustment(graph.data)
    stroke(graph.color)
    beginShape()
    for(var item of array){
      vertex(item[0], item[1])
    }
    endShape()
  }
  
}


function graphAjustment(arr){
  var returnArray = new Array()
  var xmax = -1
  var xmin = Infinity
  var xAjust

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
    returnArray.push( [((item[0] - xmin) * xAjust), ((item[1] - ymin + yMargin) * yAjust) * (-1) + height] )
  }
  return returnArray
}