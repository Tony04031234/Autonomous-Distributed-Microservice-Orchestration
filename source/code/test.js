const amqp = require('amqplib/callback_api');
const { performance } = require('perf_hooks');

const EXCHANGE_NAME = 'emergency_direct_exchange';

const args = process.argv.slice(2);

//1 Agent-based approach - network - communication protocol 
function sendMessageToAgent(message, agentId) {
    return new Promise((resolve, reject) => {
        amqp.connect('amqp://5672:5672', (error0, connection) => {
            if (error0) {
                throw error0;
            }
            connection.createChannel((error1, channel) => {
                if (error1) {
                    throw error1;
                }
                channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: false });
                const routingKey = `agent.${agentId}`;
                const start = performance.now();
                channel.publish('emergency_exchange', routingKey, Buffer.from(message));
                console.log(`Agent based" Sent message "${message}" to agent ${agentId}`);
                const end = performance.now();
                console.log(`Time elapsed: ${end - start} milliseconds`);
                setTimeout(async () => {
                    connection.close();
                    resolve();
                }, 500);
            });
        });
    })
}

//2 Test sending a message from a fire truck to the HQ using the agent-based system
function sendFireTruckMessageToHQ(message, agentId) {
    return new Promise((resolve, reject) => {
        amqp.connect('amqp://localhost:5672', (error0, connection) => {
            if (error0) {
                throw error0;
            }
            connection.createChannel((error1, channel) => {
                if (error1) {
                    throw error1;
                }
                const start = performance.now();
                channel.assertQueue(`agent.${agentId}`, { durable: false });
                channel.consume(`agent.${agentId}`, (msg) => {
                    console.log(`Received message "${msg.content.toString()}" from fire truck`);
                    const end = performance.now();
                    console.log(`Time elapsed: ${end - start} milliseconds`);
                    setTimeout(async () => {
                        connection.close();
                        resolve();
                    }, 500);
                }, { noAck: true });
                channel.sendToQueue(`agent.${agentId}`, Buffer.from(message));
                console.log(`Sent message "${message}" from fire truck`);
            });
        });
    })
}

// Test sending message to multiple agents
function sendMessagesToAgents(message, agentIds) {
    agentIds.forEach(agentId => sendMessageToAgent(message, agentId));
}
sendMessagesToAgents('Fire spotted near downtown', ['1234', '5678', '91011']);

// Test sending message to multiple fire trucks
function sendMessagesToFireTrucks(message, truckIds) {
    truckIds.forEach(truckId => sendMessageToFireTruck(`${message} (truck ${truckId})`));
}
sendMessagesToFireTrucks('Fire spotted near downtown', [1, 2, 3]);

// Test sending message to both agents and fire trucks
function sendEmergencyMessage(message, agentIds, truckIds) {
    sendMessagesToAgents(message, agentIds);
    sendMessagesToFireTrucks(message, truckIds);
}
sendEmergencyMessage('Fire spotted near downtown', ['1234', '5678'], [1, 2]);

//3 Centralized  approach - network - communication protocol 
function sendMessageToFireTruck(message) {
    return new Promise((resolve, reject) => {
        amqp.connect('amqp://localhost:5672', (error0, connection) => {
            if (error0) {
                throw error0;
            }
            connection.createChannel((error1, channel) => {
                if (error1) {
                    throw error1;
                }
                channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: false });
                const routingKey = 'firetruck.1';
                const start = performance.now();
                channel.publish('emergency_exchange', routingKey, Buffer.from(message));
                console.log(`centralise based: Sent message "${message}" to fire truck`);
                const end = performance.now();
                console.log(`Time elapsed: ${end - start} milliseconds`);
                setTimeout(async () => {
                    connection.close();
                    resolve();
                }, 500);
            });
        });
    })
}

//4 Test sending a message to multiple fire trucks using the centralized system
function sendMessageToMultipleFireTrucks(message, numTrucks) {
    return new Promise((resolve, reject) => {
        amqp.connect('amqp://localhost:5672', (error0, connection) => {
            if (error0) {
                throw error0;
            }
            connection.createChannel((error1, channel) => {
                if (error1) {
                    throw error1;
                }
                channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: false });
                const start = performance.now();
                for (let i = 1; i <= numTrucks; i++) {
                    const routingKey = `firetruck.${i}`;
                    channel.publish('emergency_exchange', routingKey, Buffer.from(message));
                    console.log(`Sent message "${message} (truck ${i})" to fire truck`);
                }
                const end = performance.now();
                console.log(`Time elapsed: ${end - start} milliseconds`);
                setTimeout(async () => {
                    connection.close();
                    resolve();
                }, 500);
            });
        });
    })
}




