import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from "react";

export type ViewType = "list" | "timeline";

export const ViewContext = createContext<{
  view: ViewType;
  setView: (view: ViewType) => void;
}>({
  view: "list",
  setView: () => {},
});

export function useView() {
  const context = useContext(ViewContext);
  if (!context) {
    throw new Error("useView must be used within a ViewProvider");
  }
  return context;
}

export function ViewProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewType>("list");

  const value = useMemo(() => ({ view, setView }), [view]);

  return <ViewContext.Provider value={value}>{children}</ViewContext.Provider>;
}
