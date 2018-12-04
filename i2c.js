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

        setInterval(() => {
            let data

            try {
                data = conn.readByteSync(SENSOR_ADDR, LIGHT_SENSOR)
                data = 255 - data
                light_mesurements.push(data)
                counter++
            } catch (err) {
                console.log('Could not read from light sensor', err.message)
            }

            if (counter > 10) {
                counter = 0

                let avgData = light_mesurements.reduce((prev, curr) => prev + curr, 0) / light_mesurements.length
                light_mesurements = []

                console.log('AVG LIGHT', avgData)

                db.run('INSERT INTO light_sensor (value) VALUES (?)', avgData)

                io.emit('light_sensor_new_values', [[new Date().getTime(), avgData]])
            }

        }, 1000)
    })
}

module.exports = startMonitoring;