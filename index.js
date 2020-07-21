'use strict';

const fs = require('fs');
const SerialPort = require('serialport');
const ByteLength = SerialPort.parsers.ByteLength;


class WriteSerialData {
    /**
     * Construct Write Serial Data class
     * @param {string} filename filename (relative to current path)
     * @param {number} interval interval in ms (default 1000ms)
     */
    constructor(filename, interval, maxdata) {
        this.interval = interval || 1000;
        this.logStream = fs.createWriteStream(filename, {
            'flags': 'a'
        })
        this.lastTime = 0;

        this.logStream.on('error',  (err) => {
            console.error('Error: ', err.message);
            process.exit(0)
        });
    }


    /**
     * Writes data to file
     * @param {string} data 
     */
    write(data) {
        const timeNow = (new Date()).getTime();

        if ((timeNow - this.lastTime) >= this.interval) {
            console.log(data) // debug received data

            this.lastTime = timeNow;
            const formatedData = this.formatData(data, timeNow);
            
            if (formatedData) {
                this.logStream.write(formatedData);
            } else {
                console.error("Error on received data!")
            }
        }
    }

    formatData(data, currentTime) {
        if (data.slice(-1) === '0') {
            return false // invalid data, last digit must be 1
        }

        const outputData = data.substring(0,2) + "," + data.substring(2,4);

        return this.convertTime(currentTime) + "; " + outputData + "\r\n";
    }

    /**
     * Convert Unix TimeStamp to hh:mm:ss
     * @param {number} epoch unix timestamp date
     * @returns {string} formatted time (hh:mm:ss)
     */
    convertTime(epoch) {
        return new Date(epoch).toISOString().slice(-13, -5);
    }

    endWrite() {
        this.logStream.end();
    }
}

const writeData = new WriteSerialData('log.csv', 1000);

const port = new SerialPort('COM4', {
    baudRate: 115200,
    dataBits: 8,
    lock: true, //disabled on windows
    parity: 'none',
    stopBits: 1,
    autoOpen: true
});

const parser = port.pipe(new ByteLength({
    length: 3
}));

port.pipe(parser);

SerialPort.list((err, ports) => {
    console.log("========= Serial ports info =========")
    ports.forEach((port) => {
        console.log(`Name: ${port.comName}`);
        console.log(`manufacturer: ${port.manufacturer}`);
        console.log(`S/N: ${port.serialNumber}`);
        console.log(`pnpId: ${port.pnpId}`);
        console.log("======================================")
    })
});


port.on('open', () => console.log('Port open'));

port.on('error', (err) => {
    console.error('Error: ', err.message);
    writeData.endWrite();
})

port.on('close', () => {
    console.log('Port closed')
    writeData.endWrite();
})

parser.on('data', (buff) => {
    writeData.write(buff.toString('hex'))
})