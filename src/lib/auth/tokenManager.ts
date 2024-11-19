interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

const TOKEN_KEY = 'auth_tokens';

export class TokenManager {
  static storeTokens(accessToken: string, refreshToken: string, expiresIn: number): void {
    const tokenData: TokenData = {
      accessToken,
      refreshToken,
      expiresAt: Date.now() + (expiresIn * 1000)
    };
    
    sessionStorage.setItem(TOKEN_KEY, JSON.stringify(tokenData));
  }

  static getTokens(): TokenData | null {
    try {
      const stored = sessionStorage.getItem(TOKEN_KEY);
      if (!stored) return null;

      const tokens: TokenData = JSON.parse(stored);
      if (Date.now() > tokens.expiresAt) {
        this.clearTokens();
        return null;
      }

      return tokens;
    } catch {
      return null;
    }
  }

  static clearTokens(): void {
    sessionStorage.removeItem(TOKEN_KEY);
  }
}