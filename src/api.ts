import { Auth0ContextInterface, useAuth0, User } from "@auth0/auth0-react";
import useSWR from "swr";

import { paths } from "./schema";


type ActiveInterval = paths["/intervals/active"]["get"]["responses"]["200"]["schema"];
type ActiveIntervalNotFound = paths["/intervals/active"]["get"]["responses"]["404"]["schema"];

interface ActiveIntervalResponseOK {
  status: 200;
  body: ActiveInterval;
}

interface ActiveIntervalResponseNotFound {
  status: 400;
  body: ActiveIntervalNotFound;
}

interface ResponseError {
  status: number;
  body: any;
}

type ActiveIntervalResponse = ActiveIntervalResponseOK | ActiveIntervalResponseNotFound | ResponseError;

export const useActiveInterval = (auth0: Auth0ContextInterface<User>) => {
  const {
    isLoading,
    isAuthenticated,
    getAccessTokenSilently
  } = auth0;

  const url = isLoading || !isAuthenticated ? null : 'https://api.ajanottaja.app/intervals/active';

  return useSWR(url, async (url): Promise<ActiveIntervalResponse> => {
    const accessToken = await getAccessTokenSilently({
      audience: 'https://api.ajanottaja.app'
    });

    const res = await fetch(url, {
      headers: { authorization: `Bearer ${accessToken}`},
    });


    return {status: res.status, body: await res.json()};
  });
  
}


type StartInterval = paths["/intervals/start"]["post"]["responses"]["200"]["schema"];

interface StartIntervalResponseOK {
  status: 200;
  body: StartInterval;
}


type StartIntervalResponse = StartIntervalResponseOK | ResponseError;

export const startInterval = async (auth0: Auth0ContextInterface<User>): Promise<StartIntervalResponse> => {
  
  const url = 'https://api.ajanottaja.app/intervals/start';



  if(auth0.isLoading || !auth0.isAuthenticated) {
    throw Error("Not authenticated");
  }

  const accessToken = await auth0.getAccessTokenSilently({
    audience: 'https://api.ajanottaja.app'
  });

  const res = await fetch(url, {
    method: "post",
    headers: { authorization: `Bearer ${accessToken}`},
  });


  return {status: res.status, body: await res.json()};
}



type StopInterval = paths["/intervals/stop"]["post"]["responses"]["200"]["schema"];

interface StopIntervalResponseOK {
  status: 200;
  body: StartInterval;
}

type StopIntervalResponse = StopIntervalResponseOK | ResponseError;

export const stopInterval = async (auth0: Auth0ContextInterface<User>): Promise<StopIntervalResponse> => {
  
  const url = 'https://api.ajanottaja.app/intervals/stop';



  if(auth0.isLoading || !auth0.isAuthenticated) {
    throw Error("Not authenticated");
  }

  const accessToken = await auth0.getAccessTokenSilently({
    audience: 'https://api.ajanottaja.app'
  });

  const res = await fetch(url, {
    method: "post",
    headers: { authorization: `Bearer ${accessToken}`},
  });


  return {status: res.status, body: await res.json()};
}
