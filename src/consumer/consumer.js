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
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            if (message.value.isArray) {
                measureCtrl.createBulk(message.value)
            }
            else {
                measureCtrl.create(message.value)
            }
        },
    })
}

module.exports = {kafkaRunner}