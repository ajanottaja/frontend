import {
  Auth0ContextInterface,
  GetTokenSilentlyOptions,
  User,
} from "@auth0/auth0-react";
import { create, Struct } from "superstruct";
import useSWR, { SWRResponse } from "swr";
import { PublicConfiguration } from "swr/dist/types";


function constructPath<P>(path: string, params: P) {
  let currPath = path;
  Object.entries(params).forEach(([k, v]) => {
    currPath = currPath.replace(`:${k}`, encodeURIComponent(v));
  });
  return currPath;
}


type GetAccessTokenSilently = (
  opts?: GetTokenSilentlyOptions
) => Promise<string>;

export interface ApiResponse {
  status: number;
  body: any;
}


interface ApiSchemaValue<P> {
  schema: Struct<P>;
  value: P;
}

interface HttpArgs<Path, Query, Body, Response> {
  url: string;
  getAccessTokenSilently: GetAccessTokenSilently;
  path?: ApiSchemaValue<Path>;
  query?: ApiSchemaValue<Query>;
  body?: ApiSchemaValue<Body>;
  responseSchema: Struct<Response>;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
}

export const http = async <Path, Query, Body, Response>({
  url: baseUrl,
  getAccessTokenSilently,
  path,
  query,
  body,
  responseSchema,
  method,
}: HttpArgs<Path, Query, Body, Response>) => {
  try {
    const token = await getAccessTokenSilently();
    const opts: RequestInit = {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method,
    };

    let url = new URL(baseUrl);

    if (path) {
      const params = create(path.value, path.schema);
      url.pathname = constructPath(url.pathname, params);
    }

    if (query) {
      const queryParams = create(query.value, query.schema);
      url.search = new URLSearchParams(queryParams as any).toString();
    }

    if (body) {
      opts.body = JSON.stringify(create(body.value, body.schema));
    }

    const response = await fetch(url.toString(), opts);
    const res = {
      status: response.status,
      body: response.body ? await response.json() : {},
    };
    return create(res, responseSchema);
  } catch (error) {
    throw error;
  }
};

type HttpMethodArgs<Path, Query, Body, Response> = Omit<HttpArgs<Path, Query, Body, Response>, "method">;

export const httpGet = async <Path, Query, Body, Response>(args: HttpMethodArgs<Path, Query, Body, Response>) => {
  return http({...args, method: "GET"});
}

export const httpPost = async <Path, Query, Body, Response>(args: HttpMethodArgs<Path, Query, Body, Response>) => {
  return http({...args, method: "POST"});
}

export const httpPatch = async <Path, Query, Body, Response>(args: HttpMethodArgs<Path, Query, Body, Response>) => {
  return http({...args, method: "PATCH"});
}

export const httpPut = async <Path, Query, Body, Response>(args: HttpMethodArgs<Path, Query, Body, Response>) => {
  return http({...args, method: "PUT"});
}

export const httpDelete = async <Path, Query, Body, Response>(args: HttpMethodArgs<Path, Query, Body, Response>) => {
  return http({...args, method: "DELETE"});
}

export const swrFetcher =
  <Path, Query, Body, Response>(args: Omit<HttpMethodArgs<Path, Query, Body, Response>, "url">) =>
  async (url: string) => {
    return await httpGet({ url, ...args });
  };

type UseSwrWithAuth0<Path, Query, Body, Response> = Omit<HttpMethodArgs<Path, Query, Body, Response>,
  "getAccessTokenSilently"
> & {
  auth0: Auth0ContextInterface<User>;
};

export const useSwrWithAuth0 = <Path, Query, Body, Response>(
  { auth0, url, ...args }: UseSwrWithAuth0<Path, Query, Body, Response>,
  swrOpts: Partial<PublicConfiguration>| undefined = {}
): SWRResponse<Response, Error> => {
  const { isLoading, isAuthenticated, getAccessTokenSilently } = auth0;

  // If Auth0 is still loading or user is not authenticated we make the operation no-op via null url
  const shouldFetch = !isLoading && isAuthenticated;

  return useSWR<Response, Error>(
    shouldFetch ? [url, JSON.stringify({...args.path?.value, ...args.query?.value}), auth0.user?.email?? ''] : null,
    swrFetcher<Path, Query, Body, Response>({ getAccessTokenSilently, ...args }),
    {
      suspense: true,
      errorRetryCount: 3,
      shouldRetryOnError: false,
      ...swrOpts,
    }
  );
};
