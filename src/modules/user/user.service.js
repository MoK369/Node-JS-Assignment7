import UserModel from "../../db/models/user.model.js";
import { CustomError } from "../../utils/custom/custom_error_class.js";
import {
  AesDecrypt,
  AesEncrypt,
} from "../../utils/security/encryption.security.js";
import asyncHandler from "../../utils/handlers/async_handler.js";

export const updateUserProfile = asyncHandler(async (req, res, next) => {
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
    updateQueryObject.phone = AesEncrypt({
      dataToEncrypt: updateQueryObject.phone,
    }).toString();
  }
  if (!Object.keys(updateQueryObject).length) {
    throw new CustomError("nothing to update", 400);
  }
 await UserModel.updateOne(
    { _id: req.user._id },
    updateQueryObject,
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
