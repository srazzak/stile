import { useEffect, useCallback, useRef } from "react";
import { useKeyboard } from "@/contexts/keyboard-context";

interface UseShortcutProps {
  key: string[];
  handler: (e: KeyboardEvent) => void;
  description: string;
  contexts?: string[];
}

/**
 * A custom hook for registering keyboard shortcuts with context awareness.
 *
 * @param props - The shortcut configuration object
 * @param props.key - The key combination that triggers the shortcut (e.g., "ctrl+k")
 * @param props.handler - The callback function to execute when the shortcut is triggered
 * @param props.description - A human-readable description of what the shortcut does
 * @param props.contexts - Optional array of context strings where this shortcut should be active. Defaults to ["global"]
 *
 * @example
 * ```ts
 * useShortcut({
 *   key: "ctrl+k",
 *   handler: (e) => console.log("Shortcut triggered"),
 *   description: "Opens the command palette",
 *   contexts: ["editor", "global"]
 * });
 * ```
 */
export function useShortcut({
  key,
  handler,
  description,
  contexts = ["global"],
}: UseShortcutProps) {
  const { registerShortcut, unregisterShortcut } = useKeyboard();

  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  const stableHandler = useCallback((e: KeyboardEvent) => {
    handlerRef.current(e);
  }, []);

  const shortcutKey = useRef(key).current;
  const shortcutDescription = useRef(description).current;
  const shortcutContexts = useRef(contexts).current;

  useEffect(() => {
    registerShortcut({
      key: shortcutKey,
      handler: stableHandler,
      description: shortcutDescription,
      contexts: shortcutContexts,
    });

    return () => unregisterShortcut(shortcutKey);
  }, [
    shortcutKey,
    stableHandler,
    shortcutDescription,
    shortcutContexts,
    registerShortcut,
    unregisterShortcut,
  ]);
}
