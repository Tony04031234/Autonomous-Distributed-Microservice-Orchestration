const amqp = require('amqplib/callback_api');

const EXCHANGE_NAME = 'emergency_exchange';
const RABBITMQ_SERVER = 'amqp://rabbitmq:5673';

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
      console.log("Connected to RabbitMQ Firetruck ");

      // Subscribe to relevant topics
      channel.assertQueue('', { exclusive: true }, (error2, q) => {
        if (error2) {
          throw error2;
        }

        // Example of subscribing to topics relevant to a fire truck
        channel.bindQueue(q.queue, EXCHANGE_NAME, 'firetruck.*');
        channel.bindQueue(q.queue, EXCHANGE_NAME, 'emergency.*');

        channel.consume(q.queue, (message) => {
          console.log("Received message:", message.content.toString());
          const payload = JSON.parse(message.content.toString());

          // Process messages and make decisions based on local context
          // ...
        }, {
          noAck: true
        });
      });

      // Publish updates or information to other agents
      const update = { type: 'firetruck_status', status: 'active' };
      channel.publish(EXCHANGE_NAME, 'firetruck.status', Buffer.from(JSON.stringify(update)));
    });
  });
}

connectRabbitMQ();
