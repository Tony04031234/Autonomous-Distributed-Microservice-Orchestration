const amqp = require('amqplib/callback_api');

const AGENT_COUNT = 3;
const EXCHANGE_NAME = 'emergency_exchange';
const RABBITMQ_SERVER = 'amqp://rabbitmq:5672';

function connectRabbitMQ() {
  amqp.connect(RABBITMQ_SERVER, (error0, connection) => {
    if (error0) {
      console.error('Failed to connect to RabbitMQ. Retrying in 5 seconds...');
      return setTimeout(connectRabbitMQ, 5000);
    }

    connection.createChannel((error1, channel) => {
      if (error1) {
        throw error1;
      }

      channel.assertExchange(EXCHANGE_NAME, 'fanout', { durable: false });
      console.log("Connected to RabbitMQ HQ");

      // Subscribe to relevant topics
      channel.assertQueue('', { exclusive: true }, (error2, q) => {
        if (error2) {
          throw error2;
        }

        // Example of subscribing to topics relevant to the HQ
        channel.bindQueue(q.queue, EXCHANGE_NAME, 'firetruck.*');
        channel.bindQueue(q.queue, EXCHANGE_NAME, 'emergency.*');

        channel.consume(q.queue, (message) => {
          console.log("Received message:", message.content.toString());
          const payload = JSON.parse(message.content.toString());

          // Process messages and provide support based on local context
          // ...
        }, {
          noAck: true
        });
      });

      // Publish updates or information to other agents
      const update = { type: 'hq_announcement', message: 'Stay alert and follow instructions!' };
      channel.publish(EXCHANGE_NAME, 'emergency.announcement', Buffer.from(JSON.stringify(update)));

      // Send a message to a specific agent
      const sendMessageToAgent = (agentId, message) => {
        channel.assertQueue(`agent_queue_${agentId}`, { durable: false });
        channel.sendToQueue(`agent_queue_${agentId}`, Buffer.from(message));
        console.log(`Sent message to agent ${agentId}: ${message}`);
      };

      // Send messages to all agents
      for (let i = 1; i <= AGENT_COUNT; i++) {
        sendMessageToAgent(i, `Task for agent ${i}`);
      }
    });
  });
}

connectRabbitMQ();
