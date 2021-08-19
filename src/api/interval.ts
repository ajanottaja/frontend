import { Auth0ContextInterface, User } from "@auth0/auth0-react";
import { Describe, object, string, date, Infer } from "superstruct";
import { apiHost } from "../config";
import { paths } from "../schema";
import { ApiResponse, useSwrWithAuth0 } from "./fetch";
import { IsoDateTime } from "./schema";

type ActiveInterval =
  paths["/intervals/active"]["get"]["responses"]["200"]["schema"];
type ActiveIntervalNotFound =
  paths["/intervals/active"]["get"]["responses"]["404"]["schema"];

const Interval = object({
  beginning: IsoDateTime,
  end: IsoDateTime,
});

const ActiveInterval = object({
  id: string(),
  account: string(),
  createdAt: IsoDateTime,
  updatedAt: IsoDateTime,
  interval: Interval
});

type MyActiveInterval = Infer<typeof ActiveInterval>;

interface ActiveIntervalResponseOK  {
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
  return useSwrWithAuth0<ActiveIntervalResponse>(`${apiHost}/intervals/active`, {}, auth0);
}