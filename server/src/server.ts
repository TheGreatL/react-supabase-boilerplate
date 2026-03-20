import {createServer} from 'http';
import app from './app';
import {config} from './shared/config';
import {SessionRepository} from './features/auth/session.repository';

/**
 * Gold Standard:
 * Server.ts is the entry point of the Node.js application.
 * It creates the HTTP server and starts it on the configured port.
 * Separation of app.ts and server.ts allows for easier testing of Express logic.
 */
const server = createServer(app);
const PORT = config.PORT;
const sessionRepository = new SessionRepository();

function startServer() {
  server.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📝 Documentation available at http://localhost:${PORT}/api/docs`);
  });

  // Background Job: Clean up expired sessions every hour to prevent table bloat
  const ONE_HOUR = 60 * 60 * 1000;
  setInterval(async () => {
    try {
      const result = await sessionRepository.deleteExpired();
      if (result.count > 0) {
        console.log(`🧹 Cleaned up ${result.count} expired session(s)`);
      }
    } catch (error) {
      console.error('❌ Session cleanup failed:', error);
    }
  }, ONE_HOUR);
}

// Start the server
startServer();
