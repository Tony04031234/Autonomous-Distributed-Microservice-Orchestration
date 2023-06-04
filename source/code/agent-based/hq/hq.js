// Import required modules
const amqp = require('amqplib/callback_api');

// Define constants
const AGENT_COUNT = 3;
const EXCHANGE_NAME = 'emergency_exchange';
const RABBITMQ_SERVER = 'amqp://localhost:5673';

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

// Create a channel and set up an exchange
function createChannel(connection) {
	connection.createChannel((error, channel) => {
		if (error) {
			console.error('Failed to create a channel. Retrying in 5 seconds...', error);
			return setTimeout(() => connectToRabbitMQ(connection), 5000);
		}

		setUpExchange(channel);
		subscribeToTopics(channel);
		publishUpdates(channel);
		sendMessagesToAllAgents(channel);
		subscribeToAcknowledgements(channel); // Subscribe to acknowledgements here
	});
}

// Set up an exchange
function setUpExchange(channel) {
	channel.assertExchange(EXCHANGE_NAME, 'fanout', { durable: false });
	console.log(`Connected to RabbitMQ HQ and exchange ${EXCHANGE_NAME} is set up.`);
}

// Subscribe to relevant topics
function subscribeToTopics(channel) {
	channel.assertQueue('', { exclusive: true }, (error, q) => {
		if (error) {
			throw error;
		}

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
}

// Publish updates or information to other agents
function publishUpdates(channel) {
	const update = { type: 'hq_announcement', message: 'Stay alert and follow instructions!' };
	channel.publish(EXCHANGE_NAME, 'emergency.announcement', Buffer.from(JSON.stringify(update)));
}

// Send messages to all agents
function sendMessagesToAllAgents(channel) {
	for (let i = 1; i <= AGENT_COUNT; i++) {
			sendMessageToAgent(channel, i, `Task for agent ${i}`);
	}
}

// Send a message to a specific agent with a retry mechanism
function sendMessageToAgent(channel, agentId, message, retryCount = 0) {
	try {
			channel.assertQueue(`agent_queue_${agentId}`, { durable: false });
			channel.sendToQueue(`agent_queue_${agentId}`, Buffer.from(message));
			console.log(`Sent message to agent ${agentId}: ${message}`);
	} catch (error) {
			console.error(`Failed to send message to agent ${agentId}. Error: ${error}`);
			if (retryCount < 3) {
					console.log(`Retrying send message to agent ${agentId}... Attempt ${retryCount + 1}`);
					setTimeout(() => sendMessageToAgent(channel, agentId, message, retryCount + 1), 5000);
			} else {
					console.error(`Failed to send message to agent ${agentId} after 3 attempts. Giving up.`);
			}
	}
}

// Subscribe to agent acknowledgements
function subscribeToAcknowledgements(channel) {
	const queue = 'hq_acknowledgements';

	channel.assertQueue(queue, { durable: false });
	channel.consume(queue, handleAcknowledgement, { noAck: true });
}

// Handle incoming acknowledgements
function handleAcknowledgement(message) {
	console.log(`Received acknowledgement: ${message.content.toString()}`);
}

// Run the HQ script
function runHQScript() {
	setUpErrorHandlers();
	connectToRabbitMQ();
}

// Start the HQ script
runHQScript();
