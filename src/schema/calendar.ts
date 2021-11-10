import { DateTime } from "luxon";
import { defaulted, Infer, type } from "superstruct";
import { LuxonDateTime, StepSchema } from "../api/schema";

export const QuerySchema = type({
  date: defaulted(LuxonDateTime, DateTime.now()),
  step: defaulted(StepSchema, "month"),
});

export type Query = Infer<typeof QuerySchema>;