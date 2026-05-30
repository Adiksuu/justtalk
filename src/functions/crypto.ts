import CryptoJS from 'crypto-js';

export const encryptMessage = (text: string, secretKey: string): string => {
  try {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
  } catch (error) {
    console.error('Error encrypting message:', error);
    return text;
  }
};
export const decryptMessage = (cipherText: string, secretKey: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    
    return decryptedText || cipherText;
  } catch (error) {
    console.error('Error decrypting message:', error);
    return cipherText;
  }
};