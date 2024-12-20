require("../../integrations/sentry/instrument");

const express = require("express");
const app = express();
const env = process.env.NODE_ENV || "";

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

/**
 * This approach prevents the server used during tests from running on the same port as the application server.
 * It is highly likely that, at the time of testing, there is already a server running.
 * This method avoids port collisions and provides flexibility.
 */
const PORT =
  process.env.RUN_TEST && process.env.RUN_TEST_PORT
    ? process.env.RUN_TEST_PORT
    : process.env.PORT || 5001;

app.listen(PORT, () => {
  appDebugger.info(
    `... Running in ${env || "development"} mode on PORT :${PORT}...`
  );
});

module.exports = app;
