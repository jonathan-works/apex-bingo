const CRYPTO_KEY = 'your-secret-key';

export const cryptoService = {
  encrypt(text: string): string {
    return window.btoa(text); // Para exemplo, usando base64. Em produção, use uma criptografia mais robusta
  },

  decrypt(encryptedText: string): string {
    return window.atob(encryptedText);
  }
};
