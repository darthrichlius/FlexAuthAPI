const jwt = require("jsonwebtoken");
const tokenManager = require("../../../src/managers/token");
const { authenticated } = require("../../../src/middlewares/auth");
const { valid: validUser } = require("../../__mocks__/data/users.mock");
const { validTokenPayload } = require("../../__mocks__/data/token.mock");

describe("auth middleware", () => {
  let req, res, next, token;
  const JWT_SECRET = "__dump_secret__";

  beforeEach(() => {
    // Arrange common setup for tests
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clean up mocks after each test
  });

  describe("valid scenario", () => {
    beforeEach(() => {
      // ##### Arrange
      process.env.JWT_SECRET = JWT_SECRET;

      token = jwt.sign(validTokenPayload, JWT_SECRET);
      req.header = jest.fn((key) => {
        if (key === "x-app-auth-access-token") {
          return token;
        }
      });
      // Mock tokenManager methods
      jest.spyOn(tokenManager, "verify").mockReturnValue(validTokenPayload);
      jest
        .spyOn(tokenManager, "getUserFromTokenPayload")
        .mockResolvedValue(validUser);
    });

    afterEach(() => {
      jest.clearAllMocks(); // Clean up mocks after each test
    });

    it("should populate req.accessToken with the plain text access token", async () => {
      // ##### Act
      await authenticated(req, res, next);

      // ##### Assert
      expect(req.accessToken).toBe(token);
      expect(tokenManager.verify).toHaveBeenCalledWith(token, JWT_SECRET);
      expect(next).toHaveBeenCalled();
    });

    it("should populate req.user with the current user data", async () => {
      // ##### Act
      await authenticated(req, res, next);

      // ##### Assert
      expect(req.user).toBe(validUser);
      expect(tokenManager.verify).toHaveBeenCalledWith(token, JWT_SECRET);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("invalid scenario", () => {
    afterEach(() => {
      jest.clearAllMocks(); // Clean up mocks after each test
    });

    it("should throw an error if JWT_SECRET is missing", async () => {
      // ##### Arrange
      process.env.JWT_SECRET = undefined;

      // ##### Act & Assert
      await expect(authenticated(req, res, next)).rejects.toThrow();

      // Ensure next and res methods are not called
      expect(next).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should has a 400 response if token is not provided", async () => {
      // ##### Arrange
      req.header = jest.fn((key) => {
        if (key === "x-app-auth-access-token") {
          return undefined; // No token provided
        }
      });

      // ##### Act
      await authenticated(req, res, next);

      // ##### Assert
      expect(res.status).toHaveBeenCalledWith(400);
      /**
       * Checking the error message is considered part of test implementation details and is not the primary focus.
       * However, since the middleware can return a 400 status for different reasons, verifying the message adds value in this case.
       * Reasons for checking the message:
       * 1) Without it, our test logic would be incomplete, as multiple issues could trigger a 400 status.
       * 2) Creating a separate test just for validating the message would lead to redundancy, repeating tests for a small part.
       * 3) The message is explicit and helps the client understand the issue, as well as aids debugging when reviewing logs.
       *
       * Conclusion: Checking the message is acceptable in this scenario to provide more complete and meaningful test coverage.
       */
      expect(res.send).toHaveBeenCalledWith(
        "Access denied. Missing required token"
      );
      expect(next).not.toHaveBeenCalled(); // Ensure `next` is not called
    });
  });
});
