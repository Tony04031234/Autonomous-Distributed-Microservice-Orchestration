// Import required modules
const amqp = require('amqplib/callback_api');

// Set the RabbitMQ server address and exchange name
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
	});
}

// Set up an exchange
function setUpExchange(channel) {
	try {
		channel.assertExchange(EXCHANGE_NAME, 'fanout', { durable: false, maxPriority: 10 }); // set maxPriority
		console.log(`Connected to RabbitMQ Truck.js and exchange ${EXCHANGE_NAME} is set up.`);
	} catch (error) {
		console.error('Failed to set up an exchange:', error);
	}
}

// Subscribe to relevant topics
function subscribeToTopics(channel) {
	try {
		channel.assertQueue('', { exclusive: true }, (error, q) => {
			if (error) {
				throw error;
			}

			channel.bindQueue(q.queue, EXCHANGE_NAME, 'firetruck.*');
			channel.bindQueue(q.queue, EXCHANGE_NAME, 'emergency.*');

			channel.consume(q.queue, (message) => {
				console.log("Received message:", message.content.toString());
				const payload = JSON.parse(message.content.toString());
				//check on the message type
				switch (payload.type) {
					case 'emergency':
							// Handle emergencies here
							console.log('Emergency message received:', payload.message);
							// additional actions like alerting agents, dispatching help, etc.
							break;
					case 'status_update':
							// Handle status updates here
							console.log('Status update received:', payload.status);
							// additional actions like updating agent status in the system, etc.
							break;
					default:
							console.log('Unknown message type received', payload);
							break;
			}
			}, {
				noAck: true
			});
		});
	} catch (error) {
		console.error('Failed to subscribe to topics:', error);
	}
}

// Publish updates or information to other agents
function publishUpdates(channel) {
	try {
		const update = { type: 'firetruck_status', status: 'active' };
		channel.publish(EXCHANGE_NAME, 'firetruck.status', Buffer.from(JSON.stringify(update)));
	} catch (error) {
		console.error('Failed to publish updates:', error);
	}
}

// Run the truck script
function runTruckScript() {
	setUpErrorHandlers();
	connectToRabbitMQ();
}

// Start the truck script
runTruckScript();
