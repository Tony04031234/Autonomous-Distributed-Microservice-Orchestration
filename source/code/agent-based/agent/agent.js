// Import required modules
const amqp = require('amqplib/callback_api');
const request = require('request');

let channel;

// Set the agent ID from environment variable or default to 1
const AGENT_ID = process.env.AGENT_ID || 1;
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

// Connect to RabbitMQ and set up a queue for this agent
function connectToRabbitMQ() {
	amqp.connect(RABBITMQ_SERVER, (error, connection) => {
		if (error) {
			console.error('Failed to connect to RabbitMQ. Retrying in 5 seconds...', error);
			return setTimeout(connectToRabbitMQ, 5000);
		}
		createChannel(connection);
	});
}

// In the createChannel function, assign the created channel to the top level variable
function createChannel(connection) {
	connection.createChannel((error, ch) => {
		if (error) {
			console.error('Failed to create a channel. Retrying in 5 seconds...', error);
			return setTimeout(() => connectToRabbitMQ(connection), 5000);
		}
		// Assign the created channel to the top-level channel variable
		channel = ch;
		setUpQueue(channel);
	});
}

// Set up a queue for this agent
function setUpQueue(channel) {
	const queue = `agent_queue_${AGENT_ID}`;

	channel.assertQueue(queue, { durable: false, maxPriority: 10 }); // set maxPriority
	console.log(`Agent ${AGENT_ID} connected to RabbitMQ and queue ${queue} is set up.`);

	channel.consume(queue, handleMessage, { noAck: true });
}

// Handle incoming messages
function handleMessage(message) {
	console.log(`Agent ${AGENT_ID} received message: ${message.content.toString()}`);
	
	// Send acknowledgement back to HQ
	sendAcknowledgement(message.content.toString());
}


// Send an acknowledgement message back to HQ with a retry mechanism
function sendAcknowledgement(originalMessage, retryCount = 0) {
	try {
			const queue = 'hq_acknowledgements';
			const message = `Agent ${AGENT_ID} successfully processed message: ${originalMessage}`;

			channel.assertQueue(queue, { durable: false });
			channel.sendToQueue(queue, Buffer.from(message));
			console.log(`Sent acknowledgement to HQ: ${message}`);
	} catch (error) {
			console.error(`Failed to send acknowledgement. Error: ${error}`);
			if (retryCount < 3) {
					console.log(`Retrying send acknowledgement... Attempt ${retryCount + 1}`);
					setTimeout(() => sendAcknowledgement(originalMessage, retryCount + 1), 5000);
			} else {
					console.error(`Failed to send acknowledgement after 3 attempts. Giving up.`);
			}
	}
}

// Function to send a message
function sendMessage() {
	const payload = {
			source: 'agent',
			type: 'emergency',
			message: 'Emergency Message'
	};

	request.post('http://localhost:3010/send', {json: payload}, function(error, response, body){
			if(error) console.error("Failed to send message. Error: ", error);
	});
}

// Call sendMessage 
sendMessage();

// Run the agent script
function runAgentScript() {
	setUpErrorHandlers();
	connectToRabbitMQ();
}

// Start the agent script
runAgentScript();
