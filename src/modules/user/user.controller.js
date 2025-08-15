import { Router } from "express";
import * as userService from "../user/user.service.js";

const userRouter = Router();

userRouter.patch("/", userService.updateUserProfile);
userRouter.delete('/',userService.deleteUser);


export default userRouter;
