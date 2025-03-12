const CRYPTO_KEY = 'your-secret-key';

export const cryptoService = {
  encrypt(text: string): string {
    return window.btoa(text);
  },

  decrypt(encryptedText: string): string {
    return window.atob(encryptedText);
  }
};
