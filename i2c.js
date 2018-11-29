const i2c = require('i2c-bus')

const SENSOR_ADDR = 0x48

const LIGHT_SENSOR = 0x00
const FLOAT_SENSOR = 0x01
const THERMOMETER_SENSOR = 0x02
const POTENTIOMETER_SENSOR = 0x03



function startMonitoring(db){
    const conn = i2c.open(1, (err) => {
        if (err) throw err

        setInterval(() => {
            let data = conn.readByteSync(SENSOR_ADDR, LIGHT_SENSOR)
            console.log('LIGHT', data)
        }, 1000)
    })
}

module.exports = startMonitoring;