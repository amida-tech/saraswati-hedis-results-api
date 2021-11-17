const { Kafka } = require('kafkajs')
const config = require("../config/config");
const paramValidation = require('../config/param-validation');
const measureCtrl = require('../controllers/measure.controller');

const kafka = new Kafka({
    clientId: 'cql-execution',
    brokers: [config.kafkaConfig.broker, 'broker:29093']
})

async function kafkaRunner() {
    const consumer = kafka.consumer({ groupId: 'hedis-measures' })

    await consumer.connect()

    await consumer.subscribe({ topic: config.kafkaConfig.queue, fromBeginning: false })
    console.log(">>>>>>>>>> Config");
    console.log(JSON.stringify(config));
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log(">>>>>>>>>> Hello, this is a message")
            if (message.value.isArray) {
                console.log(">>>>>>>>>>Trynna send an array value to the mongodb")
                measureCtrl.createBulk(message.value)
                console.log({
                    value: message.value.toString(),
                })
            }
            else {
                console.log(">>>>>>>>>> trynna send a non-array value to the mongodb")
                measureCtrl.create(message.value)
                console.log({
                    value: message.value.toString(),
                })
            }
        },
    })
}

module.exports = {kafkaRunner}