const amqp = require('amqplib/callback_api');

const EXCHANGE_NAME = 'emergency_direct_exchange';

const ROUTING_KEY = 'firetruck';

amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) {
    throw error0;
  }
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }
    channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: false });
    console.log("Connected to RabbitMQ");

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