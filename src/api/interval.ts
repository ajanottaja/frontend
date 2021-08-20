import { Auth0ContextInterface, User } from "@auth0/auth0-react";
import { Describe, type, string, date, Infer, number, union, literal } from "superstruct";
import { apiHost } from "../config";
import { paths } from "../schema";
import { ApiResponse, httpPost, useSwrWithAuth0 } from "./fetch";
import { ErrorSchemas, InternalServerErrorSchema, LuxonDateTime, NotFoundSchema } from "./schema";

const IntervalSchema = type({
  beginning: LuxonDateTime,
  end: LuxonDateTime,
});

const ActiveIntervalSchema = type({
  status: literal(200),
  body: type({
    id: string(),
    account: string(),
    createdAt: LuxonDateTime,
    updatedAt: LuxonDateTime,
    interval: IntervalSchema
  })
});

const ActiveIntervalResponseSchema = union([ActiveIntervalSchema, NotFoundSchema, InternalServerErrorSchema]);
type ActiveIntervalResponse = Infer<typeof ActiveIntervalResponseSchema>;

export const useActiveInterval = (auth0: Auth0ContextInterface<User>) => {
  return useSwrWithAuth0<undefined, ActiveIntervalResponse>({
    auth0,
    url: `${apiHost}/intervals/active`,
    responseSchema: ActiveIntervalResponseSchema
  });
}


interface StartIntervalArgs {
  auth0: Auth0ContextInterface<User>
}

export const startInterval = async ({auth0: {getAccessTokenSilently}}: StartIntervalArgs) => {
  return await httpPost<undefined, ActiveIntervalResponse>({
    url: `${apiHost}/intervals/start`,
    getAccessTokenSilently,
    responseSchema: ActiveIntervalResponseSchema,
  });
}

interface StopIntervalArgs {
  auth0: Auth0ContextInterface<User>
}

export const stopInterval = async ({auth0: {getAccessTokenSilently}}: StopIntervalArgs) => {
  return await httpPost<undefined, ActiveIntervalResponse>({
    url: `${apiHost}/intervals/stop`,
    getAccessTokenSilently,
    responseSchema: ActiveIntervalResponseSchema,
  });
}