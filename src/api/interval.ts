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
import { ApiResponse, httpPatch, httpPost, useSwrWithAuth0 } from "./fetch";
import {
  ErrorSchemas,
  InternalServerErrorSchema,
  LuxonDateTime,
  NotFoundSchema,
  Uuid,
} from "./schema";

// Common interval schemas

export const IntervalSchema = type({
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
  return useSwrWithAuth0<undefined, undefined, undefined, IntervalsResponse>({
    auth0,
    url: `${apiHost}/intervals`,
    responseSchema: IntervalsResponseSchema,
  });
};

// Get active interval

const ActiveIntervalSchema = type({
  status: literal(200),
  body: IntervalRecordSchema,
});

const IntervalResponseSchema = union([
  ActiveIntervalSchema,
  NotFoundSchema,
  InternalServerErrorSchema,
]);
type IntervalResponse = Infer<typeof IntervalResponseSchema>;

export const useActiveInterval = (auth0: Auth0ContextInterface<User>) => {
  return useSwrWithAuth0<undefined, undefined, undefined, IntervalResponse>({
    auth0,
    url: `${apiHost}/intervals-active`,
    responseSchema: IntervalResponseSchema,
  });
};

// Start an interval

interface StartIntervalArgs {
  auth0: Auth0ContextInterface<User>;
}

export const startInterval = async ({
  auth0: { getAccessTokenSilently },
}: StartIntervalArgs) => {
  return await httpPost<undefined, undefined, undefined, IntervalResponse>({
    url: `${apiHost}/intervals-active/start`,
    getAccessTokenSilently,
    responseSchema: IntervalResponseSchema,
  });
};

// Stop an interval

interface StopIntervalArgs {
  auth0: Auth0ContextInterface<User>;
}

export const stopInterval = async ({
  auth0: { getAccessTokenSilently },
}: StopIntervalArgs) => {
  return await httpPost<undefined, undefined, undefined, IntervalResponse>({
    url: `${apiHost}/intervals-active/stop`,
    getAccessTokenSilently,
    responseSchema: IntervalResponseSchema,
  });
};



// Update an interval

const UpdateIntervalPathSchema = type({
  id: Uuid,
});

type UpdateIntervalPath = Infer<typeof UpdateIntervalPathSchema>;

const UpdateIntervalBodySchema = type({
  interval: IntervalSchema
});

type UpdateIntervalBody = Infer<typeof UpdateIntervalBodySchema>;

interface UpdateInterval {
  auth0: Auth0ContextInterface<User>;
  path: UpdateIntervalPath;
  body: UpdateIntervalBody;
}

export const updateInterval = async ({auth0: {getAccessTokenSilently}, path, body}: UpdateInterval) => {
  return await httpPatch<UpdateIntervalPath, undefined, UpdateIntervalBody, IntervalResponse>({
    url: `${apiHost}/intervals/:id`,
    path: {schema: UpdateIntervalPathSchema, value: path},
    body: {schema: UpdateIntervalBodySchema, value: body},
    getAccessTokenSilently,
    responseSchema: IntervalResponseSchema,
  });
}