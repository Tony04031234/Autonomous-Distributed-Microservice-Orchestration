const amqp = require('amqplib/callback_api');

const EXCHANGE_NAME = 'emergency_direct_exchange';

const ROUTING_KEYS = {
  firetruck: 'firetruck',
  ambulance: 'ambulance',
  police: 'police',
};

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
      console.log("Connected to RabbitMQ centralise hq");

      // Send a message to Firetruck
      const message = JSON.stringify({ type: 'backup', details: 'Backup on the way!' });
      channel.publish(EXCHANGE_NAME, ROUTING_KEYS.firetruck, Buffer.from(message));
      console.log("Sent message to Firetruck:", message);

      // Send a message to Ambulance
      const message2 = JSON.stringify({ type: 'backup', details: 'Backup on the way!' });
      channel.publish(EXCHANGE_NAME, ROUTING_KEYS.ambulance, Buffer.from(message2));
      console.log("Sent message to Ambulance:", message2);

      // Send a message to Police
      const message3 = JSON.stringify({ type: 'backup', details: 'Backup on the way!' });
      channel.publish(EXCHANGE_NAME, ROUTING_KEYS.police, Buffer.from(message3));
      console.log("Sent message to Police:", message3);

      // Receive a message from Firetruck
      channel.assertQueue('', { exclusive: true }, (error2, q) => {
        if (error2) {
          throw error2;
        }
        channel.bindQueue(q.queue, EXCHANGE_NAME, ROUTING_KEYS.firetruck);

        channel.consume(q.queue, (message) => {
          console.log("Received message from Firetruck:", message.content.toString());
        }, {
          noAck: true
        });
      });

      // Receive a message from Ambulance
      channel.assertQueue('', { exclusive: true }, (error2, q) => {
        if (error2) {
          throw error2;
        }
        channel.bindQueue(q.queue, EXCHANGE_NAME, ROUTING_KEYS.ambulance);

        channel.consume(q.queue, (message) => {
          console.log("Received message from Ambulance:", message.content.toString());
        }, {
          noAck: true
        });
      });

      // Receive a message from Police
      channel.assertQueue('', { exclusive: true }, (error2, q) => {
        if (error2) {
          throw error2;
        }
        channel.bindQueue(q.queue, EXCHANGE_NAME, ROUTING_KEYS.police);

        channel.consume(q.queue, (message) => {
          console.log("Received message from Police:", message.content.toString());
        }, {
          noAck: true
        });
      });

    });
  });
}

connectRabbitMQ();
/* 
In this implementation, the headquarter (hq.js) 
acts as the central coordinator, receiving messages from 
different microservices and making decisions based on the received information. 
It sends commands to fire trucks using routing keys (e.g., 'firetruck_routing_key').

The fire truck (firetruck.js) listens for commands from the HQ using the same routing key. 
Other emergency responders can be implemented similarly, with their routing keys to receive commands from the HQ.

This traditional microservices system uses direct exchanges in RabbitMQ for communication, 
allowing you to route messages to specific queues (emergency responders) based on routing keys. 
The headquarter coordinates the entire system and manages decision-making and resource allocation.
*/

/* 

what is lacking ? 


*/