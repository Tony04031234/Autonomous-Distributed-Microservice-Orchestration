const { spawn } = require('child_process');
const scenarioTests = spawn('node', ['scenarioTests.js']);

scenarioTests.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

scenarioTests.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

scenarioTests.on('close', (code) => {
  console.log(`scenarioTests process exited with code ${code}`);
});

