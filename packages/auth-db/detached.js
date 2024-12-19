const path = require("path");

const { connect } = require("./src/clients/mongoose");

const attach = (client, models) => {
  /**
   * sanity should never be called before we are sure configuration files are loaded
   * calling at this stage ensures the vars had already been loaded
   * Is it not certain but we lower the risk
   */
  require("./src/starter").sanity();

  let _models = [];
  models.map((model) => {
    const m = client.model(model.name, model.schema);
    _models.push(m);
  });
  return _models;
};

module.exports = {
  connect,
  attach,
};
