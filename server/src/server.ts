import { createServer } from "http";
import app from "./app";
import { config } from "./shared/config";

const server = createServer(app);
const PORT = config.PORT;

async function startServer() {
  server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
}
startServer();
