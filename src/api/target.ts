import { Auth0ContextInterface, User } from "@auth0/auth0-react";
import { Describe, type, string, date, Infer, number, union } from "superstruct";
import { apiHost } from "../config";
import { paths } from "../schema";
import { ApiResponse, fetchJson, httpPost, useSwrWithAuth0 } from "./fetch";
import { IsoDateTime, IsoDuration, LuxonDateTime, LuxonDuration } from "./schema";


const NotFoundSchema = type({
  status: number(),
  message: string(),
});

const ActiveTargetSchema = type({
  id: string(),
  account: string(),
  createdAt: LuxonDateTime,
  updatedAt: LuxonDateTime,
  date: LuxonDateTime,
  duration: LuxonDuration,
});

const ActiveTargetResponseSchema = union([ActiveTargetSchema, NotFoundSchema]);

type ActiveTarget = Infer<typeof ActiveTargetSchema>;
type NotFound = Infer<typeof NotFoundSchema>;

interface ActiveTargetResponseOK  {
  status: 200;
  body: ActiveTarget;
}

interface ActiveTargetResponseNotFound {
  status: 404;
  body: NotFound;
}

type ActiveTargetResponse =
  | ActiveTargetResponseOK
  | ActiveTargetResponseNotFound;


export const useActiveTarget = (auth0: Auth0ContextInterface<User>) => {
  console.log("Api host", apiHost);
  return useSwrWithAuth0<undefined, ActiveTargetResponse>({ url: `${apiHost}/targets/active`, opts: {}, auth0, responseSchema: ActiveTargetResponseSchema });
}


const UpsertActiveTargetParamSchema = type({
  date: IsoDateTime,
  duration: IsoDuration
});

type UpsertActiveTargetParams = Infer<typeof UpsertActiveTargetParamSchema>;

interface UpsertActiveTarget {
  auth0: Auth0ContextInterface<User>;
  params: UpsertActiveTargetParams;
}

export const upsertActiveTarget = async ({auth0: {getAccessTokenSilently}, params}: UpsertActiveTarget) => {
  const newTarget = await httpPost<UpsertActiveTargetParams, ActiveTargetResponseOK>({
    url: `${apiHost}/targets`,
    params,
    getAccessTokenSilently,
    requestSchema: UpsertActiveTargetParamSchema,
    responseSchema: ActiveTargetSchema,
  });
}