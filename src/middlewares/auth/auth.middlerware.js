// @ts-check
import UserModel from "../../db/models/user.model.js";
import { CustomError } from "../../utils/custom/custom_error_class.js";
import { verifyToken } from "../../utils/security/token.security.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new CustomError("authorization is messing!", 403);
    }
    const payload = verifyToken({ token});

    // @ts-ignore
    if (!payload?._id) {
      throw new CustomError("invalid token", 400);
    }

    // @ts-ignore
    const user = await UserModel.findById(payload._id);
    if (!user) {
      throw new CustomError("user is not found", 404);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
