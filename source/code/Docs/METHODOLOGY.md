# Methodology

## Code Setup

The system is structured using a microservices architecture and deployed on Kubernetes. It consists of the following components:

- Agent-based:
  - Agent: Responsible for processing messages from HQ and interacting with Fire Trucks.
  - App: Handles message routing and communication between HQ, Agent, and Fire Trucks.
  - Fire Truck: Represents a simulated Fire Truck that receives messages from the Agent.
  - HQ: Sends messages to the Agent for further processing.

- Centralized-based:
  - App: Handles message routing and communication between HQ, Agent, and Fire Trucks.
  - Fire Truck: Represents a simulated Fire Truck that receives messages from the Agent.
  - HQ: Sends messages to the Agent for further processing.

## Reliability Strategies

To enhance the reliability of the system and handle failures effectively, the following strategies have been implemented:

### Retry
[implemented]
Retry is the process of performing a failed activity again, either immediately or after some delay. It helps increase the chances of success, especially if the failure was due to transient issues. In the system, retry logic has been implemented for critical operations, such as sending messages from HQ to the Agent and from the Agent to Fire Trucks. Exponential backoff is utilized to gradually increase the delay between retries.

### Proactive Retry
[implemented]
Proactive retry involves performing the activity multiple times in parallel and utilizing the result of the first successful execution. This approach is useful when the activity has multiple instances or replicas. However, proactive retry has not been implemented in the current system. Consider implementing proactive retry for scenarios where parallel execution can improve overall performance and reduce the time required to accomplish the activity.

### Failover
[Implementing]
Failover is the process of rerouting the activity to an alternative endpoint or replica when the primary one fails. It ensures continuity of service by performing the activity against a different copy of the endpoint or multiple parallel copies. In the system, failover strategy has been implemented for handling node failures or network issues. For example, if an Agent or Fire Truck becomes unavailable, the system automatically routes the activity to an available instance.

### Fallback
(Considering pros and cons)
Fallback is the strategy of using a different mechanism or approach to achieve the same result when the primary method fails. It provides an alternative solution when the primary approach is not feasible or encounters errors. In the current system, fallback strategy has not been implemented. Consider implementing fallback mechanisms for critical activities, such as alternative API calls or utilizing backup services, to ensure reliable operation even when the primary method fails.

Please note that the strategies mentioned here are not exhaustive, and their implementation details may vary depending on your specific use cases and requirements.

