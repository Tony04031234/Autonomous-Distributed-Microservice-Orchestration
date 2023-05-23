#!/usr/bin/env node

const axios = require('axios');
const readline = require('readline');

// Define the base URL for the API endpoints
const BASE_URL = 'http://5673:5672';

// Create a readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to send a message to the HQ
async function sendMessageToHQ(message) {
  try {
    const response = await axios.post(`${BASE_URL}/send`, { message });
    console.log(`Message sent to HQ: ${response.data}`);
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

// CLI
function showMenu() {
  console.log('1. Send message to HQ');
  console.log('2. Receive messages');
  console.log('0. Exit');
  rl.question('Select an option: ', (option) => {
    switch (option) {
      case '1':
        rl.question('Message: ', (message) => {
          sendMessageToHQ(message);
          showMenu();
        });
        break;
      case '2':
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
console.log('Fire Truck System Interface');
console.log('--------------------------');
showMenu();
