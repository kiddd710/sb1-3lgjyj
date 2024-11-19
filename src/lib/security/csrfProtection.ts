import { v4 as uuidv4 } from 'uuid';

const CSRF_TOKEN_KEY = 'csrf_token';
const CSRF_HEADER = 'X-CSRF-Token';

export class CsrfProtection {
  static generateToken(): string {
    const token = uuidv4();
    sessionStorage.setItem(CSRF_TOKEN_KEY, token);
    return token;
  }

  static validateToken(token: string): boolean {
    const storedToken = sessionStorage.getItem(CSRF_TOKEN_KEY);
    return storedToken === token;
  }

  static getRequestHeaders(): Headers {
    const headers = new Headers();
    const token = sessionStorage.getItem(CSRF_TOKEN_KEY);
    if (token) {
      headers.append(CSRF_HEADER, token);
    }
    return headers;
  }

  static clearToken(): void {
    sessionStorage.removeItem(CSRF_TOKEN_KEY);
  }
}