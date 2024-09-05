export interface IUserService {
	hashPassword(password: string): Promise<string>;
	checkUserExists(email: string): Promise<boolean>;
}