import { useLocation } from "react-router-dom";
import { z } from "zod";

/**
 * Gets query parameters, turns it into object, and validates and coerces according
 * to querySchema.
 * @param querySchema the zod schema to use for validation
 * @returns 
 */
export function useQueryParams<T extends z.ZodTypeAny>(querySchema: T): z.infer<T> {
  const query = new URLSearchParams(useLocation().search);
  const value = Object.fromEntries(query);
  return querySchema.parse(value);
}

/**
 * Validates and coerces an object of query params before
 * turning object into a query search string
 * @param queryParams Object of query params
 * @param querySchema zod schema describing query params
 * @returns 
 */
export function queryParamsToSearchString<T extends z.ZodTypeAny>(queryParams: Record<string, unknown>, querySchema: T) {
  const coerced = querySchema.parse(queryParams);
  return new URLSearchParams(coerced as any).toString();
}