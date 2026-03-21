import {config} from './shared/config';
import {createServer} from 'http';
import app from './app';
import {startSessionCleanupCron} from './shared/cron/session-cleanup.cron';

/**
 * Gold Standard:
 * Server.ts is the entry point of the Node.js application.
 * It creates the HTTP server and starts it on the configured port.
 * Separation of app.ts and server.ts allows for easier testing of Express logic.
 */
const server = createServer(app);
const PORT = config.PORT;

function startServer() {
  server.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📝 Documentation available at http://localhost:${PORT}/api/docs`);
  });

  // Start background cron jobs
  startSessionCleanupCron();
}

// Start the server
startServer();
