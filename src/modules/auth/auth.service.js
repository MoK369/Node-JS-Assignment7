// @ts-check
import UserModel from "../../db/models/user.model.js";
import bcrypt from "bcryptjs";
import { CustomError } from "../../utils/custom/custom_error_class.js";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  try {
    const body = req.body;
    if (!body.password) {
      throw new CustomError("Validation Error: password field is required");
    }
    body.password = bcrypt.hashSync(body.password, 10);
    body.phone = CryptoJS.AES.encrypt(body.phone, "8e47dcd5");

    const result = await UserModel.create([req.body]);
    console.log(result);

    return res
      .status(201)
      .json({ success: true, message: "User created Successfully!" });
  } catch (error) {
    console.log({ error });

    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!password || !email) {
      throw new CustomError(
        `Validation Error: ${!email ? "email field is required," : ""} ${
          !password ? "password field is required" : ""
        }`
      );
    }
    let user = await UserModel.findOne({ email });
    // @ts-ignore
    user = user?.toObject();
    if (!user) {
      throw new CustomError("Wrong email or password!");
    }
    const passwordResult = bcrypt.compareSync(password, user.password);
    if (!passwordResult) {
      throw new CustomError("Wrong email or password!");
    }

    const token = jwt.sign({ _id: user._id }, "3659a8e88df8a6cb", {
      expiresIn: 60 * 60,
    });

    const phoneBytes = CryptoJS.AES.decrypt(user.phone, "8e47dcd5");
    user.phone = phoneBytes.toString(CryptoJS.enc.Utf8);
    // @ts-ignore
    delete user.password;
    return res.json({
      success: true,
      message: "Logged in Successfully!",
      body: {
        token,
        user,
      },
    });
  } catch (error) {
    console.log({ error });

    next(error);
  }
};
