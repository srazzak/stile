import { useEffect, type Ref, type RefObject } from "react";

/**
 * Traps focus within a specified container when active.
 *
 * @param {Object} options - Configuration options
 * @param {boolean} options.active - Whether the focus trap is active
 * @param {RefObject<HTMLElement>} options.containerRef - Ref to the container element
 * @param {string} [options.focusableSelector] - CSS selector for focusable elements
 * @param {() => void} [options.onDeactivate] - Callback for when trap is deactivated (e.g., via Escape key)
 *
 * @returns {void}
 */
export function useFocusTrap({
  active,
  containerRef,
  initialFocus,
  focusableSelector = "[tabindex]:not([tabindex='-1'])",
  onDeactivate,
}: {
  active: boolean;
  containerRef: RefObject<HTMLElement | null>;
  initialFocus?: RefObject<HTMLElement | null>;
  focusableSelector?: string;
  onDeactivate?: () => void;
}) {
  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const focusables = Array.from(
      container.querySelectorAll<HTMLElement>(focusableSelector),
    );

    const focusFirst = () =>
      initialFocus ? initialFocus.current?.focus() : focusables[0]?.focus();
    // const focusFirst = () => focusables[0]?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onDeactivate?.();
      }
    };

    const handleFocusOut = (e: FocusEvent) => {
      if (!container.contains(e.relatedTarget as Node)) {
        e.preventDefault();
        focusFirst();
      }
    };

    focusFirst();

    container.addEventListener("keydown", handleKeyDown);
    container.addEventListener("focusout", handleFocusOut);

    return () => {
      container.removeEventListener("keydown", handleKeyDown);
      container.removeEventListener("focusout", handleFocusOut);
    };
  }, [active, containerRef, focusableSelector, onDeactivate]);
}
