export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

export const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export const primaryButton = cx(
  "min-h-11 rounded-full bg-accent px-5 py-3 text-sm font-medium text-bg disabled:cursor-not-allowed disabled:opacity-40",
  focusRing,
);
