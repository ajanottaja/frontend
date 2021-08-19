import { Auth0ContextInterface, GetTokenSilentlyOptions, User } from "@auth0/auth0-react";
import { Struct } from "superstruct";
import useSWR, { SWRResponse } from "swr";

type GetAccessTokenSilently = (opts?: GetTokenSilentlyOptions) => Promise<string>;

export interface ApiResponse {
  status: number;
  body: any;
}


interface FetchJsonArgs {
  getAccessTokenSilently: GetAccessTokenSilently;
  opts: RequestInit;
  schema: Struct<any>
}

export const fetchJson = ({getAccessTokenSilently, opts, schema}: FetchJsonArgs) => async <T>(
  url: string,
): Promise<T> => {
  try {
    const token = await getAccessTokenSilently();

    const response = await fetch(url, {
      ...opts,
      headers: { "Accept": "application/json", "Authorization": `Bearer ${token}`, ...opts.headers?? {} },
      method: opts.method ?? "get"
    });

    const body = await response.json();



    return { status: response.status, body } as unknown as T;

  } catch (error) {
    throw error;
  }
}

interface useSwrWithAuth0Args {
  url: string;
  opts: RequestInit;
  auth0: Auth0ContextInterface<User>;
  schema: Struct<any>
}

export const useSwrWithAuth0 = <T>({url, opts = {}, auth0, schema}: useSwrWithAuth0Args): SWRResponse<T, Error> => {
  const { isLoading, isAuthenticated, getAccessTokenSilently } = auth0;
   
  // If Auth0 is still loading or user is not authenticated we make the operation no-op via null url
  const shouldFetch = !isLoading && isAuthenticated;

  return useSWR<T, Error>(
    shouldFetch ? [url] : null,
    fetchJson({getAccessTokenSilently, opts, schema}),
    {
      suspense: true,
      errorRetryCount: 3,
      shouldRetryOnError: false,

    }
  );

}