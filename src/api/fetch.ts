import { Auth0ContextInterface, User } from "@auth0/auth0-react";
import useSWR from "swr";

interface OkResult<Response> {
  status: number;
  body: Response;
}

interface FetchJson {
  url: string,
  opts: RequestInit,
  getAccessTokenSilently: () => Promise<string>
}

export const fetchJson = async <Response>({url, opts, getAccessTokenSilently}: FetchJson): Promise<OkResult<Response>>  => {
  try {
    
    const token = await getAccessTokenSilently();

    const response = await fetch(url, {
      ...opts,
      headers: { "Accept": "application/json", "Authorization": `Bearer ${token}`, ...opts.headers?? {} },
      method: opts.method ?? "get"
    });

    const body = await response.json();

    return { status: response.status, body };

  } catch (error) {
    throw error;
  }
}

export const useSwrWithAuth0 = (url: string, opts: RequestInit, auth0: Auth0ContextInterface<User>) => {
  const { isLoading, isAuthenticated, getAccessTokenSilently } = auth0;
  
  // If Auth0 is still loading or user is not authenticated we make the operation no-op via null url
  const maybeUrl = isLoading || !isAuthenticated ? null : url;

  return useSWR(
    [url],
    async (url) => {
      const accessToken = await getAccessTokenSilently({
        audience: "https://api.ajanottaja.app",
      });

      const res = await fetch(url, {
        headers: { authorization: `Bearer ${accessToken}` },
      });

      if (res.status === 200 || res.status === 404) {
        return { status: res.status, body: await res.json() };
      }

      throw Error("Failed to get active interval");
    },
    {
      suspense: true,
    }
  );

}