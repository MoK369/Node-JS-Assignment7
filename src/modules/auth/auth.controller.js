import { Router } from "express";
import * as authService from "../auth/auth.service.js";

const authRouter = Router();

authRouter.post('/signup',authService.signup);
authRouter.post('/login',authService.login);

export default authRouter;