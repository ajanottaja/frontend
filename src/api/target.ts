import { Auth0ContextInterface, User } from "@auth0/auth0-react";
import { type, string, date, Infer, union, literal } from "superstruct";
import { apiHost } from "../config";
import { httpPatch, httpPost, useSwrWithAuth0 } from "./fetch";
import { InternalServerErrorSchema, IsoDate, IsoDateTime, IsoDuration, LuxonDateTime, LuxonDuration, NotFoundSchema, Uuid } from "./schema";


const ActiveTargetSchema = type({
  status: literal(200),
  body: type({
    id: string(),
    account: string(),
    createdAt: LuxonDateTime,
    updatedAt: LuxonDateTime,
    date: LuxonDateTime,
    duration: LuxonDuration,
  })
});

const ActiveTargetResponseSchema = union([ActiveTargetSchema, NotFoundSchema, InternalServerErrorSchema]);
type ActiveTargetResponse = Infer<typeof ActiveTargetResponseSchema>;


export const useActiveTarget = (auth0: Auth0ContextInterface<User>) => {
  return useSwrWithAuth0<undefined, undefined, undefined, ActiveTargetResponse>({ url: `${apiHost}/targets-active`, auth0, responseSchema: ActiveTargetResponseSchema });
}


const CreateTargetBodySchema = type({
  date: IsoDate,
  duration: IsoDuration
});

type CreateTargetBody = Infer<typeof CreateTargetBodySchema>;

interface CreateTarget {
  auth0: Auth0ContextInterface<User>;
  body: CreateTargetBody;
}

export const createActiveTarget = async ({auth0: {getAccessTokenSilently}, body}: CreateTarget) => {
  return await httpPost<undefined, undefined, CreateTargetBody, ActiveTargetResponse>({
    url: `${apiHost}/targets`,
    body: { value: body, schema: CreateTargetBodySchema },
    getAccessTokenSilently,
    responseSchema: ActiveTargetResponseSchema,
  });
}


const UpdateTargetPathSchema = type({
  id: Uuid,
});

type UpdateTargetPath = Infer<typeof UpdateTargetPathSchema>;

const UpdateTargetBodySchema = type({
  duration: IsoDuration
});

type UpdateTargetBody = Infer<typeof UpdateTargetBodySchema>;

interface UpdateTarget {
  auth0: Auth0ContextInterface<User>;
  path: UpdateTargetPath;
  body: UpdateTargetBody;
}

export const updateActiveTarget = async ({auth0: {getAccessTokenSilently}, path, body}: UpdateTarget) => {
  return await httpPatch<UpdateTargetPath, undefined, UpdateTargetBody, ActiveTargetResponse>({
    url: `${apiHost}/targets/:id`,
    path: {schema: UpdateTargetPathSchema, value: path},
    body: {schema: UpdateTargetBodySchema, value: body},
    getAccessTokenSilently,
    responseSchema: ActiveTargetResponseSchema,
  });
}