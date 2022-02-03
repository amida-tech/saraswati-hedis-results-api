const { Kafka } = require('kafkajs')
const config = require("../config/config");
const paramValidation = require('../config/param-validation');

const {
    insertMeasure, insertMeasures,
  } = require('../config/db');

const kafka = new Kafka({
    clientId: 'cql-execution',
    brokers: config.kafkaConfig.brokers
})

console.log('Running now...');
async function kafkaRunner() {
    const consumer = kafka.consumer({ groupId: config.kafkaConfig.queue })

    await consumer.connect()
    
    await consumer.subscribe({ topic: config.kafkaConfig.queue, fromBeginning: false })
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log('Message received.');
            var jsonObject = JSON.parse(message.value.toString())
            console.log(message.value.toString());
            if (jsonObject !== undefined && Array.isArray(jsonObject)) {
                insertMeasures(jsonObject);
            }
            else {
                insertMeasure(jsonObject);
            }
        },
    })
}

module.exports = {kafkaRunner}