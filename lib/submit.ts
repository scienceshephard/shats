import { ApiError } from "./api";

/**
 * Routes a form submission to the back end, or to a stand-in when no gateway is
 * configured.
 *
 * The demo path exists so the project runs and can be shown with nothing else
 * running. It is deliberately a separate argument rather than a mock baked into
 * `lib/api.ts`: that file is the contract with the Spring services and should
 * stay free of pretend behaviour. Set NEXT_PUBLIC_API_GATEWAY and every call
 * here goes live with no other change.
 */
export const IS_LIVE = Boolean(process.env.NEXT_PUBLIC_API_GATEWAY);

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function submit<T>(live: () => Promise<T>, demo: () => T | Promise<T>): Promise<T> {
  if (!IS_LIVE) {
    // Enough delay that the pending state is real rather than a flicker.
    await wait(650);
    return demo();
  }
  return live();
}

/**
 * Turns whatever went wrong into one sentence a patient can act on, and pulls
 * out any per-field messages the service returned.
 */
export function describeFailure(error: unknown): {
  message: string;
  fields?: Record<string, string>;
} {
  if (error instanceof ApiError) {
    if (error.status === 0) {
      return { message: "Your phone lost the network before we could finish. Nothing was sent." };
    }
    if (error.status === 401 || error.status === 403) {
      return { message: "You need to sign in again before we can do that." };
    }
    if (error.status >= 500) {
      return { message: "SHATS is having trouble right now. Please try again in a moment." };
    }
    return {
      message: error.message || "We could not finish that. Please check what you typed.",
      fields: error.fieldErrors,
    };
  }
  return { message: "Something went wrong. Please try again." };
}
