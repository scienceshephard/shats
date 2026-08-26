/**
 * Field validation.
 *
 * The messages are the point. Someone filling these in may be anxious, on a
 * small screen, and reading their second or third language — so each one says
 * what is wrong in plain words and, where it helps, shows the shape expected.
 * No "invalid", no "required field", no error codes.
 */

export type Errors<T> = Partial<Record<keyof T, string>>;

export function required(value: string, message: string): string | undefined {
  return value.trim() ? undefined : message;
}

/**
 * Nigerian mobile numbers: 11 digits starting 0, or the +234 form. Spaces and
 * dashes are stripped first, because people type them and it is not their
 * problem to know we do not want them.
 */
export function nigerianPhone(value: string): string | undefined {
  const digits = value.replace(/[\s-()]/g, "");
  if (!digits) return "We need a phone number to send your code to.";
  const normalised = digits.startsWith("+234")
    ? "0" + digits.slice(4)
    : digits.startsWith("234")
      ? "0" + digits.slice(3)
      : digits;
  if (!/^0[789]\d{9}$/.test(normalised)) {
    return "That does not look like a Nigerian phone number. It should look like 0803 555 0142.";
  }
  return undefined;
}

/** The 11-digit local form, which is what the back end stores. */
export function normalisePhone(value: string): string {
  const digits = value.replace(/[\s-()]/g, "");
  if (digits.startsWith("+234")) return "0" + digits.slice(4);
  if (digits.startsWith("234")) return "0" + digits.slice(3);
  return digits;
}

export function otpCode(value: string): string | undefined {
  const digits = value.replace(/\s/g, "");
  if (!digits) return "Type the six numbers we sent you.";
  if (!/^\d{6}$/.test(digits)) return "The code is six numbers. Check the message again.";
  return undefined;
}

export function wholeNumber(
  value: string,
  { min, max, label }: { min: number; max: number; label: string },
): string | undefined {
  if (!value.trim()) return undefined;
  const n = Number(value);
  if (!Number.isFinite(n)) return `${label} should be a number.`;
  if (n < min || n > max) return `${label} should be between ${min} and ${max}.`;
  return undefined;
}

/** True when nothing in the map holds a message. */
export function isClean<T>(errors: Errors<T>): boolean {
  return Object.values(errors).every((v) => !v);
}
