import { Router} from "express";
import { registerHandler, getAllUsersHandler} from "../handlers/userHandler";

const userRouter = Router();
/**
 * @swagger
 * /api/user:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user data
 *     responses:
 *       '200':
 *         description: User data retrieved successfully
 *       '400':
 *         description: Bad request, invalid parameters
 *       '401':
 *         description: Unauthorized, invalid or missing token
 *     security:
 *       - bearerAuth: []
 *   put:
 *     tags:
 *       - User
 *     summary: Update user data
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: User data updated successfully
 *       '400':
 *         description: Bad request, invalid input
 *       '404':
 *         description: Not found, user does not exist
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     tags:
 *       - User
 *     summary: Delete a user
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *       '400':
 *         description: Bad request, invalid parameters
 *       '404':
 *         description: Not found, user does not exist
 *     security:
 *       - bearerAuth: []
 * /api/user/register:
 *   post:
 *     tags:
 *       - User
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       '201':
 *         description: User registered successfully
 *       '400':
 *         description: Bad request, invalid parameters
 *       '409':
 *         description: Conflict, user already exists
 */

userRouter.get('/', getAllUsersHandler);

userRouter.post('/register', registerHandler);

userRouter.put("/", (_req, res) => {
  res.send("Hello from put user router");
});

userRouter.delete("/", (_req, res) => {
  res.send("Hello from delete user router");
});

export default userRouter;