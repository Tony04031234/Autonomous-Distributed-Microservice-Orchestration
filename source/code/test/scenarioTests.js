const { sendMessageToAgent, sendMessageToFireTruck, sendMessageToMultipleFireTrucks } = require('./test.js');
const scenarios = require('./scenarios.json');

async function runTestForAgentSystem(scenario) {
    if (scenario.agentFailure) {
        console.log(`[Agent-based] Skipping agent ${scenario.messages[0].agentId} due to failure.`);
        return;
    }

    if (scenario.serverFailure) {
        console.log('[Agent-based] Skipping test due to server failure.');
        return;
    }

    setTimeout(() => {
        sendMessageToAgent(scenario.messages[0].content, scenario.messages[0].agentId);
    }, scenario.networkLatency);
}

async function runTestForCentralizedSystem(scenario) {
    if (scenario.serverFailure) {
        console.log('[Centralized] Skipping test due to server failure.');
        return;
    }

    setTimeout(() => {
        sendMessageToFireTruck(scenario.messages[1].content);
    }, scenario.networkLatency);
}

async function runTests() {
    const scenarios = require('./scenarios.json');
  
    for (const scenario of scenarios) {
      console.log(`Running test for scenario ${scenario.id}: ${scenario.name}`);
      await runTestForAgentSystem(scenario);
      await runTestForCentralizedSystem(scenario);
      console.log('\n');
    }
  }
  
runTests().catch(console.error);

