const amqp = require('amqplib');

let connection = null;
let channel = null;
const RABBITMQ_SERVER = 'amqp://localhost:5673';

// Connect to RabbitMQ
async function connectToRabbitMQ() {
  try {
    connection = await amqp.connect(RABBITMQ_SERVER);
    channel = await connection.createChannel();

    process.on('exit', (code) => {
      console.log(`About to exit with code: ${code}`);
      if(channel) {
        channel.close();
        console.log('Closing rabbitmq channel');
      }
    });

    return channel;
  } catch (error) {
    console.log(`Failed to connect to RabbitMQ. Retrying in 5 seconds... Error: ${error}`);
    setTimeout(() => connectToRabbitMQ(), 5000);
  }
}

// Create a channel
function createChannel() {
  if (channel === null) {
    console.log('Cannot create channel. Connection to RabbitMQ not yet established');
  }
  return channel;
}

// Publish updates or information
async function publishUpdates(queue, message) {
  if (channel !== null) {
    await channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    console.log(`[x] Sent '${message}' to '${queue}'`);
  } else {
    console.log('Cannot publish updates. Connection to RabbitMQ not yet established');
  }
}

// Send a message to a specific agent
async function sendMessageToAgent(agentId, message) {
  const queue = `agent_queue_${agentId}`;
  await publishUpdates(queue, message);
}

// Set up a queue and consume it
function assertAndConsumeQueue(channel, queue, handleMessage) {
    channel.assertQueue(queue, { durable: false });
    channel.consume(queue, (msg) => handleMessage(msg), { noAck: true });
  }

module.exports = {
  connectToRabbitMQ,
  createChannel,
  publishUpdates,
  sendMessageToAgent,
  assertAndConsumeQueue
};
