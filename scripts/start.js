const path = require("path");

// Change directory to the path, which is relative to the root of the monorepo
process.chdir(path.join(__dirname, "..", "packages", "auth"));

// Start the application
require("../packages/auth/dist/index.js");
