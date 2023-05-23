
const axios = require('axios');
const readline = require('readline');

// Define the base URL for the API endpoints
const BASE_URL = 'http://5673:5672';

// Create a readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to send a message to an agent
async function sendMessageToAgent(agentId, message) {
  try {
    const response = await axios.post(`${BASE_URL}/send`, { agentId, message });
    console.log(`Message sent to Agent ${agentId}: ${response.data}`);
  } catch (error) {
    console.error('Failed to send message:', error.response.data);
  }
}

// Function to send a message to a fire truck
async function sendMessageToFireTruck(truckId, message) {
  try {
    const response = await axios.post(`${BASE_URL}/send`, { truckId, message });
    console.log(`Message sent to Fire Truck ${truckId}: ${response.data}`);
  } catch (error) {
    console.error('Failed to send message:', error.response.data);
  }
}

// Function to receive messages
async function receiveMessages() {
  try {
    const response = await axios.get(`${BASE_URL}/receive`);
    console.log('Received message:', response.data);
  } catch (error) {
    console.error('Failed to receive message:', error.response.data);
  }
}

// CLI Menu
function showMenu() {
  console.log('1. Send message to agent');
  console.log('2. Send message to fire truck');
  console.log('3. Receive messages');
  console.log('0. Exit');
  rl.question('Select an option: ', (option) => {
    switch (option) {
      case '1':
        rl.question('Agent ID: ', (agentId) => {
          rl.question('Message: ', (message) => {
            sendMessageToAgent(agentId, message);
            showMenu();
          });
        });
        break;
      case '2':
        rl.question('Fire Truck ID: ', (truckId) => {
          rl.question('Message: ', (message) => {
            sendMessageToFireTruck(truckId, message);
            showMenu();
          });
        });
        break;
      case '3':
        receiveMessages();
        showMenu();
        break;
      case '0':
        rl.close();
        break;
      default:
        console.log('Invalid option. Please try again.');
        showMenu();
        break;
    }
  });
}

// Start the CLI
console.log('HQ System Interface');
console.log('-------------------');
showMenu();