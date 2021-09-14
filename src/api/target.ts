import { Auth0ContextInterface, User } from "@auth0/auth0-react";
import { type, string, date, Infer, union, literal } from "superstruct";
import { apiHost } from "../config";
import { httpPost, useSwrWithAuth0 } from "./fetch";
import { InternalServerErrorSchema, IsoDate, IsoDateTime, IsoDuration, LuxonDateTime, LuxonDuration, NotFoundSchema } from "./schema";


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
  return useSwrWithAuth0<undefined, ActiveTargetResponse>({ url: `${apiHost}/targets-active`, auth0, responseSchema: ActiveTargetResponseSchema });
}


const CreateTargetParamSchema = type({
  date: IsoDate,
  duration: IsoDuration
});

type CreateTargetParams = Infer<typeof CreateTargetParamSchema>;

interface CreateTarget {
  auth0: Auth0ContextInterface<User>;
  params: CreateTargetParams;
}

export const createActiveTarget = async ({auth0: {getAccessTokenSilently}, params}: CreateTarget) => {
  return await httpPost<CreateTargetParams, ActiveTargetResponse>({
    url: `${apiHost}/targets`,
    params,
    getAccessTokenSilently,
    requestSchema: CreateTargetParamSchema,
    responseSchema: ActiveTargetResponseSchema,
  });
}