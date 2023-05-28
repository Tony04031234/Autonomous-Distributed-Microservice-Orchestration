# Experimental Setup

This README.md file provides an overview of the experimental setup using Chaos Mesh to test the agent-based system under Denied, Degraded, Intermittent, or Low-Bandwidth (DDIL) scenarios.

## Purpose

The purpose of this experimental setup is to observe how the agent-based system behaves in network conditions characterized by denial, degradation, intermittency, or low bandwidth. By simulating realistic DDIL scenarios, we can gain insights into the system's performance and resilience under challenging network conditions.

## Requirements

To run the experiments, the following requirements must be met:

- Kubernetes cluster: Ensure that Kubernetes cluster's available.
- Chaos Mesh: Install Chaos Mesh, a chaos engineering platform for Kubernetes, which will be used to inject DDIL scenarios into the system.

## DDIL Scenarios

Specific DDIL scenarios have been defined to simulate realistic network conditions. These scenarios include:

- Network partitioning: Simulate network partitioning by isolating certain components or nodes within the system.
- Limited bandwidth: Introduce restrictions on available network bandwidth to create a low-bandwidth environment.
- High latency: Introduce artificial delays to mimic high latency in network communications.
- Intermittent network connectivity: Randomly disrupt network connections at certain intervals.

## Chaos Mesh Integration

Chaos Mesh, a chaos engineering platform for Kubernetes, will be used to inject DDIL scenarios into the agent-based system. Chaos Mesh allows for the introduction of network disruptions and failures, enabling us to observe the system's behavior and response.

## Experimental Procedure

1. Configure Chaos Mesh experiments to simulate the defined DDIL scenarios.
2. Monitor and observe the system during the experiments to analyze its behavior under different network conditions.

## Result Analysis

Analyzing the results obtained from the experiments is crucial. The system's behavior and performance under different DDIL scenarios will be evaluated, providing insights into its resilience and capability to handle challenging network conditions.

## System Adjustment

Based on the analysis of the experimental results, adjustments will be made to improve the system's resilience and performance. The insights gained from the experiments will guide the refinement of the agent-based system's behavior in DDIL environments.

## Conclusion

This experimental setup aims to test the agent-based system under DDIL scenarios using Chaos Mesh. By simulating denied, degraded, intermittent, or low-bandwidth network conditions, we gain valuable insights into the behavior and performance of the system. These experiments contribute to our understanding of how the system operates in challenging network environments.

## Project directory
    
    ├── agent-based
    │   ├── agent
    │   │   ├── Dockerfile
    │   │   └── agent.js
    │   ├── app
    │   │   ├── Dockerfile
    │   │   └── app.js
    │   ├── firetruck
    │   │   ├── Dockerfile
    │   │   └── firetruck.js
    │   ├── hq
    │   │   ├── Dockerfile
    │   │   └── hq.js
    │   └── package.json
    ├── centralise-based
    │   ├── app
    │   │   ├── Dockerfile
    │   │   └── app.js
    │   ├── firetruck
    │   │   ├── Dockerfile
    │   │   └── firetruck.js
    │   ├── hq
    │   │   ├── Dockerfile
    │   │   └── hq.js
    │   └── package.json
    |——— interface
    |  |—— agent_interface.js
    |  |——firetruck_interface.js 
    |  |—— hq_interface.js
    |——— Kubernetes
    |   |___ agent-based-agent-deployment.yaml
    |.  |___ agent-based-app-deployment.yaml
    |.  |___ agent-based-app-service.yaml
    |.  |___ agent-based-firetruck-deployment.yaml
    |.  |___ agent-based-hq-deployment.yaml
    |.  |___ centralise_based_app-service.yaml
    |.  |___ centralise-based-app-deployment.yaml
    |.  |___ centralise-based-firetruck-deployment.yaml
    |.  |___ centralise-based-hq-deployment.yaml
    |.  |___ code-default-networkpolicy.yaml
    |   |___ rabbitmq-deployment.yaml
    |.  |___ rabbitmq-service.yaml
    |——— logging
    | . |——— fluentd.config
    |——— monitoring
    | . |——— prometheus.yml
    |——— node_modules
    |——— test
    |.  |___ scenario.json
    |.  |___ scenarioTests.js
    |.  |___ simulationRunner.js
    |.  |___ unit_test.js 
    |——— .gitignore
    ├──- chart.js
    |——— chart.png
    ├-── docker-compose.yml
    |——— EXPECTED_RESULT.md
    |——— EXPERIMENTAL_SETUP.md
    |——— network_delay.yaml
    |——— package-lock.json
    |-── package.json
    |——— README.md
    |——— [RESULT.md]
    |——— start.js

