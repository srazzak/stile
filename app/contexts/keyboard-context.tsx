import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

// Define types for our shortcuts and contexts
type ShortcutHandler = (e: KeyboardEvent) => void;

interface ShortcutDefinition {
  key: string; // e.g., 'g h' for pressing g then h
  description: string; // for help menus
  handler: ShortcutHandler;
  contexts: string[]; // which contexts this shortcut is active in
}

interface KeyboardContextType {
  registerShortcut: (shortcut: ShortcutDefinition) => void;
  unregisterShortcut: (key: string) => void;
  setActiveContext: (context: string) => void;
  getActiveShortcuts: () => ShortcutDefinition[];
  activeContext: string;
}

const KeyboardContext = createContext<KeyboardContextType | undefined>(
  undefined,
);

export function KeyboardProvider({ children }: { children: ReactNode }) {
  const [shortcuts, setShortcuts] = useState<ShortcutDefinition[]>([]);
  const [activeContext, setActiveContext] = useState<string>("global");
  const [keySequence, setKeySequence] = useState<string[]>([]);
  const [sequenceTimer, setSequenceTimer] = useState<NodeJS.Timeout | null>(
    null,
  );

  // Register a new shortcut - optimize to prevent unnecessary updates
  const registerShortcut = useCallback((shortcut: ShortcutDefinition) => {
    setShortcuts((prev) => {
      // Check if we're adding the same shortcut (by value comparison)
      const existing = prev.find((s) => s.key === shortcut.key);
      if (
        existing &&
        existing.handler === shortcut.handler &&
        existing.description === shortcut.description &&
        existing.contexts.join(",") === shortcut.contexts.join(",")
      ) {
        return prev; // No change needed
      }
      return [...prev.filter((s) => s.key !== shortcut.key), shortcut];
    });
  }, []);

  // Unregister a shortcut
  const unregisterShortcut = useCallback((key: string) => {
    setShortcuts((prev) => prev.filter((s) => s.key !== key));
  }, []);

  // Get shortcuts active in the current context
  const getActiveShortcuts = useCallback(() => {
    return shortcuts.filter(
      (s) =>
        s.contexts.includes(activeContext) || s.contexts.includes("global"),
    );
  }, [shortcuts, activeContext]);

  // Handle keydown events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if the target is an input or textarea
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      // Add key to sequence
      const newSequence = [...keySequence, e.key.toLowerCase()];
      setKeySequence(newSequence);

      // Reset sequence after 1 second of inactivity
      if (sequenceTimer) clearTimeout(sequenceTimer);
      const timer = setTimeout(() => setKeySequence([]), 1000);
      setSequenceTimer(timer);

      // Check if sequence matches any shortcuts
      const sequenceStr = newSequence.join(" ");
      const matchingShortcut = getActiveShortcuts().find(
        (s) => s.key === sequenceStr,
      );

      if (matchingShortcut) {
        e.preventDefault();
        matchingShortcut.handler(e);
        setKeySequence([]); // Reset after successful match
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (sequenceTimer) clearTimeout(sequenceTimer);
    };
  }, [keySequence, sequenceTimer, getActiveShortcuts]);

  // Memoize the context value to prevent unnecessary rerenders
  const contextValue = useMemo(
    () => ({
      registerShortcut,
      unregisterShortcut,
      setActiveContext,
      getActiveShortcuts,
      activeContext,
    }),
    [
      registerShortcut,
      unregisterShortcut,
      setActiveContext,
      getActiveShortcuts,
      activeContext,
    ],
  );

  return (
    <KeyboardContext.Provider value={contextValue}>
      {children}
    </KeyboardContext.Provider>
  );
}

/**
 * Custom hook for handling keyboard shortcuts and context-based keyboard interactions.
 * This hook provides access to the keyboard context, allowing components to register,
 * unregister shortcuts, and manage active contexts.
 *
 * @returns {KeyboardContextType} An object containing methods and state for keyboard shortcut management
 * @throws {Error} If used outside of a KeyboardProvider component
 *
 * @example
 * function MyComponent() {
 *   const { registerShortcut, setActiveContext } = useKeyboard();
 *
 *   useEffect(() => {
 *     registerShortcut({
 *       key: "g h",
 *       description: "Go home",
 *       handler: () => navigate("/"),
 *       contexts: ["global"]
 *     });
 *   }, []);
 *
 *   return <div>...</div>;
 * }
 */
export function useKeyboard(): KeyboardContextType {
  const context = useContext(KeyboardContext);
  if (context === undefined) {
    throw new Error("useKeyboard must be used within a KeyboardProvider");
  }
  return context;
}
