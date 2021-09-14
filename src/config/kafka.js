const { Kafka } = require('kafkajs')
const { kafkaConfig } = require("./config");

const kafka = new Kafka({
    clientId: 'hedis-results-api',
    brokers: [kafkaConfig.broker, 'broker:29092']
})

module.exports = {
    kafka
}