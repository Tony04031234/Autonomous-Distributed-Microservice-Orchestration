# Agent-Based System for Emergency Services in Disconnected Environments

The Emergency Management System is designed to handle emergency situations in disconnected or degraded environments. It consists of two sub-systems: an agent-based system and a centralized system. This repository contains the system components and the testing process.

## Table of Contents

- [Agent-Based System for Emergency Services in Disconnected Environments](#agent-based-system-for-emergency-services-in-disconnected-environments)
  - [Table of Contents](#table-of-contents)
  - [System Components](#system-components)
    - [Agent-based system](#agent-based-system)
    - [Centralized system](#centralized-system)
  - [Testing Process](#testing-process)
    - [Test Setup and Scenarios](#test-setup-and-scenarios)
    - [Scenario Table](#scenario-table)
    - [Steps](#steps)
    - [Running test cases](#running-test-cases)
      - [1. Command: node scenarioTests.js](#1-command-node-scenariotestsjs)
      - [2. Result](#2-result)
      - [3. Analysis](#3-analysis)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Running the Tests](#running-the-tests)
  - [Modifying Test Scenarios](#modifying-test-scenarios)

## System Components

### Agent-based system

- `agent.js`: Receives messages based on agentID.
- `firetruck.js`: Represents a fire truck agent in the system.
- `hq.js`: Represents the headquarters agent in the system.
- `app.js`: Facilitates RabbitMQ connections between agents.

### Centralized system

- Similar structure to the agent-based system, but with a centralized approach for communication.
- `firetruck.js`: Represents a fire truck agent in the system.
- `hq.js`: Represents the headquarters agent in the system.
- `app.js`: Facilitates RabbitMQ connections between agents.

## Testing Process

### Test Setup and Scenarios

- `scenarioTests.js`: Contains the main testing script for running different emergency scenarios on both agent-based and centralized systems.
- `scenarios.json`: Contains a list of emergency scenarios, including the number of incidents, locations, and severity levels.
- `simulationRunner.js`: Runs the simulation for each scenario and collects performance metrics such as response time, resource utilization, and failure recovery time.

### Scenario Table

| Scenario       | Description                                       | Agent Failure | Server Failure | Network Latency | Response Time | Resource Availability | Workload |
| -------------- | ------------------------------------------------- | ------------- | -------------- | --------------- | ------------- | -------------------- | -------- |
| Small fire     | Fire spotted near downtown                        | false         | false          | 100             |               | 100                  | 1        |
| Large fire     | Large fire near the park                          | true          | false          | 300             |               | 80                   | 2        |
| Earthquake     | Earthquake detected, multiple incidents reported | false         | true           | 500             |               | 60                   | 5        |
| Flood          | Flood warning near the river                      | false         | true           | 200             |               | 100                  | 3        |
| Gas Leak       | Gas leak reported in residential area             | true          | false          | 400             |               | 70                   | 4        |
| Chemical Spill | Chemical spill at the industrial facility         | true          | true           | 600             |               | 50                   | 6        |


These scenarios can be customized based on the specific needs and the emergency response team.


### Steps

1. Define test scenarios in the `scenarios.json` file.
2. Implement the `runTestForAgentSystem()` and `runTestForCentralizedSystem()` functions in `scenarioTests.js`. These functions will use the existing functions from `test.js` to send messages to agents or fire trucks based on the input scenario.
3. Run the test scenarios using the `scenarioTests.js` script. This script will loop through the scenarios defined in `scenarios.json` and execute the tests for both agent-based and centralized systems.
4. Collect performance metrics for each scenario and system using the `simulationRunner.js` script. Metrics include response time, resource utilization, and failure recovery time.
5. Analyze the collected data and compare the performance of the agent-based system with the centralized system. Draw conclusions about the effectiveness of each system based on the metrics.

### Running test cases

#### 1. Command: node scenarioTests.js

#### 2. Result

Output example:

Running test for scenario 1: Small fire

Running test for scenario 2: Large fire

[Agent-based] Skipping agent 5678 due to failure.

Running test for scenario 3: Earthquake

[Agent-based] Skipping test due to server failure.

[Centralized] Skipping test due to server failure.

Running test for scenario 4: Flood

[Agent-based] Skipping test due to server failure.

[Centralized] Skipping test due to server failure.

Running test for scenario 5: Gas Leak

[Agent-based] Skipping agent 8462 due to failure.

Running test for scenario 6: Chemical Spill

[Agent-based] Skipping agent 9512 due to failure.

[Centralized] Skipping test due to server failure.

centralise based: Sent message "Fire spotted near downtown" to fire truck

Time elapsed: 0.5277500152587891 milliseconds

Agent based" Sent message "Fire spotted near downtown" to agent 1234

Time elapsed: 0.05645895004272461 milliseconds

centralise based: Sent message "Large fire near the park" to fire truck

Time elapsed: 0.28254103660583496 milliseconds

centralise based: Sent message "Gas leak reported in residential area" to fire truck

Time elapsed: 0.33116698265075684 milliseconds"

#### 3. Analysis

The scenarioTests.js script is running the tests and comparing the agent-based and centralized systems for each scenario in the scenarios.json file. The results are printed to the console, indicating whether a test was skipped due to agent failure, server failure, or if it was executed successfully. Additionally, the script shows the time elapsed for sending messages in both systems.

## Requirements

- Node.js
- RabbitMQ

## Installation

1. Clone the repository.
2. Install RabbitMQ server: [https://www.rabbitmq.com/download.html](https://www.rabbitmq.com/download.html)
3. Install Node.js: [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
4. Navigate to the project directory and run `npm install`.

## Running the Tests

1. Start the RabbitMQ server.
2. Run `node scenarioTests.js` to execute the test scenarios.

## Modifying Test Scenarios

You can modify the test scenarios by editing the `scenarios.json` file. This file contains an array of scenarios, each containing information such as the scenario name, messages, network latency, agent or server failures, and resource availability.

For example:

```json
{
  "id": 1,
  "name": "Small fire",
  "messages": [
    {
      "type": "agent",
      "content": "Fire spotted near downtown",
      "agentId": "1234"
    },
    {
      "type": "fireTruck",
      "content": "Fire spotted near downtown"
    }
  ],
  "agentFailure": false,
  "serverFailure": false,
  "networkLatency": 100,
  "resourceAvailability": 100,
  "workload": 1
}
