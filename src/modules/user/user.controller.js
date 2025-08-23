import { Router } from "express";
import * as userService from "../user/user.service.js";
import { authMiddleware } from "../../middlewares/auth/auth.middlerware.js";

const userRouter = Router();

userRouter.patch("/",authMiddleware, userService.updateUserProfile);
userRouter.delete('/',authMiddleware,userService.deleteUser);
userRouter.get('/',authMiddleware,userService.getLoggedUser);


export default userRouter;
