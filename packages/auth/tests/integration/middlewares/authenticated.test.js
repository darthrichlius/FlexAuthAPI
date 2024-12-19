const supertest = require("supertest");

const { valid: mockValidUser } = require("../../__mocks__/data/users.mock");

let server, tokenManager, getModels, getDbClient, getUserModel, JWT_SECRET;
let user;

const base = "/api/__test__";

describe("authenticated middleware", () => {
  beforeAll(() => {
    server = require("../../../index");

    /**
     * We MUST import the components in the same context than for the server
     */
    JWT_SECRET = process.env.JWT_SECRET;
    tokenManager = require("../../../src/managers").tokenManager;
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
    user = await User.create(mockValidUser);
  });
  afterEach(async () => {
    // Remove valid user
    const User = getUserModel();

    await User.deleteMany({});
    server.close();
  });

  const exec = async () => {
    return await supertest(server).get(`${base}/authenticated`);
  };

  const execWithToken = async (token) => {
    return await supertest(server)
      .get(`${base}/authenticated`)
      .set("x-app-auth-access-token", token);
  };

  describe("Without Token", () => {
    it("should return 401 if no token is provided", async () => {
      const res = await exec();
      expect(res.status).toBe(400);
    });
  });

  describe("With Token", () => {
    let token;

    beforeEach(() => {
      token = tokenManager.generateDefaultAccessTokenPayload(user, JWT_SECRET);
    });

    it("should return 401 if token is invalid", async () => {
      const res = await execWithToken("test-generated-token");
      expect(res.status).toBe(400);
    });

    it("should return 200 if a valid token is valid", async () => {
      const res = await execWithToken(token);
      expect(res.status).toBe(200);
    });
  });
});
