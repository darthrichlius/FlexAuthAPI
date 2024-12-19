const valid = {
  fullname: "John Doe",
  email: "john.doe@test.domain.dev",
  password: "Password1234",
  // We must add roles as we don't benefit from the API validation in this context
  roles: ["user"],
};

const validNotExits = {
  fullname: "Agatha Christie",
  email: "agatha.christie@test.domain.dev",
  password: "Password1234",
  // We not pass role as this is used as part of an API call
};

const malformedMissingRequired = {
  // `fullname` is missing
  email: "john.doe@test.domain.dev",
  password: "Password1234",
  // `roles` is missing
};

const invalidUserWithInvalidEmail = {
  fullname: "John Doe",
  email: "john.doe_test.domain.dev",
  password: "Password1234",
  roles: ["user"],
};

const invalidUserWithProvidedRoles = {
  fullname: "John Doe",
  email: "john.doe@test.domain.dev",
  password: "Password1234",
  roles: ["user"],
};

/**
 * @todo
 *
 * - Wrong data validation
 *  - Bad fullname
 *  - Bad email
 *  - Bad password
 *  - Bad roles
 */

module.exports = {
  // VALID
  valid,
  validNotExits,
  // BAD FORMAT
  malformedMissingRequired,
  // INVALID
  invalidUserWithInvalidEmail,
  invalidUserWithProvidedRoles,
};
