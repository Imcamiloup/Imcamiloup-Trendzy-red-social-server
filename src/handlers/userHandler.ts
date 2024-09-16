import { Request, Response } from "express";
import { IUserController } from "../interfaces/IUserController";

export class UserHandler {
  private userController: IUserController;

  constructor(userController: IUserController) {
    this.userController = userController;
  }

  public registerHandler = async (req: Request, res: Response) => {
    try {
      const { email, password, name, role, isActive } = req.body;
      const { verificationToken, newUser } = await this.userController.register(
        { email, password, name, role, isActive }
      );
      res.status(201).json({ verificationToken, newUser });
    } catch (error) {
      res
        .status(400)
        .json({
          message:
            error instanceof Error ? error.message : "Unknown error occurred",
        });
    }
  };

  public getAllUsersHandler = async (_req: Request, res: Response) => {
    try {
      const users = await this.userController.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  };

  public loginHandler = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const { token, user } = await this.userController.login({
        email,
        password,
      });
      res.status(200).json({ token, user });
    } catch (error) {
      res
        .status(400)
        .json({
          message:
            error instanceof Error ? error.message : "Unknown error occurred",
        });
    }
  };
}
