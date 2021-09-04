import { useLocation } from "react-router-dom";
import { create, Struct } from "superstruct";

/**
 * Gets query parameters, turns it into object, and validates and coerces according
 * to querySchema.
 * @param querySchema the superstruct schema to use for validation
 * @returns 
 */
export function useQuery<T>(querySchema: Struct<T>) {
  const query = new URLSearchParams(useLocation().search);
  const value = Object.fromEntries(query);
  return create(value, querySchema);
}

/**
 * Validates and coerces an object of query params before
 * turning object into a query search string
 * @param queryParams Object of query params
 * @param querySchema Schema describing query params
 * @returns 
 */
export function queryToSearchString<T>(queryParams: T, querySchema: Struct<T>) {
  const coerced = create(queryParams, querySchema);
  return new URLSearchParams(coerced as any).toString();
}