import { RegisterControllerParams } from "../interfaces/userInterfaces";
import { LoginControllerParams } from "../interfaces/userInterfaces";

export interface IUserController {
  register(
    params: RegisterControllerParams
  ): Promise<{ verificationToken: string; newUser: any }>;
  getAllUsers(): Promise<any[]>;
  login(params: LoginControllerParams): Promise<{ token: string; user: any }>;
}
