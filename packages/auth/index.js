require("../../integrations/sentry/instrument");

const express = require("express");
const app = express();
const env = process.env.NODE_ENV || "";
/**
 * dotenvx seems not able to handle this case alone
 */
try {
  /**
   * We try our best to resolve variable using a available file
   * @todo we remove the ability to resolved .env for now
   * Our cloud provider doesn't allow .env file
   */
  //require("@dotenvx/dotenvx").config({ path: `.env${env ? "." + env : ""}` });
} catch (err) {
  /**
   * There are 2 case:
   * 1. The .env.* file doesn't exist and it will crash at sanity()
   * 2. We had added the environment variables globally and it will WORK
   **/
}

let server;

const appDebugger = require("./src/utils/debugger");
const starter = require("./src/starter");

starter.config(__dirname);
starter.handlers(process);
starter.sanity();
starter.db();
starter.middlewareBefore(app);
starter.observability(app);
starter.routes(app);
starter.middlewareFinally(app);

if (["test", "production"].includes(env)) {
  server = starter.prod(app);
} else {
  server = starter.dev(__dirname, app);
}

/**
 * This approach prevents the server used during tests from running on the same port as the application server.
 * It is highly likely that, at the time of testing, there is already a server running.
 * This method avoids port collisions and provides flexibility.
 */
const PORT =
  process.env.RUN_TEST && process.env.RUN_TEST_PORT
    ? process.env.RUN_TEST_PORT
    : process.env.PORT || 5001;

/**
 * Check if the server is already listening before calling listen
 * Fix: Vercel "Server already called"
 */
if (!server.listening) {
  server.listen(PORT, () => {
    appDebugger.info(
      `... Running in ${env || "development"} mode on PORT :${PORT}...`
    );
  });
}

// Export server for testing or other purposes
module.exports = server;
