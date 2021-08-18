// Gather relevant config in this file to make it easy to grok

export const auth0 = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  redirectUri: window.location.origin,
  audience: import.meta.env.VITE_AUTH0_AUDIENCE,
};

// The host domain, e.g. api.ajanottaja.app
export const apiHost = import.meta.env.VITE_API_URL;