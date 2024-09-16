import User from "../models/User";
import { UserService } from "../services/userServices";
import { RegisterControllerParams } from "../interfaces/userInterfaces";

import dotenv from "dotenv";
import { IUserController } from "../interfaces/IUserController";
dotenv.config();

export const userController: IUserController = {
  register: async ({
    email,
    password,
    name,
    role,
    isActive,
  }: RegisterControllerParams) => {
    const userService = new UserService();
    const userExists = await userService.checkUserExists(email);

    if (userExists) {
      throw new Error("User already exists");
    }
    const hash = await userService.hashPassword(password);
    const verificationToken = userService.generateEmailVerificationToken({
      email,
      username: name,
    });

    const newUser = await User.create({
      email,
      password: hash,
      name,
      role,
      isActive,
    });

    return { verificationToken, newUser };
  },

  getAllUsers: async () => {
    try {
      const users = await User.findAll();
      return users;
    } catch (error) {
      console.error("Error getting all users:", error);
      throw error;
    }
  },

  login: async ({ email, password }) => {
    const userService = new UserService();
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("User not found");
    }

    const passwordMatch = await userService.comparePassword(
      password,
      user.password
    );

    if (!passwordMatch) {
      throw new Error("Invalid password");
    }

    const token = userService.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { token, user };
  },
};
