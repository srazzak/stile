import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";

export const generateId = customAlphabet(
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
  16,
);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Detects the user's operating system based on the user agent string.
 * Returns 'mac', 'windows', 'linux', or 'unknown'.
 * @returns {"mac" | "windows" | "linux" | "unknown"} The detected platform ('mac', 'windows', 'linux', or 'unknown').
 */
export function getPlatform(): "mac" | "windows" | "linux" | "unknown" {
  if (typeof navigator === "undefined") return "unknown";

  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.includes("mac")) {
    return "mac";
  } else if (userAgent.includes("win")) {
    return "windows";
  } else if (userAgent.includes("linux")) {
    return "linux";
  } else {
    return "unknown";
  }
}
