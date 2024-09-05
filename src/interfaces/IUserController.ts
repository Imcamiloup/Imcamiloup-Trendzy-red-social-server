import { RegisterControllerParams } from "../interfaces/userInterfaces";

export interface IUserController {
    register(params: RegisterControllerParams): Promise<{ verificationToken: string, newUser: any }>;
    getAllUsers(): Promise<any[]>;
}