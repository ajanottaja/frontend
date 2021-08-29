import { Auth0ContextInterface, User } from "@auth0/auth0-react";
import {
  Describe,
  type,
  string,
  date,
  Infer,
  number,
  union,
  literal,
  array,
} from "superstruct";
import { apiHost } from "../config";
import { paths } from "../schema";
import { ApiResponse, httpPost, useSwrWithAuth0 } from "./fetch";
import {
  ErrorSchemas,
  InternalServerErrorSchema,
  LuxonDateTime,
  NotFoundSchema,
} from "./schema";

// Common interval schemas

const IntervalSchema = type({
  beginning: LuxonDateTime,
  end: LuxonDateTime,
});

const IntervalRecordSchema = type({
  id: string(),
  account: string(),
  createdAt: LuxonDateTime,
  updatedAt: LuxonDateTime,
  interval: IntervalSchema,
});

// Get list of intervals

const IntervalsSchema = type({
  status: literal(200),
  body: array(IntervalRecordSchema),
});

const IntervalsResponseSchema = union([
  IntervalsSchema,
  InternalServerErrorSchema,
]);
type IntervalsResponse = Infer<typeof IntervalsResponseSchema>;

export const useIntervals = (auth0: Auth0ContextInterface<User>) => {
  return useSwrWithAuth0<undefined, IntervalsResponse>({
    auth0,
    url: `${apiHost}/intervals/active`,
    responseSchema: IntervalsResponseSchema,
  });
};

// Get active interval

const ActiveIntervalSchema = type({
  status: literal(200),
  body: IntervalRecordSchema,
});

const ActiveIntervalResponseSchema = union([
  ActiveIntervalSchema,
  NotFoundSchema,
  InternalServerErrorSchema,
]);
type ActiveIntervalResponse = Infer<typeof ActiveIntervalResponseSchema>;

export const useActiveInterval = (auth0: Auth0ContextInterface<User>) => {
  return useSwrWithAuth0<undefined, ActiveIntervalResponse>({
    auth0,
    url: `${apiHost}/intervals/active`,
    responseSchema: ActiveIntervalResponseSchema,
  });
};

// Start an interval

interface StartIntervalArgs {
  auth0: Auth0ContextInterface<User>;
}

export const startInterval = async ({
  auth0: { getAccessTokenSilently },
}: StartIntervalArgs) => {
  return await httpPost<undefined, ActiveIntervalResponse>({
    url: `${apiHost}/intervals/start`,
    getAccessTokenSilently,
    responseSchema: ActiveIntervalResponseSchema,
  });
};

// Stop an interval

interface StopIntervalArgs {
  auth0: Auth0ContextInterface<User>;
}

export const stopInterval = async ({
  auth0: { getAccessTokenSilently },
}: StopIntervalArgs) => {
  return await httpPost<undefined, ActiveIntervalResponse>({
    url: `${apiHost}/intervals/stop`,
    getAccessTokenSilently,
    responseSchema: ActiveIntervalResponseSchema,
  });
};
