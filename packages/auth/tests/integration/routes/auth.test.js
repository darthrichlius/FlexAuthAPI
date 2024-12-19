const supertest = require("supertest");

const {
  getMockValidUserForAuth,
  validCredentials,
  invalidWithBadCredentials,
  invalidWithBadPasswordCredentials,
  invalidWithBadUsernameCredentials,
  malformedMissingRequired,
} = require("../../__mocks__/data/auth.mock");

let server, getModels, getUserModel, getDbClient;

const base = "/api/auth";

describe(base, () => {
  beforeAll(async () => {
    // Initialize the server and database once for all tests
    server = require("../../../index");

    getDbClient = require("../../../src/globals/db").getDbClient;
    getModels = require("../../../src/globals/models").getModels;
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
    await User.deleteMany({});

    await User.create(await getMockValidUserForAuth());
  });
  afterEach(async () => {
    // Remove valid user
    const User = getUserModel();
    await User.deleteMany({});
  });

  describe("POST", () => {
    describe("POST /", () => {
      // WRONG FORMAT

      it("should return 400 if auth payload has missing required data", async () => {
        const res = await supertest(server)
          .post(`${base}`)
          .send(malformedMissingRequired);

        expect(res.status).toBe(400);
      });

      // BAD CREDENTIALS

      it("should return 404 if auth payload has bad credentials", async () => {
        const res = await supertest(server)
          .post(`${base}`)
          .send(invalidWithBadCredentials);

        expect(res.status).toBe(404);
      });

      it("should return 404 if auth payload has bad USERNAME credentials", async () => {
        const res = await supertest(server)
          .post(`${base}`)
          .send(invalidWithBadUsernameCredentials);

        expect(res.status).toBe(404);
      });

      it("should return 401 if auth payload has bad PASSWORD credentials", async () => {
        const res = await supertest(server)
          .post(`${base}`)
          .send(invalidWithBadPasswordCredentials);

        expect(res.status).toBe(401);
      });

      it("should return 200 if user payload is valid", async () => {
        const res = await supertest(server)
          .post(`${base}`)
          .send(validCredentials);

        expect(res.status).toBe(200);
      });
    });
  });
});
