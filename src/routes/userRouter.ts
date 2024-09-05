import { Router, Request, Response, NextFunction } from "express";
import { userController } from "../controllers/userController";
import { UserHandler } from "../handlers/userHandler";
import { body, validationResult } from 'express-validator';

const userRouter = Router();
const userHandler = new UserHandler(userController);

// Middleware de validación de datos
const validateRegister = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('name').notEmpty().withMessage('Name is required'),
    body('role').notEmpty().withMessage('Role is required'),
    body('isActive').isBoolean().withMessage('isActive must be a boolean'),
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        return next(); // Asegúrate de que siempre se devuelve un valor
    }
];

userRouter.get("/", userHandler.getAllUsersHandler);
userRouter.post("/register", validateRegister, userHandler.registerHandler);

export default userRouter;