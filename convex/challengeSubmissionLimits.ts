/**
 * Shared limits for challenge submissions. Used by the Convex mutation and
 * the submit-challenge page.
 * Do not import Convex server or runtime modules here so the Next app can
 * import this file.
 */

export const MAX_PROMPT = 500;
export const MAX_EXPECTED_RESULT = 500;
export const MAX_TRICK_DESCRIPTION = 500;
export const MAX_MODEL_FAILURE_INSIGHT = 500;
export const MAX_SUBMITTER_NAME = 200;
export const MAX_SUBMITTER_LINK = 200;

export const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
export const RATE_LIMIT_MAX_PER_WINDOW = 10;
