const supertest = require("supertest");

const {
  valid,
  validNotExits,
  malformedMissingRequired,
  invalidUserWithInvalidEmail,
  invalidUserWithProvidedRoles,
} = require("../../__mocks__/data/users.mock");

const base = "/api/users";

let user;
let server, JWT_SECRET, getModels, tokenManager, getUserModel, getDbClient;

describe(base, () => {
  beforeAll(() => {
    // Initialize the server and database once for all tests
    server = require("../../../index");

    /**
     * We MUST import the components in the same context than for the server
     */
    JWT_SECRET = process.env.JWT_SECRET;
    getDbClient = require("../../../src/globals/db").getDbClient;
    getModels = require("../../../src/globals/models").getModels;
    tokenManager = require("../../../src/managers").tokenManager;

    getUserModel = () => getModels().User;
  });
  afterAll(async () => {
    const dbClient = getDbClient();
    if (dbClient) {
      await dbClient.close(); // Explicitly close the DB connection after all tests
    }
    server.close(); // Ensure the server is closed after all tests
  });

  beforeEach(async () => {
    // Add valid user
    const User = getUserModel();
    user = await User.create(valid);
  });
  afterEach(async () => {
    // Remove valid user
    const User = getUserModel();

    await User.deleteMany({});
  });

  describe("GET", () => {
    describe("GET /me", () => {
      let token;
      beforeEach(() => {
        token = tokenManager.generateDefaultAccessTokenPayload(
          user,
          JWT_SECRET
        );
      });

      it("should return 400 if client has not provided a access_token", async () => {
        const res = await supertest(server).get(`${base}/me`);
        expect(res.status).toBe(400);
      });

      it("should return 200 if client has provided an access token", async () => {
        const res = await supertest(server)
          .get(`${base}/me`)
          .set("x-app-auth-access-token", token);

        expect(res.status).toBe(200);
      });
    });
  });

  describe("POST", () => {
    describe("POST / - Register", () => {
      it("should return 400 if user payload misses required data", async () => {
        const res = await supertest(server)
          .post(`${base}`)
          .send(malformedMissingRequired);

        expect(res.status).toBe(400);
      });

      it("should return 400 if user payload has invalid email", async () => {
        const res = await supertest(server)
          .post(`${base}`)
          .send(invalidUserWithInvalidEmail);

        expect(res.status).toBe(400);
      });

      it("should return 400 if user already exists", async () => {
        const res = await supertest(server).post(`${base}`).send(valid);

        expect(res.status).toBe(400);
      });

      it("should return 400 if user payload contains roles", async () => {
        const res = await supertest(server)
          .post(`${base}`)
          .send(invalidUserWithProvidedRoles);

        expect(res.status).toBe(400);
      });

      // SUCCESS

      it("should return 200 if user payload is valid", async () => {
        const res = await supertest(server).post(`${base}`).send(validNotExits);

        expect(res.status).toBe(200);
      });
    });
  });
});
