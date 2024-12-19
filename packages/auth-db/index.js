require("@dotenvx/dotenvx").config();

const starter = require("./src/starter");
const userDbSchema = require("./src/models/users");

starter.config(__dirname);
starter.sanity();

const { connect } = require("./src/clients/mongoose");

const dbClient = connect();

dbClient.model("User", userDbSchema);
