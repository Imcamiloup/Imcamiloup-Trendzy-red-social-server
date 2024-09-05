import bcrypt from 'bcryptjs';
import User from '../models/User';
import { UserService } from '../services/userServices';

jest.mock('bcrypt', () => ({
  genSalt: jest.fn(),
  hash: jest.fn(),
}));
jest.mock('../models/User');

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  it('should hash password', async () => {
    (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

    const hashedPassword = await userService.hashPassword('password123');

    expect(hashedPassword).toBe('hashedPassword');
  });

  it('should throw error if hashing password fails', async () => {
    (bcrypt.genSalt as jest.Mock).mockRejectedValue(new Error('genSalt error'));

    await expect(userService.hashPassword('password123')).rejects.toThrow('Error hashing password');
  });

  it('should check if user exists', async () => {
    (User.findOne as jest.Mock).mockResolvedValue({ id: 1, email: 'test@example.com' });

    const exists = await userService.checkUserExists('test@example.com');

    expect(exists).toBe(true);
  });

  it('should throw error if checking user existence fails', async () => {
    (User.findOne as jest.Mock).mockRejectedValue(new Error('findOne error'));

    await expect(userService.checkUserExists('test@example.com')).rejects.toThrow('findOne error');
  });
});