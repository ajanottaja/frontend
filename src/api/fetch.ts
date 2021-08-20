import {
  Auth0ContextInterface,
  GetTokenSilentlyOptions,
  User,
} from "@auth0/auth0-react";
import { create, Struct } from "superstruct";
import useSWR, { SWRResponse } from "swr";

type GetAccessTokenSilently = (
  opts?: GetTokenSilentlyOptions
) => Promise<string>;

export interface ApiResponse {
  status: number;
  body: any;
}

interface HttpPostArgs<Req, Res> {
  url: string;
  getAccessTokenSilently: GetAccessTokenSilently;
  params: Req;
  requestSchema?: Struct<Req>;
  responseSchema: Struct<Res>;
}

export const httpPost = async <Req, Res>({
  url,
  getAccessTokenSilently,
  params,
  requestSchema,
  responseSchema,
}: HttpPostArgs<Req, Res>) => {
  try {
    const token = await getAccessTokenSilently();
    const opts: RequestInit = {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "post",
    };

    if (requestSchema && params) {
      opts.body = JSON.stringify(create(params, requestSchema));
    }

    const response = await fetch(url, opts);
    const res = { status: response.status, body: response.body ? await response.json() : {}};
    return create(res, responseSchema);
  } catch (error) {
    throw error;
  }
};

interface HttpGetArgs<Req, Res> {
  url: string;
  getAccessTokenSilently: GetAccessTokenSilently;
  params?: Req;
  requestSchema?: Struct<Req>;
  responseSchema: Struct<Res>;
}

export const httpGet = async <Req, Res>({
  url: baseUrl,
  getAccessTokenSilently,
  params,
  requestSchema,
  responseSchema,
}: HttpGetArgs<Req, Res>) => {
  try {
    const token = await getAccessTokenSilently();
    const opts: RequestInit = {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "get",
    };

    const url = new URL(baseUrl);

    if (requestSchema && params) {
      const queryParams = create(params, requestSchema);
      url.search = new URLSearchParams(queryParams as any).toString();
    }

    const response = await fetch(url.toString(), opts);
    const res = { status: response.status, body: response.body ? await response.json() : {}};
    return create(res, responseSchema);

  } catch (error) {
    throw error;
  }
};

export const swrFetcher =
  <Req, Res>(args: Omit<HttpGetArgs<Req, Res>, "url">) =>
  async (url: string) => {
    return await httpGet({ url, ...args });
  };

type UseSwrWithAuth0<Req, Res> = Omit<
  HttpGetArgs<Req, Res>,
  "getAccessTokenSilently"
> & {
  auth0: Auth0ContextInterface<User>;
};

export const useSwrWithAuth0 = <Req, Res>({
  auth0,
  url,
  ...args
}: UseSwrWithAuth0<Req, Res>): SWRResponse<Res, Error> => {
  const { isLoading, isAuthenticated, getAccessTokenSilently } = auth0;

  // If Auth0 is still loading or user is not authenticated we make the operation no-op via null url
  const shouldFetch = !isLoading && isAuthenticated;

  return useSWR<Res, Error>(
    shouldFetch ? [url] : null,
    swrFetcher<Req, Res>({ getAccessTokenSilently, ...args }),
    {
      suspense: true,
      errorRetryCount: 3,
      shouldRetryOnError: false,
    }
  );
};
