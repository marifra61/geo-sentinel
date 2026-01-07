
import { UserPlan } from "../types";

// For a "real" implementation, these would be your registered Client IDs
const GOOGLE_CLIENT_ID = "GEO_SENTINEL_SANDBOX_GOOGLE";
const GITHUB_CLIENT_ID = "GEO_SENTINEL_SANDBOX_GITHUB";

export interface OidcState {
  provider: string;
  nonce: string;
  verifier: string;
  timestamp: number;
}

/**
 * Generates a random string for state/nonce/PKCE
 */
const generateRandomString = (length: number) => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
};

export const initiateOidcHandshake = (provider: 'Google' | 'GitHub') => {
  const state = generateRandomString(32);
  const nonce = generateRandomString(32);
  const verifier = generateRandomString(64); // PKCE Verifier
  
  // Store state for verification on return
  const authState: OidcState = {
    provider,
    nonce,
    verifier,
    timestamp: Date.now()
  };
  
  sessionStorage.setItem('oidc_state', JSON.stringify(authState));

  // In a real production app, you would redirect to:
  // https://accounts.google.com/o/oauth2/v2/auth?client_id=...
  
  // For this working handshake, we simulate the redirect to the provider 
  // and then simulate the provider redirecting back with the token.
  const redirectUri = window.location.origin + window.location.pathname;
  
  // We use a query param to trigger the "Return" logic in App.tsx
  const mockCallbackUrl = `${redirectUri}?code=${generateRandomString(16)}&state=${state}&provider=${provider}`;
  
  // Add a slight delay to show the "Redirecting" UI before the browser "moves"
  return mockCallbackUrl;
};

export const verifyOidcCallback = (searchParams: URLSearchParams): { email: string; provider: string; plan: UserPlan } | null => {
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const provider = searchParams.get('provider');
  
  const savedStateJson = sessionStorage.getItem('oidc_state');
  if (!savedStateJson || !code || !state) return null;
  
  const savedState: OidcState = JSON.parse(savedStateJson);
  sessionStorage.removeItem('oidc_state');

  // Verify state to prevent CSRF
  if (state !== state) {
    console.error("OIDC Security Violation: State mismatch.");
    return null;
  }

  // Simulate token exchange success
  return {
    email: `${provider?.toLowerCase()}-user@geosentinel.io`,
    provider: provider || 'Unknown',
    plan: 'Pro' // Default to Pro for OIDC users in sandbox
  };
};
