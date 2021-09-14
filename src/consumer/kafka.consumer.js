const { Kafka } = require('kafkajs')
const kafka = require('../config/kafka')
const { kafkaConfig } = require("./config");
const paramValidation = require('../config/param-validation');
const measureCtrl = require('../controllers/measure.controller');

const consumer = kafka.consumer({ groupId: 'hedis-measures' })

await consumer.connect()

await consumer.subscribe({ topic: kafkaConfig.queue, fromBeginning: false })

await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
        if (message.value.isArray){
            measureCtrl.createBulk(message.value)
            console.log({
                value: message.value.toString(),
            })
        }
        else{
            measureCtrl.create(message.value)
            console.log({
                value: message.value.toString(),
            })
        }
    },
})