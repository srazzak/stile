import type { PropsWithChildren } from "react";

export function Kbd({ children }: PropsWithChildren) {
  return (
    <kbd className="px-1 py-0.5 text-xs font-semibold bg-background-900 rounded">
      {children}
    </kbd>
  );
}
