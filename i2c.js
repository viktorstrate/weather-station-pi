const i2c = require('i2c-bus')

const SENSOR_ADDR = 0x48

const LIGHT_SENSOR = 0x00
const FLOAT_SENSOR = 0x01
const THERMOMETER_SENSOR = 0x02
const POTENTIOMETER_SENSOR = 0x03



function startMonitoring(db, io){
    const conn = i2c.open(1, (err) => {
        if (err) throw err

        let counter = 0
        let light_mesurements = []
        let temp_mesurements = []

        setInterval(() => {

            counter++

            // Light sensor
            try {
                let data = conn.readByteSync(SENSOR_ADDR, LIGHT_SENSOR)
                data = 255 - data
                light_mesurements.push(data)
            } catch (err) {
                console.log('Could not read from light sensor', err.message)
            }

            // Temperature sensor
            try {
                let data = conn.readByteSync(SENSOR_ADDR, THERMOMETER_SENSOR)
                temp_mesurements.push(data)
            } catch (err) {
                console.log('Could not read from temperatur sensor', err.message)
            }

            if (counter > 10) {
                counter = 0

                let avgLight = light_mesurements.reduce((prev, curr) => prev + curr, 0) / light_mesurements.length
                light_mesurements = []

                let avgTemp = temp_mesurements.reduce((prev, curr) => prev + curr, 0) / temp_mesurements.length
                temp_mesurements = []

                console.log('AVG LIGHT', avgLight)
                console.log('AVG TEMPERATURE', avgTemp)

                db.run('INSERT INTO light_sensor (value) VALUES (?)', avgLight)
                db.run('INSERT INTO temperature_sensor (value) VALUES (?)', avgTemp)

                io.emit('light_sensor_new_values', [[new Date().getTime(), avgLight]])
                io.emit('temp_sensor_new_values', [[new Date().getTime(), avgTemp]])
            }

        }, 1000)
    })
}

module.exports = startMonitoring;