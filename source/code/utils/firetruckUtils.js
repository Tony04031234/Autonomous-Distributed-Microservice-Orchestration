
let channel = null;
const EXCHANGE_NAME = 'emergency_exchange';

async function publishUpdates(topic, message) {
    if (channel !== null) {
        channel.publish(EXCHANGE_NAME, topic, Buffer.from(JSON.stringify(message)));
        console.log(`[x] Sent '${JSON.stringify(message)}' to '${EXCHANGE_NAME}'`);
    } else {
        console.log('Cannot publish updates. Connection to RabbitMQ not yet established');
    }
}

module.exports = {
    publishUpdates
};
