/**
 * We try our best to resolve variable using a available file
 * @todo we remove the ability to resolved .env for now
 * Our cloud provider doesn't allow .env file
 * In this case normally we don't need it but for safety we comment it
 */
// require("@dotenvx/dotenvx").config();

const starter = require("./src/starter");
const userDbSchema = require("./src/models/users");

starter.config(__dirname);
starter.sanity();

const { connect } = require("./src/clients/mongoose");

const dbClient = connect();

dbClient.model("User", userDbSchema);
