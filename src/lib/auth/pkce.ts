import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';

export class PKCEManager {
  private static readonly VERIFIER_KEY = 'pkce_verifier';
  private static readonly CHALLENGE_KEY = 'pkce_challenge';

  static generateVerifier(): string {
    const buffer = new Uint8Array(32);
    crypto.getRandomValues(buffer);
    const verifier = Array.from(buffer)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    sessionStorage.setItem(this.VERIFIER_KEY, verifier);
    return verifier;
  }

  static async generateChallenge(verifier: string): Promise<string> {
    const hash = CryptoJS.SHA256(verifier);
    const challenge = hash.toString(CryptoJS.enc.Base64)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    sessionStorage.setItem(this.CHALLENGE_KEY, challenge);
    return challenge;
  }

  static getStoredVerifier(): string | null {
    return sessionStorage.getItem(this.VERIFIER_KEY);
  }

  static getStoredChallenge(): string | null {
    return sessionStorage.getItem(this.CHALLENGE_KEY);
  }

  static clearPKCE(): void {
    sessionStorage.removeItem(this.VERIFIER_KEY);
    sessionStorage.removeItem(this.CHALLENGE_KEY);
  }
}