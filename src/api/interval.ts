import { Auth0ContextInterface, User } from "@auth0/auth0-react";
import { Describe, type, string, date, Infer, number, union } from "superstruct";
import { apiHost } from "../config";
import { paths } from "../schema";
import { ApiResponse, useSwrWithAuth0 } from "./fetch";
import { LuxonDateTime } from "./schema";

const IntervalSchema = type({
  beginning: LuxonDateTime,
  end: LuxonDateTime,
});

const ActiveIntervalSchema = type({
  id: string(),
  account: string(),
  createdAt: LuxonDateTime,
  updatedAt: LuxonDateTime,
  interval: IntervalSchema
});

const NotFoundSchema = type({
  status: number(),
  message: string(),
});

const ResponsesSchema = union([ActiveIntervalSchema, NotFoundSchema]);
const ResponseSchema = type({status: number(), body: ResponsesSchema});

type ActiveInterval = Infer<typeof ActiveIntervalSchema>;
type NotFound = Infer<typeof NotFoundSchema>;

interface ActiveIntervalResponseOK  {
  status: 200;
  body: ActiveInterval;
}

interface ActiveIntervalResponseNotFound {
  status: 404;
  body: NotFound;
}

type ActiveIntervalResponse =
  | ActiveIntervalResponseOK
  | ActiveIntervalResponseNotFound;


export const useActiveInterval = (auth0: Auth0ContextInterface<User>) => {
  console.log("Api host", apiHost);
  return useSwrWithAuth0<undefined, ActiveIntervalResponse>({ url: `${apiHost}/intervals/active`, opts: {}, auth0, responseSchema: ResponseSchema });
}