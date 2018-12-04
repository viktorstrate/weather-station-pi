const i2c = require('i2c-bus')

const SENSOR_ADDR = 0x48

const LIGHT_SENSOR = 0x00
const FLOAT_SENSOR = 0x01
const THERMOMETER_SENSOR = 0x02
const POTENTIOMETER_SENSOR = 0x03



function startMonitoring(db, io){
    const conn = i2c.open(1, (err) => {
        if (err) throw err

        setInterval(() => {
            let data = conn.readByteSync(SENSOR_ADDR, LIGHT_SENSOR)
            console.log('LIGHT', data)

            db.run('INSERT INTO light_sensor (value) VALUES (?)', data)

            io.emit('light_sensor_new_values', [[new Date().getTime(), data]])

        }, 1000 * 60)
    })
}

module.exports = startMonitoring;