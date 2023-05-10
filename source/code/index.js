const { argv } = require('yargs');

if (argv.centralise) {
  // Run tests for centralise-based system
  const { spawn } = require('child_process');
  const app = spawn('node', ['centralise-based/app.js']);
  const firetruck = spawn('node', ['centralise-based/firetruck.js']);
  const hq = spawn('node', ['centralise-based/hq.js']);
  // Add more scripts as necessary

  app.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  app.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  app.on('close', (code) => {
    console.log(`app process exited with code ${code}`);
  });

  firetruck.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  firetruck.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  firetruck.on('close', (code) => {
    console.log(`app process exited with code ${code}`);
  });

  hq.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  hq.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  hq.on('close', (code) => {
    console.log(`app process exited with code ${code}`);
  });

} else if (argv.agent) {
  // Run tests for agent-based system
  const { spawn } = require('child_process');
  const app = spawn('node', ['agent-based/app.js']);
  const hq = spawn('node', ['agent-based/hq.js']);
  const firetruck = spawn('node', ['agent-based/firetruck.js']);
  // Add more scripts as necessary

  app.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  app.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  app.on('close', (code) => {
    console.log(`hq process exited with code ${code}`);
  });

  hq.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  hq.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  hq.on('close', (code) => {
    console.log(`hq process exited with code ${code}`);
  });

  firetruck.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  firetruck.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  firetruck.on('close', (code) => {
    console.log(`hq process exited with code ${code}`);
  });


  // Repeat the same code for firetruck1, firetruck2, etc.

} else {
  console.log('Please specify a valid option (agent or centralise).');
}


x