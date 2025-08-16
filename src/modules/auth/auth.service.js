// @ts-check
import UserModel from "../../db/models/user.model.js";
import { CustomError } from "../../utils/custom/custom_error_class.js";
import * as hashing from "../../utils/security/hash.security.js";
import * as encryption from "../../utils/security/encryption.security.js";
import { generateToken } from "../../utils/security/token.security.js";

export const signup = async (req, res, next) => {
  try {
    const body = req.body;
    if (!body.password) {
      throw new CustomError("Validation Error: password field is required");
    }
    body.password = hashing.hashData({ password: body.password });
    body.phone = encryption.AesEncrypt({
      dataToEncrypt: body.phone,
    });

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
    const passwordResult = hashing.compareHashedData({
      data: password,
      hashedData: user.password,
    });
    if (!passwordResult) {
      throw new CustomError("Wrong email or password!");
    }

    const token = generateToken({
      payload: { _id: user._id },
    });

    user.phone = encryption.AesDecrypt({
      encryptedData: user.phone,
    });
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
