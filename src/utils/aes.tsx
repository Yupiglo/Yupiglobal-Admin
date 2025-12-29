import crypto from "crypto";

interface CryptoConfig {
  secretKey: string;
  secretIv: string;
  encryptionMethod: string;
}

const generateKey = (secretKey: string, extraKey = "") => {
  const fullKey = secretKey + extraKey;
  return crypto
    .createHash("sha512")
    .update(fullKey)
    .digest("hex")
    .substring(0, 32);
};

const getEncryptionIv = (secretIv: string) => {
  const encryptionIv = crypto
    .createHash("sha512")
    .update(secretIv)
    .digest("hex")
    .substring(0, 16);
  return encryptionIv;
};

// Encrypt data
export const encrypt = (
  text: string,
  cryptoConfig: CryptoConfig,
  extraKey: string = ""
): string => {
  const { secretKey, secretIv, encryptionMethod } = cryptoConfig;
  const key = generateKey(atob(secretKey), extraKey);
  const cipher = crypto.createCipheriv(
    atob(encryptionMethod),
    key,
    getEncryptionIv(atob(secretIv))
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return Buffer.from(encrypted, "hex").toString("base64");
};

// Decrypt data
export const decrypt = (
  encryptedText: string,
  cryptoConfig: CryptoConfig,
  extraKey: string = ""
): string => {
  const { secretKey, secretIv, encryptionMethod } = cryptoConfig;
  const key = generateKey(atob(secretKey), extraKey);
  const encryptedBuffer = Buffer.from(encryptedText, "base64").toString("hex");
  const decipher = crypto.createDecipheriv(
    atob(encryptionMethod),
    key,
    getEncryptionIv(atob(secretIv))
  );
  let decrypted = decipher.update(encryptedBuffer, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};