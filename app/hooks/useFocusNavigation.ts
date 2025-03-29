import { useRef, useCallback, type RefObject } from "react";

/**
 * Hook for managing keyboard navigation between focusable elements within a container
 *
 * @param containerRef - Ref to the container element that bounds the navigation
 * @returns Navigation function that handles focus movement
 */
export function useFocusNavigation(
  containerRef: RefObject<HTMLElement | null>,
) {
  // Cache the list of focusable elements to avoid unnecessary DOM queries
  const focusableElementsCache = useRef<HTMLElement[]>([]);

  // Used to track if we need to refresh the cache
  const lastContainerUpdate = useRef<number>(0);

  // Selector for standard focusable elements
  const focusableSelector =
    'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])';

  /**
   * Get all focusable elements within the container
   */
  const getFocusableElements = useCallback(() => {
    const container = containerRef.current;
    if (!container) return [];

    // Only refresh the cache if the container has updated
    // This helps with performance for frequent navigation
    const containerVersion = container.dataset.version || "0";
    if (
      focusableElementsCache.current.length === 0 ||
      parseInt(containerVersion) !== lastContainerUpdate.current
    ) {
      focusableElementsCache.current = Array.from(
        container.querySelectorAll(focusableSelector),
      ).filter(
        // Filter out hidden or disabled elements
        (el) =>
          !el.hasAttribute("disabled") &&
          !el.getAttribute("aria-hidden") &&
          el.getBoundingClientRect().width > 0,
      ) as HTMLElement[];

      lastContainerUpdate.current = parseInt(containerVersion || "0");
    }

    return focusableElementsCache.current;
  }, [containerRef]);

  /**
   * Navigate focus in the specified direction
   */
  const navigate = useCallback(
    (direction: "next" | "prev") => {
      const focusables = getFocusableElements();
      if (focusables.length === 0) return;

      const activeElement = document.activeElement as HTMLElement;
      const currentIndex = focusables.indexOf(activeElement);

      // Determine which element to focus next
      let targetIndex;

      if (currentIndex === -1) {
        // If no element is focused within our container or the focus is outside
        targetIndex = direction === "next" ? 0 : focusables.length - 1;
      } else {
        // Calculate next position with wrap-around
        targetIndex =
          direction === "next"
            ? (currentIndex + 1) % focusables.length
            : (currentIndex - 1 + focusables.length) % focusables.length;
      }

      // Focus the target element
      focusables[targetIndex].focus();
    },
    [getFocusableElements],
  );

  /**
   * Reset the focus cache (useful when elements change)
   */
  const resetCache = useCallback(() => {
    focusableElementsCache.current = [];
  }, []);

  return {
    navigate,
    resetCache,
  };
}
