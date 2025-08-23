// @ts-check
import UserModel from "../../db/models/user.model.js";
import { CustomError } from "../../utils/custom/custom_error_class.js";
import {
  AesDecrypt,
  AesEncrypt,
} from "../../utils/security/encryption.security.js";
import asyncHandler from "../../utils/handlers/async_handler.js";

export const updateUserProfile = asyncHandler(async (req, res, next) => {
  let { name, email, phone, age } = req.body || {};

  if (email) {
    const user = await UserModel.findOne({ email: email });
    if (user) {
      throw new CustomError("email already exists", 409);
    }
  }
  console.log({ name });

  console.log({ phone: phone });

  if (phone) {
    phone = AesEncrypt({
      dataToEncrypt: phone,
    }).toString();
  }
  if (!name && !email && !phone && !age) {
    throw new CustomError("nothing to update", 400);
  }
  await UserModel.updateOne(
    { _id: req.user._id },
    { name, email, phone, age },
    {
      runValidators: true,
    }
  );
  return res.json({ success: true, message: "user updated!" });
});

export const deleteUser = asyncHandler(async (req, res, next) => {
  await UserModel.deleteOne({ _id: req.user._id });
  return res.json({ success: true, message: "user deleted!" });
});

export const getLoggedUser = asyncHandler(async (req, res, next) => {
  const user = req.user.toObject();
  user.phone = AesDecrypt({ encryptedData: user.phone });
  delete user.password;
  return res.json({ success: true, body: user });
});
