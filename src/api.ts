import { Auth0ContextInterface, useAuth0, User } from "@auth0/auth0-react";
import useSWR from "swr";

import { paths } from "./schema";

type ActiveInterval =
  paths["/intervals/active"]["get"]["responses"]["200"]["schema"];
type ActiveIntervalNotFound =
  paths["/intervals/active"]["get"]["responses"]["404"]["schema"];

interface ActiveIntervalResponseOK {
  status: 200;
  body: ActiveInterval;
}

interface ActiveIntervalResponseNotFound {
  status: 404;
  body: ActiveIntervalNotFound;
}

type ActiveIntervalResponse =
  | ActiveIntervalResponseOK
  | ActiveIntervalResponseNotFound;

export const useActiveInterval = (auth0: Auth0ContextInterface<User>) => {
  const { isLoading, isAuthenticated, getAccessTokenSilently } = auth0;

  const url =
    isLoading || !isAuthenticated
      ? null
      : "https://api.ajanottaja.app/intervals/active";

  return useSWR(
    url,
    async (url): Promise<ActiveIntervalResponse> => {
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
};

type StartInterval =
  paths["/intervals/start"]["post"]["responses"]["200"]["schema"];

interface StartIntervalResponseOK {
  status: 200;
  body: StartInterval;
}

type StartIntervalResponse = StartIntervalResponseOK;

export const startInterval = async (
  auth0: Auth0ContextInterface<User>
): Promise<StartIntervalResponse> => {
  const url = "https://api.ajanottaja.app/intervals/start";

  if (auth0.isLoading || !auth0.isAuthenticated) {
    throw Error("Not authenticated");
  }

  const accessToken = await auth0.getAccessTokenSilently({
    audience: "https://api.ajanottaja.app",
  });

  const res = await fetch(url, {
    method: "post",
    headers: { authorization: `Bearer ${accessToken}` },
  });

  if (res.status === 200) {
    return { status: res.status, body: await res.json() };
  }
  throw Error("Failed to start response");
};

type StopInterval =
  paths["/intervals/stop"]["post"]["responses"]["200"]["schema"];

interface StopIntervalResponseOK {
  status: 200;
  body: StopInterval;
}

type StopIntervalResponse = StopIntervalResponseOK;

export const stopInterval = async (
  auth0: Auth0ContextInterface<User>
): Promise<StopIntervalResponse> => {
  const url = "https://api.ajanottaja.app/intervals/stop";

  if (auth0.isLoading || !auth0.isAuthenticated) {
    throw Error("Not authenticated");
  }

  const accessToken = await auth0.getAccessTokenSilently({
    audience: "https://api.ajanottaja.app",
  });

  const res = await fetch(url, {
    method: "post",
    headers: { authorization: `Bearer ${accessToken}` },
  });

  if (res.status === 200) {
    return { status: res.status, body: await res.json() };
  }

  throw Error("Failed to stop interval");
};

type UpsertTarget = paths["/targets"]["post"]["responses"]["200"]["schema"];

interface UpsertTargetResponseOK {
  status: 200;
  body: UpsertTarget;
}

type UpsertTargetResponse = UpsertTargetResponseOK;

interface UpsertTargetArgs {
  date: Date;
  duration: Duration;
  auth0: Auth0ContextInterface<User>;
}

export const upsertTarget = async ({
  date,
  duration,
  auth0,
}: UpsertTargetArgs): Promise<UpsertTargetResponse> => {
  const url = "https://api.ajanottaja.app/targets";

  if (auth0.isLoading || !auth0.isAuthenticated) {
    throw Error("Not authenticated");
  }

  const accessToken = await auth0.getAccessTokenSilently({
    audience: "https://api.ajanottaja.app",
  });

  const res = await fetch(url, {
    method: "post",
    body: JSON.stringify({ date: date.toISOString(), duration: duration }),
    headers: {
      authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (res.status === 200) {
    return { status: res.status, body: await res.json() };
  }

  throw Error("Failed to start response");
};
