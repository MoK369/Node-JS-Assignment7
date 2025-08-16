import CryptoJS from "crypto-js";

export function AesEncrypt({
  dataToEncrypt,
  secretKey = process.env.ENCRYPTION_KEY,
}) {
  return CryptoJS.AES.encrypt(dataToEncrypt, secretKey);
}

export function AesDecrypt({
  encryptedData,
  secretKey = process.env.ENCRYPTION_KEY,
}) {
  const dataBytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  return dataBytes.toString(CryptoJS.enc.Utf8);
}
