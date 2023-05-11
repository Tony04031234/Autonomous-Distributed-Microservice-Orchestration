const fs = require('fs');
const scenarios = require('./scenarios.json');

async function runScenario(scenario, systemType) {
  // Set up the environment
  configureEnvironmentForSystem(systemType, scenario.environment);

  // Run the test scenario
  const startTime = Date.now();
  await processScenario(systemType, scenario);

  // Measure response time
  const responseTime = Date.now() - startTime;

  // Measure resource utilization
  const resourceUtilization = measureResourceUtilization(systemType);

  // Measure failure recovery time
  const failureRecoveryTime = await measureFailureRecoveryTime(systemType, scenario);

  return { responseTime, resourceUtilization, failureRecoveryTime };
}

(async () => {
  const results = [];

  for (const scenario of scenarios) {
    const agentBasedResults = await runScenario(scenario, 'agent');
    const centralizedResults = await runScenario(scenario, 'centralized');

    results.push({
      scenario: scenario.name,
      agentBased: agentBasedResults,
      centralized: centralizedResults,
    });
  }

  // Save results to a JSON file
  fs.writeFileSync('results.json', JSON.stringify(results, null, 2));
})();

module.exports = {
  runScenario,
};