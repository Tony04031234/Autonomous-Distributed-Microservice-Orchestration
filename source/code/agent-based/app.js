// Import the required modules
const amqp = require('amqplib/callback_api');
const express = require('express');
const bodyParser = require('body-parser');

// Define the RabbitMQ server address and queue name
const RABBITMQ_SERVER = 'amqp://localhost';
const QUEUE_NAME = 'firetruck-hq';

// Create a new Express app and configure the body parser
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up a connection to RabbitMQ
amqp.connect(RABBITMQ_SERVER, (error0, connection) => {
  if (error0) {
    throw error0;
  }

  // Create a channel for communication
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }

    // Assert the queue for communication
    channel.assertQueue(QUEUE_NAME, {
      durable: false
    });

    // Define the route for sending messages
    app.post('/send', (req, res) => {
      const message = req.body.message;

      // Publish the message to the queue
      channel.sendToQueue(QUEUE_NAME, Buffer.from(message));

      // Send a response to the client
      res.send(`Message sent: ${message}`);
    });

    // Define the route for receiving messages
    app.get('/receive', (req, res) => {
      // Consume messages from the queue
      channel.consume(QUEUE_NAME, (message) => {
        // Send the message to the client
        res.send(message.content.toString());
      }, {
        noAck: true
      });
    });
  });
});
