import jwt from "jsonwebtoken";

export function generateToken({
  payload = {},
  secretKey = process.env.ACCESS_TOKEN_KEY,
  options = {
    expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN),
  },
} = {}) {
  return jwt.sign(payload, secretKey, options);
}

export function verifyToken({
  token,
  secretKey = process.env.ACCESS_TOKEN_KEY,
}) {
  return jwt.verify(token, secretKey);
}
