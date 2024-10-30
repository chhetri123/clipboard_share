import crypto from "crypto";
let MESSAGE_ENC_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

// The key must be exactly 32 bytes (256 bits) for aes-256-cbc
const getEncryptionKey = (key) => {
  // If the key is provided as a string, hash it to ensure correct length
  if (!key || typeof key !== "string") {
    throw new Error("Encryption key must be provided in environment variables");
  }
  return crypto
    .createHash("sha256")
    .update(String(key))
    .digest("base64")
    .substr(0, 32);
};

const IV_LENGTH = 16; // For AES, this is always 16

export const encrypt = (text) => {
  try {
    if (!text) {
      throw new Error("Text to encrypt must be provided");
    }

    // Generate encryption key from environment variable
    const ENCRYPTION_KEY = getEncryptionKey(MESSAGE_ENC_KEY);

    // Generate random IV
    const iv = crypto.randomBytes(IV_LENGTH);

    // Create cipher with key and IV
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(ENCRYPTION_KEY),
      iv
    );

    // Convert the text to Buffer if it's not already
    const textBuffer = Buffer.from(String(text), "utf8");

    // Encrypt the text
    let encrypted = cipher.update(textBuffer);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    // Return IV and encrypted data as hex strings
    return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt data");
  }
};

export const decrypt = (encryptedText) => {
  try {
    if (!encryptedText) {
      throw new Error("Encrypted text must be provided");
    }

    // Generate encryption key from environment variable
    const ENCRYPTION_KEY = getEncryptionKey(MESSAGE_ENC_KEY);

    // Split IV and encrypted text
    const [ivHex, encryptedHex] = encryptedText.split(":");

    if (!ivHex || !encryptedHex) {
      throw new Error("Invalid encrypted text format");
    }

    // Convert hex strings to buffers
    const iv = Buffer.from(ivHex, "hex");
    const encryptedBuffer = Buffer.from(encryptedHex, "hex");

    // Create decipher
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(ENCRYPTION_KEY),
      iv
    );

    // Decrypt the text
    let decrypted = decipher.update(encryptedBuffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    // Convert decrypted buffer to string
    return decrypted.toString("utf8");
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt data");
  }
};
