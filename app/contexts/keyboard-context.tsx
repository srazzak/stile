import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
  useRef,
  type RefObject,
} from "react";

// Define types for our shortcuts and contexts
type ShortcutHandler = (e: KeyboardEvent) => void;

interface ShortcutDefinition {
  // key: string; // e.g., 'g h' for pressing g then h
  key: string[]; // e.g., ["g", "h"] for pressing g then h
  description: string; // for help menus
  handler: ShortcutHandler;
  contexts: string[]; // which contexts this shortcut is active in
}

interface KeyboardContextType {
  registerShortcut: (shortcut: ShortcutDefinition) => void;
  unregisterShortcut: (key: string[]) => void;
  setActiveContext: (context: string) => void;
  getActiveShortcuts: () => ShortcutDefinition[];
  activeContext: string;
  keyBuffer: RefObject<string[]>;
  debugKeyBuffer: string[];
}

const KeyboardContext = createContext<KeyboardContextType | undefined>(
  undefined,
);

export function KeyboardProvider({ children }: { children: ReactNode }) {
  const [shortcuts, setShortcuts] = useState<ShortcutDefinition[]>([]);
  const [activeContext, setActiveContext] = useState<string>("global");
  const keyBuffer = useRef<string[]>([]);
  const [debugKeyBuffer, setDebugKeyBuffer] = useState<string[]>([]);
  const sequenceTimer = useRef<NodeJS.Timeout | null>(null);

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
  const unregisterShortcut = useCallback((key: string[]) => {
    setShortcuts((prev) => prev.filter((s) => s.key !== key));
  }, []);

  // Get shortcuts active in the current context
  const getActiveShortcuts = useCallback(() => {
    return shortcuts.filter((s) => {
      // check to make sure buffer lines up
      const bufferCheck = keyBuffer.current
        .map((key, index) => key === s.key[index])
        .every(Boolean);

      return (
        activeContext !== "modal" &&
        (s.contexts.includes(activeContext) || s.contexts.includes("global")) &&
        bufferCheck
      );
    });
  }, [shortcuts, activeContext, keyBuffer]);

  function isShortcutMatch(input: string[], target: string[]) {
    return (
      input.length === target.length &&
      input.every((key, i) => key === target[i])
    );
  }

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
      keyBuffer.current.push(e.key.toLowerCase());

      if (import.meta.env.DEV) {
        setDebugKeyBuffer(keyBuffer.current);
      }

      // Reset sequence after 1 second of inactivity
      if (sequenceTimer.current) clearTimeout(sequenceTimer.current);
      sequenceTimer.current = setTimeout(() => {
        keyBuffer.current = [];
        if (import.meta.env.DEV) {
          setDebugKeyBuffer(keyBuffer.current);
        }
      }, 1000);

      const activeShortcuts = getActiveShortcuts();

      if (activeShortcuts.length === 0) {
        keyBuffer.current = [];
        if (sequenceTimer.current) clearTimeout(sequenceTimer.current);

        // debug keyBuffer
        if (import.meta.env.DEV) {
          setDebugKeyBuffer(keyBuffer.current);
        }
      }

      const matchingShortcut = activeShortcuts.find((s) =>
        isShortcutMatch(s.key, keyBuffer.current),
      );

      // Check if sequence matches any shortcuts
      if (matchingShortcut) {
        e.preventDefault();
        matchingShortcut.handler(e);
        keyBuffer.current = []; // Reset after successful match
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (sequenceTimer.current) clearTimeout(sequenceTimer.current);
    };
  }, [keyBuffer, sequenceTimer, getActiveShortcuts]);

  // Memoize the context value to prevent unnecessary rerenders
  const contextValue = useMemo(
    () => ({
      registerShortcut,
      unregisterShortcut,
      setActiveContext,
      getActiveShortcuts,
      activeContext,
      keyBuffer,
      debugKeyBuffer,
    }),
    [
      registerShortcut,
      unregisterShortcut,
      setActiveContext,
      getActiveShortcuts,
      activeContext,
      keyBuffer,
      debugKeyBuffer,
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
