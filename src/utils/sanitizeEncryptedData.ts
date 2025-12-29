
// Function to sanitize encrypted data by removing unwanted characters before decryption
export function sanitizeEncryptedData(encryptedData: string): string {
  // Define the unwanted characters to remove, e.g., <, >, /
  const unwantedCharacters = /[<>/{}()?]/g;
  const replacement = ""; // Replace with an empty string

  // Sanitize input data
  const sanitizedData = encryptedData.replace(unwantedCharacters, replacement);

  return sanitizedData;
}
