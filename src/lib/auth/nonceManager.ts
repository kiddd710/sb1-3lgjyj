import { v4 as uuidv4 } from 'uuid';

const NONCE_KEY = 'auth_nonce';
const NONCE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

interface StoredNonce {
  value: string;
  timestamp: number;
}

export class NonceManager {
  private static cleanupExpiredNonces() {
    const now = Date.now();
    const storedNonces = this.getAllNonces();
    
    const validNonces = storedNonces.filter(nonce => 
      now - nonce.timestamp < NONCE_TIMEOUT
    );

    sessionStorage.setItem(NONCE_KEY, JSON.stringify(validNonces));
  }

  private static getAllNonces(): StoredNonce[] {
    try {
      const stored = sessionStorage.getItem(NONCE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static generateNonce(): string {
    this.cleanupExpiredNonces();
    
    const nonce = uuidv4();
    const storedNonces = this.getAllNonces();
    
    storedNonces.push({
      value: nonce,
      timestamp: Date.now()
    });
    
    sessionStorage.setItem(NONCE_KEY, JSON.stringify(storedNonces));
    return nonce;
  }

  static validateNonce(nonce: string): boolean {
    if (!nonce) return false;
    
    this.cleanupExpiredNonces();
    const storedNonces = this.getAllNonces();
    
    const nonceIndex = storedNonces.findIndex(n => n.value === nonce);
    if (nonceIndex === -1) return false;
    
    // Remove used nonce
    storedNonces.splice(nonceIndex, 1);
    sessionStorage.setItem(NONCE_KEY, JSON.stringify(storedNonces));
    
    return true;
  }

  static clearNonces(): void {
    sessionStorage.removeItem(NONCE_KEY);
  }
}