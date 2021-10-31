import { Auth0ContextInterface, User } from "@auth0/auth0-react";
import { type, string, date, Infer, union, literal } from "superstruct";
import { apiHost } from "../config";
import { httpDelete, httpPatch, httpPost, useSwrWithAuth0 } from "./fetch";
import {
  InternalServerErrorSchema,
  IsoDate,
  IsoDateTime,
  IsoDuration,
  LuxonDateTime,
  LuxonDuration,
  NotFoundSchema,
  Uuid,
} from "./schema";


const TargetPathSchema = type({
  id: Uuid,
});

type TargetPath = Infer<typeof TargetPathSchema>;

const TargetSchema = type({
  status: literal(200),
  body: type({
    id: string(),
    account: string(),
    createdAt: LuxonDateTime,
    updatedAt: LuxonDateTime,
    date: LuxonDateTime,
    duration: LuxonDuration,
  }),
});

const TargetResponseSchema = union([
  TargetSchema,
  NotFoundSchema,
  InternalServerErrorSchema,
]);
type TargetResponse = Infer<typeof TargetResponseSchema>;

// Get active target

export const useActiveTarget = (auth0: Auth0ContextInterface<User>) => {
  return useSwrWithAuth0<undefined, undefined, undefined, TargetResponse>({
    url: `${apiHost}/targets-active`,
    auth0,
    responseSchema: TargetResponseSchema,
  });
};

// Create target

const CreateTargetBodySchema = type({
  date: IsoDate,
  duration: IsoDuration,
});

type CreateTargetBody = Infer<typeof CreateTargetBodySchema>;

interface CreateTarget {
  auth0: Auth0ContextInterface<User>;
  body: CreateTargetBody;
}

export const createTarget = async ({
  auth0: { getAccessTokenSilently },
  body,
}: CreateTarget) => {
  return await httpPost<undefined, undefined, CreateTargetBody, TargetResponse>(
    {
      url: `${apiHost}/targets`,
      body: { value: body, schema: CreateTargetBodySchema },
      getAccessTokenSilently,
      responseSchema: TargetResponseSchema,
    }
  );
};

// Update target
const UpdateTargetBodySchema = type({
  duration: IsoDuration,
  date: IsoDate,
});

type UpdateTargetBody = Infer<typeof UpdateTargetBodySchema>;

interface UpdateTarget {
  auth0: Auth0ContextInterface<User>;
  path: TargetPath;
  body: UpdateTargetBody;
}

export const updateTarget = async ({
  auth0: { getAccessTokenSilently },
  path,
  body,
}: UpdateTarget) => {
  return await httpPatch<
    TargetPath,
    undefined,
    UpdateTargetBody,
    TargetResponse
  >({
    url: `${apiHost}/targets/:id`,
    path: { schema: TargetPathSchema, value: path },
    body: { schema: UpdateTargetBodySchema, value: body },
    getAccessTokenSilently,
    responseSchema: TargetResponseSchema,
  });
};

// Delete target




interface DeleteTarget {
  auth0: Auth0ContextInterface<User>;
  path: TargetPath;
}

export const deleteTarget = async ({
  auth0: { getAccessTokenSilently },
  path,
}: DeleteTarget) => {
  return await httpDelete<
    TargetPath,
    undefined,
    undefined,
    TargetResponse
  >({
    url: `${apiHost}/targets/:id`,
    path: { schema: TargetPathSchema, value: path },
    getAccessTokenSilently,
    responseSchema: TargetResponseSchema,
  });
};
