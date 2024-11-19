import { v4 as uuidv4 } from 'uuid';

interface SessionData {
  id: string;
  userId: string;
  expiresAt: number;
  lastActivity: number;
}

const SESSION_KEY = 'app_session';
const SESSION_DURATION = 3600000; // 1 hour
const ACTIVITY_THRESHOLD = 300000; // 5 minutes

export class SessionManager {
  static initSession(userId: string): string {
    const sessionId = uuidv4();
    const session: SessionData = {
      id: sessionId,
      userId,
      expiresAt: Date.now() + SESSION_DURATION,
      lastActivity: Date.now()
    };
    
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return sessionId;
  }

  static validateSession(): boolean {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (!stored) return false;

      const session: SessionData = JSON.parse(stored);
      const now = Date.now();

      if (now > session.expiresAt) {
        this.clearSession();
        return false;
      }

      if (now - session.lastActivity > ACTIVITY_THRESHOLD) {
        session.lastActivity = now;
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      }

      return true;
    } catch {
      return false;
    }
  }

  static clearSession(): void {
    sessionStorage.removeItem(SESSION_KEY);
  }
}