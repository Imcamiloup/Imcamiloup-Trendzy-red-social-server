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
      throw new Error('User already exists');
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
};
