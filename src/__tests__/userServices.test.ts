import User from "../models/User";
import bcrypt from "bcryptjs";
import { UserService } from "../services/userServices";

jest.mock("../models/user", () => ({
  User: {
    findOne: jest.fn(),
  },
}));
jest.mock("bcrypt", () => ({
  genSalt: jest.fn(),
  hash: jest.fn(),
}));

describe("UserService", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  describe("checkUserExists", () => {
    it("should return true if user does not exist", async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      const result = await userService.checkUserExists("test@example.com");
      expect(result).toBe(true);
    });

    it("should return false if user exists", async () => {
      (User.findOne as jest.Mock).mockResolvedValue({
        email: "test@example.com",
      });

      const result = await userService.checkUserExists("test@example.com");
      expect(result).toBe(false);
    });

    it("should throw an error if there is an issue with the database", async () => {
      (User.findOne as jest.Mock).mockRejectedValue(new Error("findOne error"));

      await expect(
        userService.checkUserExists("test@example.com")
      ).rejects.toThrow("findOne error");
    });
  });
});

describe("hashPassword", () => {
  it("should hash password", async () => {
    (bcrypt.genSalt as jest.Mock).mockResolvedValue("salt");
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");

    const hashedPassword = await userService.hashPassword("password123");
    expect(hashedPassword).toBe("hashedPassword");
  });

  it("should throw error if hashing password fails", async () => {
    (bcrypt.genSalt as jest.Mock).mockRejectedValue(new Error("genSalt error"));

    await expect(userService.hashPassword("password123")).rejects.toThrow(
      "Error hashing password"
    );
  });
});
