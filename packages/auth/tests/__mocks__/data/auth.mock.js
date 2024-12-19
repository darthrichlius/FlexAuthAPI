const { valid: validUserData } = require("./users.mock");
const { passwordManager } = require("../../../src/managers");

const getMockValidUserForAuth = async () => {
  return {
    ...validUserData,
    password: await passwordManager.hash(validUserData.password),
  };
};

// VALID CREDENTIALS

const validCredentials = {
  username: validUserData.email,
  password: validUserData.password,
};

// BAD FORMAT

const malformedMissingRequired = {
  username: validUserData.email,
};

// BAD CREDENTIALS

const invalidWithBadCredentials = {
  username: "unknown@test.domain.dev",
  password: "__wrong_password__",
};

const invalidWithBadUsernameCredentials = {
  username: "unknown@test.domain.dev",
  password: validUserData.password,
};

const invalidWithBadPasswordCredentials = {
  username: validUserData.email,
  password: "__wrong_password__",
};

module.exports = {
  getMockValidUserForAuth,
  validCredentials,
  malformedMissingRequired,
  invalidWithBadCredentials,
  invalidWithBadUsernameCredentials,
  invalidWithBadPasswordCredentials,
};
