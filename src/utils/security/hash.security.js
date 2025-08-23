import bcrypt from "bcryptjs";

export function hashData({
  password = '',
  roundNum = process.env.ROUND_NUM,
} = {}) {
  const salt = bcrypt.genSaltSync(Number(roundNum));
  return bcrypt.hashSync(password, salt);
}

export function compareHashedData({ data, hashedData }) {
  return bcrypt.compareSync(data, hashedData);
}
