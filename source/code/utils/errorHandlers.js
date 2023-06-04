function setUpErrorHandlers() {
	
	process.on('uncaughtException', (error) => {
	  console.error('Uncaught exception: ', error);
	});
	process.on('unhandledRejection', (reason, promise) => {
	  console.error('Unhandled rejection at ', promise, 'reason: ', reason);
	});
}  
module.exports = setUpErrorHandlers;
  