const amqp = require('amqplib/callback_api');

const EXCHANGE_NAME = 'emergency_direct_exchange';
const ROUTING_KEY = 'firetruck';

function connectRabbitMQ() {
  amqp.connect('amqp://rabbitmq:5672', (error0, connection) => {
    if (error0) {
      console.error('Failed to connect to RabbitMQ. Retrying in 5 seconds...');
      return setTimeout(connectRabbitMQ, 5000);
    }

    connection.createChannel((error1, channel) => {
      if (error1) {
        throw error1;
      }
      channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: false });
      console.log("Connected to RabbitMQ - centralise firetruck.js");

      // Receive a message from HQ
      channel.assertQueue('firetruck_queue', { durable: false }, (error2, q) => {
        if (error2) {
          throw error2;
        }
        channel.bindQueue(q.queue, EXCHANGE_NAME, ROUTING_KEY);
        channel.consume(q.queue, (message) => {
          console.log("Received message:", message.content.toString());
          // const command = JSON.parse(message.content.toString());
          // Process the received command from HQ
        }, {
          noAck: true
        });
      });
    });
  });
}

connectRabbitMQ();
