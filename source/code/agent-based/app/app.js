// Import required modules
const amqp = require('amqplib/callback_api');
const express = require('express');
const bodyParser = require('body-parser');

// Set the RabbitMQ server address and queue name
const RABBITMQ_SERVER = 'amqp://localhost:5673';
const QUEUE_NAME = 'firetruck-hq';

// Create a new Express app and configure the body parser
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Log uncaught exceptions and unhandled promise rejections
function setUpErrorHandlers() {
	process.on('uncaughtException', (error) => {
		console.error('Uncaught exception: ', error);
	});

	process.on('unhandledRejection', (reason, promise) => {
		console.error('Unhandled rejection at ', promise, 'reason: ', reason);
	});
}

// Connect to RabbitMQ and set up a channel
function connectToRabbitMQ() {
	amqp.connect(RABBITMQ_SERVER, (error, connection) => {
		if (error) {
			console.error('Failed to connect to RabbitMQ. Retrying in 5 seconds...', error);
			return setTimeout(connectToRabbitMQ, 5000);
		}
		
		createChannel(connection);
	});
}

// Create a channel and set up a queue
function createChannel(connection) {
	connection.createChannel((error, channel) => {
		if (error) {
			console.error('Failed to create a channel. Retrying in 5 seconds...', error);
			return setTimeout(() => connectToRabbitMQ(connection), 5000);
		}
		
		setUpQueue(channel);
		setUpRoutes(channel);
	});
}

// Set up a queue
function setUpQueue(channel) {
	channel.assertQueue(QUEUE_NAME, { durable: false });
	console.log(`Connected to RabbitMQ App.js and queue ${QUEUE_NAME} is set up.`);
}

function determinePriority(body) {
	// Prioritize based on the source of the message
	if (body.source === 'importantClient' || body.source === 'criticalSystemComponent') {
		return 10; // high priority
	}
	// Prioritize based on the criticality of the message
	else if (body.type === 'emergency') {
		return 8; // high priority
	}
	else if (body.type === 'routine') {
		return 2; // low priority
	}
	else {
		return 5; // default medium priority
	}
}

// Define the route for sending and receiving messages
function setUpRoutes(channel) {
	app.post('/send', (req, res) => {
		const message = req.body.message;
		const priority = determinePriority(req.body); // new function to determine priority
		try {
			channel.sendToQueue(QUEUE_NAME, Buffer.from(message), { priority: priority }); // add priority when sending
			res.send(`Message sent: ${message}`);
		} catch (error) {
			console.error(`Failed to send message. Error: ${error}`);
			res.status(500).send(`Error occurred: ${error.message}`);
		}
	});

	app.get('/receive', (req, res) => {
		try {
			channel.consume(QUEUE_NAME, (message) => {
				res.send(message.content.toString());
			}, {
				noAck: true
			});
		} catch (error) {
			console.error(`Failed to receive message. Error: ${error}`);
			res.status(500).send(`Error occurred: ${error.message}`);
		}
	});
}

// Define the listening port for the Express app
const PORT = process.env.PORT || 3013;

// Run the app script
function runAppScript() {
	setUpErrorHandlers();
	connectToRabbitMQ();

	app.listen(PORT, () => {
		console.log(`Agent app is running on port ${PORT}`);
	});
}

// Start the app script
runAppScript();

module.exports = app;