//5 Test sending a message from a fire truck to the HQ using the centralized system
function sendFireTruckMessageToHQCentralized(message, truckId) {
    return new Promise((resolve, reject) => {
        amqp.connect('amqp://localhost:5672', (error0, connection) => {
            if (error0) {
                throw error0;
            }
            connection.createChannel((error1, channel) => {
                if (error1) {
                    throw error1;
                }
                const start = performance.now();
                const routingKey = `firetruck.${truckId}`;
                channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: false });
                channel.publish('emergency_exchange', routingKey, Buffer.from(message));
                console.log(`Sent message "${message}" from fire truck ${truckId} to HQ`);
                channel.assertQueue('', { exclusive: true }, (error2, q) => {
                    if (error2) {
                        throw error2;
                    }
                    channel.bindQueue(q.queue, EXCHANGE_NAME, routingKey);
                    channel.consume(
                        q.queue,
                        (msg) => {
                            const end = performance.now();
                            console.log(
                                `Time elapsed for fire truck ${truckId} to receive message: ${end - start} milliseconds`
                            );
                            console.log(`Received response from HQ: ${msg.content.toString()}`);
                            setTimeout(async () => {
                                connection.close();
                                resolve();
                            }, 500);
                        },
                        { noAck: false }
                    );
                });
            });
        });
    })
}

//6 Simulate network congestion
const NUM_MESSAGES = 100;
const MESSAGE = 'Fire spotted near downtown';

// Agent-based approach
function testAgentCongestion() {
    return new Promise((resolve, reject) => {
        amqp.connect('amqp://localhost:5672', (error0, connection) => {
            if (error0) {
                throw error0;
            }
            connection.createChannel((error1, channel) => {
                if (error1) {
                    throw error1;
                }
                channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: false });
                for (let i = 0; i < NUM_MESSAGES; i++) {
                    const routingKey = `agent.${i}`;
                    const start = performance.now();
                    channel.publish('emergency_exchange', routingKey, Buffer.from(MESSAGE));
                    const end = performance.now();
                    console.log(`Sent message "${MESSAGE}" to agent ${i}. Time elapsed: ${end - start} milliseconds`);
                }
                setTimeout(async () => {
                    connection.close();
                    resolve();
                }, 500);
            });
        });
    })
}

//7 Centralized microservices approach
function testCentralizedCongestion() {
    return new Promise((resolve, reject) => {
        amqp.connect('amqp://localhost:5672', (error0, connection) => {
            if (error0) {
                throw error0;
            }
            connection.createChannel((error1, channel) => {
                if (error1) {
                    throw error1;
                }
                channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: false });
                for (let i = 0; i < NUM_MESSAGES; i++) {
                    const routingKey = `firetruck.${i % 3 + 1}`;
                    const start = performance.now();
                    channel.publish('emergency_exchange', routingKey, Buffer.from(`${MESSAGE} (truck ${i % 3 + 1})`));
                    const end = performance.now();
                    console.log(`Sent message "${MESSAGE} (truck ${i % 3 + 1})" to fire truck. Time elapsed: ${end - start} milliseconds`);
                }
                setTimeout(async () => {
                    connection.close();
                    resolve();
                }, 500);
            });
        });
    })
}

//8 Test fault tolerance in agent-based approach
function testAgentFaultTolerance() {
    return new Promise((resolve, reject) => {
        amqp.connect('amqp://localhost:5672', (error0, connection) => {
            if (error0) {
                throw error0;
            }
            connection.createChannel((error1, channel) => {
                if (error1) {
                    throw error1;
                }
                channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: false });
                const originalAgentId = '1234';
                const backupAgentId = '5678';
                const routingKey = `agent.${originalAgentId}`;
                channel.assertQueue(`agent.${backupAgentId}`, { durable: false });
                channel.bindQueue(`agent.${backupAgentId}`, EXCHANGE_NAME, routingKey);
                // Simulate a failure in the original agent by deleting its queue
                channel.deleteQueue(`agent.${originalAgentId}`);
                const message = 'Fire spotted near downtown';
                const start = performance.now();
                channel.publish('emergency_exchange', routingKey, Buffer.from(message));
                console.log(`Sent message "${message}" to agent ${originalAgentId}`);
                // Wait for the message to be processed by the backup agent
                setTimeout(async () => {
                    const end = performance.now();
                    console.log(`Time elapsed: ${end - start} milliseconds`);
                    connection.close();
                    resolve();
                }, 500);
            });
        });
    })
}

