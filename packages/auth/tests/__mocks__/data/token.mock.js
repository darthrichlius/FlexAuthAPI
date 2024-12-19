const { valid: validUserData } = require("./users.mock");

const validTokenPayload = {
  email: validUserData.email,
  roles: ["user"],
  iat: 1734020344,
};

module.exports = {
  validTokenPayload,
};
