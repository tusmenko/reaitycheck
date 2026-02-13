/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as actions_openrouter from "../actions/openrouter.js";
import type * as actions_runTests from "../actions/runTests.js";
import type * as actions_validators from "../actions/validators.js";
import type * as crons from "../crons.js";
import type * as mutations from "../mutations.js";
import type * as queries from "../queries.js";
import type * as seed from "../seed.js";
import type * as seeds_aiModels from "../seeds/aiModels.js";
import type * as seeds_testCases from "../seeds/testCases.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "actions/openrouter": typeof actions_openrouter;
  "actions/runTests": typeof actions_runTests;
  "actions/validators": typeof actions_validators;
  crons: typeof crons;
  mutations: typeof mutations;
  queries: typeof queries;
  seed: typeof seed;
  "seeds/aiModels": typeof seeds_aiModels;
  "seeds/testCases": typeof seeds_testCases;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
