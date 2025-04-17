import React, { createContext, useContext, useMemo, useState } from "react";

interface TodoFiltersContextType {
  hideCompleted: boolean;
  setHideCompleted: (value: boolean) => void;
}

const TodoFiltersContext = createContext<TodoFiltersContextType>({
  hideCompleted: false,
  setHideCompleted: () => {},
});

export function TodoFiltersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hideCompleted, setHideCompleted] = useState(false);

  const value = useMemo(
    () => ({ hideCompleted, setHideCompleted }),
    [hideCompleted],
  );

  return (
    <TodoFiltersContext.Provider value={value}>
      {children}
    </TodoFiltersContext.Provider>
  );
}

export function useTodoFilters() {
  const context = useContext(TodoFiltersContext);
  if (context === undefined) {
    throw new Error("useTodoFilters must be used within a TodoFiltersProvider");
  }
  return context;
}
