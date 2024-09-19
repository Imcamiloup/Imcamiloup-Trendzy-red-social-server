import { Router } from "express";
import { userController } from "../controllers/userController";
import { UserHandler } from "../handlers/userHandler";
import validateRegister from "../validations/registerValidations";

const userRouter = Router();
const userHandler = new UserHandler(userController);

// Middleware de validación de datos

userRouter.get("/", userHandler.getAllUsersHandler);
userRouter.post("/register", validateRegister, userHandler.registerHandler);
userRouter.post("/login", userHandler.loginHandler);
export default userRouter;
