import UserModel from "../../db/models/user.model.js";
import { CustomError } from "../../utils/custom/custom_error_class.js";
import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";

export const updateUserProfile = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new CustomError("authorization is messing!", 403);
    }
    const payload = jwt.verify(token, "3659a8e88df8a6cb");

    const user = await UserModel.findById(payload._id);
    if (!user) {
      throw new CustomError("user is not found", 404);
    }

    const body = req.body || {};
    const updateQueryObject = {};
    if (body.name) updateQueryObject.name = body.name;
    if (body.email) updateQueryObject.email = body.email;
    if (body.phone) updateQueryObject.phone = body.phone;
    if (body.age) updateQueryObject.age = body.age;

    if (updateQueryObject.email) {
      const user = await UserModel.findOne({ email: updateQueryObject.email });
      if (user) {
        throw new CustomError("email already exists", 409);
      }
    }
    console.log({ phone: updateQueryObject.phone });

    if (updateQueryObject.phone) {
      updateQueryObject.phone = CryptoJS.AES.encrypt(
        updateQueryObject.phone,
        "8e47dcd5"
      ).toString();
    }
    if (!Object.keys(updateQueryObject).length) {
      throw new CustomError("nothing to update", 400);
    }
    const result = await UserModel.updateOne(
      { _id: payload._id },
      updateQueryObject
    );
    return res.json({ message: "user updated!" });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new CustomError("authorization is messing!", 403);
    }
    const payload = jwt.verify(token, "3659a8e88df8a6cb");

    const user = await UserModel.findById(payload._id);
    if (!user) {
      throw new CustomError("user is not found", 404);
    }

    const result = await UserModel.deleteOne({ _id: payload._id });
    return res.json({ message: "user deleted!" });
  } catch (error) {
    next(error);
  }
};
