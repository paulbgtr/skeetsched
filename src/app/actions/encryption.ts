import CryptoJS from "crypto-js";

const secretKey = "secret";

export const encrypt = (token: string) => {
  const encrypted = CryptoJS.AES.encrypt(token, secretKey).toString();
  return encrypted;
};

export const decrypt = (encryptedData: string) => {
  const decrypted = CryptoJS.AES.decrypt(encryptedData, secretKey).toString(
    CryptoJS.enc.Utf8
  );
  return decrypted;
};
