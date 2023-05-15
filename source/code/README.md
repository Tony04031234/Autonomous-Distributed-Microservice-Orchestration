# Agent-Based System for Emergency Services in Disconnected Environments

The Emergency Management System is designed to handle emergency situations in disconnected or degraded environments. It consists of two sub-systems: an agent-based system and a centralized system. This repository contains the system components and the testing process.

## Table of Contents

- [Agent-Based System for Emergency Services in Disconnected Environments](#agent-based-system-for-emergency-services-in-disconnected-environments)
  - [Table of Contents](#table-of-contents)
  - [System Components](#system-components)
    - [Agent-based system](#agent-based-system)
    - [Centralized system](#centralized-system)
  - [Architecture Overview](#architecture-overview)
    - [Communication Flow](#communication-flow)
    - [Separation of Concerns](#separation-of-concerns)
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
  - [Docker Setup](#docker-setup)
    - [Installation](#installation-1)
    - [Building Docker Images](#building-docker-images)
  - [Kubernetes Setup](#kubernetes-setup)
  - [Installation](#installation-2)
    - [Deploying Applications](#deploying-applications)
  - [Chaos Mesh](#chaos-mesh)
    - [Installing Chaos Mesh](#installing-chaos-mesh)
    - [Creating Chaos Experiments](#creating-chaos-experiments)
    - [Monitoring Chaos Experiments](#monitoring-chaos-experiments)
    - [Uninstalling Chaos Mesh](#uninstalling-chaos-mesh)

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

## Architecture Overview

This application consists of the following components, all of which are containerized using Docker and orchestrated using Kubernetes:

- Client (Web Browser or API client)
- Express Server (API)
- RabbitMQ Server (Message Broker)
- Chaos Mesh (Chaos Testing)

### Communication Flow

The communication flow between the components is as follows:

1. **Client -> Express Server:** The client sends an HTTP request (GET or POST) to the Express Server.
2. **Express Server -> RabbitMQ Server:** Based on the received HTTP request, the Express Server sends or receives messages from the RabbitMQ server using the appropriate queue or exchange.
3. **RabbitMQ Server -> Other Components (Firetruck, Ambulance, Police, etc.):** RabbitMQ is responsible for passing messages between different components in your application. It ensures that messages are routed to the correct recipients and handles message persistence and delivery guarantees.
4. **Chaos Mesh:** Used to introduce chaos into the system to test its resilience and reliability. It could target any of the above components with different types of failures.

### Separation of Concerns

The separation of concerns is evident in this setup:

- The **Express Server** is only responsible for handling incoming and outgoing HTTP requests.
- The **RabbitMQ Server** is in charge of message passing and coordination among the components of the application.
- **Docker** is used to package each component of the application into a separate container, ensuring that each component has its own isolated environment with all the dependencies it needs to run.
- **Kubernetes** is responsible for managing these containers, handling tasks like load balancing, network traffic distribution, and scaling the application as needed.
- **Chaos Mesh** introduces chaos into the system, allowing you to test how well the application can handle unexpected failures or disruptions.

This allows each component to focus on its specific role, making the application more modular, maintainable, and resilient. Each component is packaged into a Docker container and managed by Kubernetes, ensuring that the application can scale and recover from failures. At the same time, Chaos Mesh helps to ensure that the application is ready to handle real-world disruptions.

## Testing Process

### Test Setup and Scenarios

- `scenarioTests.js`: Contains the main testing script for running different emergency scenarios on both agent-based and centralized systems.
- `scenarios.json`: Contains a list of emergency scenarios, including the number of incidents, locations, and severity levels.
- `simulationRunner.js`: Runs the simulation for each scenario and collects performance metrics such as response time, resource utilization, and failure recovery time.

### Scenario Table

| Scenario       | Description                                       | Agent Failure | Server Failure | Network Latency | Resource Availability | Workload |
| -------------- | ------------------------------------------------- | ------------- | -------------- | --------------- | -------------------- | -------- |
| Small fire     | Fire spotted near downtown                        | false         | false          | 100             | 100                  | 1        |
| Large fire     | Large fire near the park                          | true          | false          | 300             | 80                   | 2        |
| Earthquake     | Earthquake detected, multiple incidents reported | false         | true           | 500             |  60                   | 5        |
| Flood          | Flood warning near the river                      | false         | true           | 200             | 100                  | 3        |
| Gas Leak       | Gas leak reported in residential area             | true          | false          | 400             | 70                   | 4        |
| Chemical Spill | Chemical spill at the industrial facility         | true          | true           | 600             | 50                   | 6        |


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

```
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
```

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
```

## Docker Setup

Docker is a platform that uses OS-level virtualization to deliver software in packages called containers. Containers are isolated from each other and bundle their own software, libraries, and system tools.

### Installation

1. Download Docker for the operating system from [Docker's official website](https://www.docker.com/products/docker-desktop).
2. Install Docker following the instructions for the operating system.
3. Verify the installation by running the following command in the terminal:

```bash
docker --version
```
### Building Docker Images

To package the application into a Docker container, you need to create a Dockerfile. Here's a simple example of a Dockerfile for a Node.js application:

```
# Use the official Node.js runtime as base image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 8080 to be accessed outside of the container
EXPOSE 8080

# Run the application
CMD [ "node", "app.js" ]

```
To build the Docker image, navigate to the directory containing the Dockerfile and run the following command:

``` bash 
docker build -t your-image-name 
```

## Kubernetes Setup

Kubernetes is an open-source platform designed to automate deploying, scaling, and operating application containers.

## Installation

1. Install a Kubernetes distribution, for example, Minikube for local testing, or Amazon EKS, Google Kubernetes Engine (GKE), or Azure Kubernetes Service (AKS) for cloud environments.
2. Install kubectl, a command-line tool used to deploy and manage applications on Kubernetes. You can install it following these instructions.
3. Verify the installation by checking the version of kubectl:

```bash 
kubectl version --client
```

### Deploying Applications

To deploy the Dockerized application on Kubernetes, you need to create a Kubernetes Deployment configuration. Here's a simple example:

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: your-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: your-app
  template:
    metadata:
      labels:
        app: your-app
    spec:
      containers:
      - name: your-app
        image: your-image-name
        ports:
        - containerPort: 8080
```
You can apply this configuration using kubectl:

```bash
kubectl apply -f your-deployment.yaml
```

Remember to replace "your-image-name" and "your-app" with the actual names of the Docker image and application.

## Chaos Mesh

Chaos Testing with Chaos Mesh

Chaos Mesh is a cloud-native Chaos Engineering platform that orchestrates chaos on Kubernetes environments. In the context of our system, it can help us simulate real-world disruptions and observe how our system handles them.

### Installing Chaos Mesh

You can install Chaos Mesh on the Kubernetes cluster using a script. This script will automatically install the required components and related Service Account.

```bash
# Install Chaos Mesh
curl -sSL https://mirrors.chaos-mesh.org/v2.0.0/install.sh | bash
```

### Creating Chaos Experiments

Chaos Mesh supports several types of chaos experiments such as pod kill, network delay, etc. You can define the experiments in YAML files.

Here is an example of a NetworkChaos experiment that introduces a network delay:

```yaml
apiVersion: chaos-mesh.org/v1alpha1
kind: NetworkChaos
metadata:
  name: network-delay-example
  namespace: default
spec:
  action: delay
  mode: one
  selector:
    namespaces:
      - default
    labelSelectors:
      "app": "target-app"
  delay:
    latency: "10ms"
  duration: "30s"
  scheduler:
    cron: "@every 60s"
```
You can apply this experiment with the kubectl apply command:
`kubectl apply -f network_delay.yaml`

### Monitoring Chaos Experiments

Chaos Mesh provides a dashboard for you to monitor the status of chaos experiments. You can access the dashboard through Kubernetes' API server. By default, the dashboard is available at http://localhost:2333.

You can use the following command to setup port forwarding for the dashboard:

`kubectl port-forward -n chaos-testing svc/chaos-dashboard 2333:80`

After setting up port forwarding, you can open a web browser and visit http://localhost:2333 to access the Chaos Mesh dashboard.

### Uninstalling Chaos Mesh

When you're finished with the chaos experiments, you can uninstall Chaos Mesh with the following command:

`curl -sSL https://mirrors.chaos-mesh.org/v2.0.0/install.sh | bash -s -- --template | kubectl delete -f -`

Note: Please remember to replace "target-app" in the example with the actual label of the application.