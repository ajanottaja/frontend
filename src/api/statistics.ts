import { Auth0ContextInterface, User } from "@auth0/auth0-react";
import { type, Infer, union, literal, array, enums } from "superstruct";
import { PublicConfiguration } from "swr/dist/types";
import { apiHost } from "../config";
import { useSwrWithAuth0 } from "./fetch";
import { InternalServerErrorSchema, LuxonDuration } from "./schema";

const SummarySchema = type({
  unit: enums(["day", "week", "month"]),
  target: LuxonDuration,
  tracked: LuxonDuration,
  diff: LuxonDuration,
});

export type StatisticsSummary = Infer<typeof SummarySchema>;

const StatisticsSummarySchema = type({
  status: literal(200),
  body: array(SummarySchema)
});

const StatisticsSummaryResponseSchema = union([StatisticsSummarySchema, InternalServerErrorSchema]);
type StatisticsSummaryResponse = Infer<typeof StatisticsSummaryResponseSchema>;


export const useStatisticsSummary = (auth0: Auth0ContextInterface<User>, swrOpts: Partial<PublicConfiguration> | undefined = {}) => {
  return useSwrWithAuth0<undefined, undefined, undefined, StatisticsSummaryResponse>({ url: `${apiHost}/statistics/summary`, auth0, responseSchema: StatisticsSummaryResponseSchema }, swrOpts);
}