async function runAllTests() {
    console.log("Running sendMessageToAgent...");
    await sendMessageToAgent("Fire spotted near downtown", "1234");

    console.log("Running sendMessageToFireTruck...");
    await sendMessageToFireTruck("Fire spotted near downtown");

    console.log("Running sendMessagesToAgents...");
    await sendMessagesToAgents("Fire spotted near downtown", ["1234", "5678", "91011"]);

    console.log("Running sendMessagesToFireTrucks...");
    await sendMessageToMultipleFireTrucks("Fire spotted near downtown", [1, 2, 3]);

    console.log("Running sendEmergencyMessage...");
    await sendEmergencyMessage("Fire spotted near downtown", ["1234", "5678"], [1, 2]);

    console.log("Running sendMessageToMultipleFireTrucks...");
    await sendMessageToMultipleFireTrucks("Fire spotted near downtown", 3);

    console.log("Running sendFireTruckMessageToHQ...");
    await sendFireTruckMessageToHQ("Fire under control, requesting backup", "1234");

    console.log("Running sendFireTruckMessageToHQCentralized...");
    await sendFireTruckMessageToHQCentralized("Fire spotted near downtown", "1");

    console.log("Running testAgentCongestion...");
    await testAgentCongestion();

    console.log("Running testCentralizedCongestion...");
    await testCentralizedCongestion();

    console.log("Running testAgentFaultTolerance...");
    await testAgentFaultTolerance();

    console.log("All tests completed.");
    process.exit(0);
}

if (args[0]) {
    switch (args[0]) {
        case "--sendMessageToAgent":
            sendMessageToAgent("Fire spotted near downtown", "1234");
            break;
        case "--sendMessageToFireTruck":
            sendMessageToFireTruck("Fire spotted near downtown");
            break;
        case "--sendMessagesToAgents":
            sendMessagesToAgents("Fire spotted near downtown", ["1234", "5678", "91011"]);
            break;
        case "--sendMessagesToFireTrucks":
            sendMessagesToFireTrucks("Fire spotted near downtown", [1, 2, 3]);
            break;
        case "--sendEmergencyMessage":
            sendEmergencyMessage("Fire spotted near downtown", ["1234", "5678"], [1, 2]);
            break;
        case "--sendMessageToMultipleFireTrucks":
            sendMessageToMultipleFireTrucks("Fire spotted near downtown", 3);
            break;
        case "--sendFireTruckMessageToHQ":
            sendFireTruckMessageToHQ("Fire under control, requesting backup", "1234");
            break;
        case "--sendFireTruckMessageToHQCentralized":
            sendFireTruckMessageToHQCentralized("Fire spotted near downtown", "1");
            break;
        case "--testAgentCongestion":
            testAgentCongestion();
            break;
        case "--testCentralizedCongestion":
            testCentralizedCongestion();
            break;
        case "--testAgentFaultTolerance":
            testAgentFaultTolerance();
            break;
        case "--runAllTests":
            runAllTests();
            break;
        default:
            console.log("Invalid argument provided.");
    }
} else {
    console.log("No arguments provided.");
}

module.exports = {
    sendMessageToAgent,
    sendMessageToFireTruck,
    sendMessageToMultipleFireTrucks,
    sendEmergencyMessage,
    sendEmergencyMessage,
    sendMessageToMultipleFireTrucks,
    sendFireTruckMessageToHQ,
    sendFireTruckMessageToHQCentralized,
    testAgentCongestion,
    testCentralizedCongestion,
    testAgentFaultTolerance
};

/*
sendMessageToAgent: Sends a message to an agent using the agent-based approach.
sendMessageToFireTruck: Sends a message to a fire truck using the centralized approach.
sendMessagesToAgents: Sends a message to multiple agents using the agent-based approach.
sendMessagesToFireTrucks: Sends a message to multiple fire trucks using the centralized approach.
sendEmergencyMessage: Sends a message to both agents and fire trucks.
sendMessageToMultipleFireTrucks: Sends a message to multiple fire trucks using the centralized system.
sendFireTruckMessageToHQ: Sends a message from a fire truck to the HQ using the agent-based system.
sendFireTruckMessageToHQCentralized: Sends a message from a fire truck to the HQ using the centralized system.
testAgentCongestion: Tests network congestion for the agent-based approach.
testCentralizedCongestion: Tests network congestion for the centralized  approach.
testAgentFaultTolerance: Tests fault tolerance in the agent-based approach.
*/