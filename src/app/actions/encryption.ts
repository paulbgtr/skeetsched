import crypto, { type CipherGCMTypes } from "crypto";

const algorithm: CipherGCMTypes = "aes-256-gcm";
const secretKey = "secret"; // TODO: move to env

export const encrypt = (token: string) => {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(token, "utf8", "hex");
  encrypted += cipher.final("hex");
  return {
    iv: iv.toString("hex"),
    encryptedData: encrypted,
    tag: cipher.getAuthTag().toString("hex"),
  };
};

export const decrypt = (encryptedData: {
  iv: string;
  encryptedData: string;
  tag: string;
}) => {
  const iv = Buffer.from(encryptedData.iv, "hex");
  const tag = Buffer.from(encryptedData.tag, "hex");
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(encryptedData.encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};
