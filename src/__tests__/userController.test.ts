import request from 'supertest';
import app from '../server';
import User from '../models/User';
import { UserService } from '../services/userServices';
import { userController } from '../controllers/userController';


jest.mock('../models/User');
jest.mock('../services/userServices', () => {
  return {
    UserService: jest.fn().mockImplementation(() => {
      return {
        checkUserExists: jest.fn(),
        hashPassword: jest.fn(),
        generateEmailVerificationToken: jest.fn(),
      };
    }),
  };
});
jest.mock('../controllers/userController', () => ({
  userController: {
    register: jest.fn(),
    getAllUsers: jest.fn(),
  },
}));

describe('UserController', () => {
  let userService = new UserService();

  beforeEach(() => {
    userService = new UserService();
  });

  describe('POST /api/user/register', () => {
    it('should register a new user', async () => {
      (userService.checkUserExists as jest.Mock).mockResolvedValue(false);
      (userService.hashPassword as jest.Mock).mockResolvedValue('hashedPassword');
      (userService.generateEmailVerificationToken as jest.Mock).mockReturnValue('verificationToken');
      (User.create as jest.Mock).mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
        role: 'user',
        isActive: true,
      });

      const response = await request(app)
        .post('/api/user/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
          role: 'user',
          isActive: true
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        verificationToken: 'verificationToken',
        newUser: {
          id: 1,
          email: 'test@example.com',
          password: 'hashedPassword',
          name: 'Test User',
          role: 'user',
          isActive: true,
        },
      });
    });

    it('should return 400 if user already exists', async () => {
      (userService.checkUserExists as jest.Mock).mockResolvedValue(true);
      (userController.register as jest.Mock).mockImplementation(async () => {
        throw new Error('User already exists');
      });

      const response = await request(app)
        .post('/api/user/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
          role: 'user',
          isActive: true,
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: 'User already exists',
      });
    });
  });

  describe('GET /api/user', () => {
    it('should return all users', async () => {
      const mockUsers = [
        {
          id: 1,
          email: 'test1@example.com',
          password: 'hashedPassword1',
          name: 'Test User 1',
          role: 'user',
          isActive: true,
        },
        {
          id: 2,
          email: 'test2@example.com',
          password: 'hashedPassword2',
          name: 'Test User 2',
          role: 'admin',
          isActive: true,
        },
      ];

      (userController.getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

      const response = await request(app).get('/api/user');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
    });

    it('should return 500 if there is an error fetching users', async () => {
      jest.spyOn(userController, 'getAllUsers').mockRejectedValue(new Error('Error fetching users'));

      const response = await request(app).get('/api/user');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        message: 'Error fetching users',
      });
    });
  });
});