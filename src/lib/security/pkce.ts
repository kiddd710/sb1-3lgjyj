import { v4 as uuidv4 } from 'uuid';

function base64URLEncode(str: string): string {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

async function sha256(plain: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return await crypto.subtle.digest('SHA-256', data);
}

function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach(byte => binary += String.fromCharCode(byte));
  return base64URLEncode(binary);
}

export async function generatePKCEChallenge(): Promise<{ codeVerifier: string; codeChallenge: string }> {
  const codeVerifier = base64URLEncode(uuidv4() + uuidv4());
  const codeChallengeBuffer = await sha256(codeVerifier);
  const codeChallenge = arrayBufferToBase64Url(codeChallengeBuffer);
  
  return { codeVerifier, codeChallenge };
}