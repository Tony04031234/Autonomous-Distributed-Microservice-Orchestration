const amqp = require('amqplib/callback_api');

const AGENT_ID = process.argv[2] || 1;

amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) {
    throw error0;
  }
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }
    console.log(`Agent ${AGENT_ID} connected to RabbitMQ`);

    channel.assertQueue(`agent_queue_${AGENT_ID}`, { durable: false });

    channel.consume(`agent_queue_${AGENT_ID}`, (message) => {
      console.log(`Agent ${AGENT_ID} received message: ${message.content.toString()}`);
    }, {
      noAck: true
    });
  });
});
