import jwt from "jsonwebtoken";
import {
  RegisterControllerParams,
  VerificationParams,
} from "../interfaces/userInterfaces";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { IUserService } from "../interfaces/IUserSevices";

dotenv.config();

export class UserService implements IUserService {
  public register = async ({
    email,
    password,
    name,
    role,
    isActive,
  }: RegisterControllerParams): Promise<{
    verificationToken: string;
    newUser: any;
  }> => {
    try {
      const userExists = await this.checkUserExists(email);
      if (userExists) {
        throw new Error("User already exists");
      }
      const hashedPassword = await this.hashPassword(password);
      const newUser = await User.create({
        email,
        password: hashedPassword,
        name,
        role,
        isActive,
      });
      const verificationToken = this.generateEmailVerificationToken({
        email,
        username: newUser.name,
      });
      return { verificationToken, newUser };
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  };

  public generateEmailVerificationToken = ({
    email,
    username,
  }: VerificationParams) => {
    try {
      const token = jwt.sign(
        { email, username },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "1d",
        }
      );

      return token;
    } catch (error) {
      console.error(
        "Error al generar el token de verificación de usuario:",
        error
      );
      throw error;
    }
  };

  public hashPassword = async (password: string): Promise<string> => {
    try {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      console.error("Error hashing password:", error);
      throw new Error("Error hashing password");
    }
  };

  public checkUserExists = async (email: string): Promise<boolean> => {
    try {
      const user = await User.findOne({ where: { email } });
      return !!user;
    } catch (error) {
      console.error("Error checking if user exists:", error);
      throw error;
    }
  };

  public comparePassword = async (
    password: string,
    hashedPassword: string
  ): Promise<boolean> => {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      console.error("Error comparing passwords:", error);
      throw error;
    }
  };

  public generateToken = (payload: any): string => {
    try {
      return jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: "1d",
      });
    } catch (error) {
      console.error("Error generating token:", error);
      throw error;
    }
  };
}
