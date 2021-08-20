import { Auth0ContextInterface, User } from "@auth0/auth0-react";
import { Describe, type, string, date, Infer, number, union, literal } from "superstruct";
import { apiHost } from "../config";
import { paths } from "../schema";
import { ApiResponse, useSwrWithAuth0 } from "./fetch";
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

const ResponseSchema = union([ActiveIntervalSchema, NotFoundSchema, InternalServerErrorSchema]);
type Response = Infer<typeof ResponseSchema>;

export const useActiveInterval = (auth0: Auth0ContextInterface<User>) => {
  return useSwrWithAuth0<undefined, Response>({
    auth0,
    url: `${apiHost}/intervals/active`,
    responseSchema: ResponseSchema
  });
}