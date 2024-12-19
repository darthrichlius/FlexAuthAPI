const supertest = require("supertest");
let server;

const base = "/api";

describe(base, () => {
  beforeAll(() => {
    server = require("../../../index");
  });
  afterAll(() => server.close()); // Ensure the server is closed after all tests

  describe(`GET ${base}/ping`, () => {
    it("should return 200", async () => {
      const res = await supertest(server).get(`${base}/ping`);
      expect(res.status).toBe(200);
    });
  });
});
