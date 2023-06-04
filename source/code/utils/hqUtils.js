const { setUpErrorHandlers, assertAndConsumeQueue, publishUpdates, connectToRabbitMQ } = require('./rabbitmqUtils');

const EXCHANGE_NAME = 'emergency_exchange';

async function sendMessageToAgent(channel, agentId, message) {
    await channel.assertQueue(`agent_queue_${agentId}`, { durable: false });
    channel.sendToQueue(`agent_queue_${agentId}`, Buffer.from(message));
    console.log(`Sent message to agent ${agentId}: ${message}`);
}

async function sendMessagesToAllAgents(channel, AGENT_COUNT) {
    for (let i = 1; i <= AGENT_COUNT; i++) {
        await sendMessageToAgent(channel, i, `Task for agent ${i}`);
    }
}

module.exports = { setUpErrorHandlers, assertAndConsumeQueue, publishUpdates, connectToRabbitMQ, sendMessagesToAllAgents };
