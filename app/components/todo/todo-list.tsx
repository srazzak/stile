import { useState, useRef, useEffect } from "react";
import { TodoItem } from "./todo";
import { type Todo } from "@/lib/storage/types";
import { useTodoFilters } from "@/contexts/todo-filters-context";
import { useShortcut } from "@/hooks/useShortcut";
import { todoStore } from "@/lib/storage";

interface TodoListProps {
  todos: Todo[];
  sectionId?: string;
}

export function TodoList({ todos }: TodoListProps) {
  const [focusedTodoId, setFocusedTodoId] = useState<string | null>(null);
  const { hideCompleted } = useTodoFilters();
  const listRef = useRef<HTMLUListElement>(null);

  useShortcut({
    key: "x",
    handler: () => (focusedTodoId ? todoStore.deleteTodo(focusedTodoId) : null),
    description: "Delete a todo",
    contexts: ["global"],
  });

  useShortcut({
    key: "m l",
    handler: () => (focusedTodoId ? todoStore.updateTodo(focusedTodoId, { sectionId: "later" }) : null),
    description: "Move todo to later",
    contexts: ["global"],
  });

  useShortcut({
    key: "m t",
    handler: () => (focusedTodoId ? todoStore.updateTodo(focusedTodoId, { sectionId: undefined }) : null),
    description: "Move todo to today",
    contexts: ["global"],
  });

  useShortcut({
    key: "d",
    handler: () => (focusedTodoId ? todoStore.updateTodo(focusedTodoId, { completed: true, completedAt: new Date() }) : null),
    description: "Complete todo",
    contexts: ["global"],
  })

  useShortcut({
    key: "u",
    handler: () => (focusedTodoId ? todoStore.updateTodo(focusedTodoId, { completed: false, completedAt: undefined }) : null),
    description: "Un-complete todo",
    contexts: ["global"],
  })

  // Handle keyboard navigation between todos
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLLIElement>,
    index: number,
  ) => {
    if ((e.key === "ArrowDown" || e.key === "j") && index < todos.length - 1) {
      e.preventDefault();
      const nextIndex = index + 1;
      setFocusedTodoId(todos[nextIndex].id);
    } else if ((e.key === "ArrowUp" || e.key === "k") && index > 0) {
      e.preventDefault();
      const prevIndex = index - 1;
      setFocusedTodoId(todos[prevIndex].id);
    } else if (e.key === "Escape") {
      setFocusedTodoId(null);
    }
  };

  // Focus the todo item when focusedTodoId changes
  useEffect(() => {
    if (focusedTodoId && listRef.current) {
      const todoElement = listRef.current.querySelector(
        `[data-todo-id="${focusedTodoId}"]`,
      ) as HTMLElement;
      if (todoElement) {
        todoElement.focus();
      }
    }
  }, [focusedTodoId]);

  return (
    <ul
      ref={listRef}
      className="flex h-full w-full flex-col space-y-[1px]"
      role="list"
    >
      {todos
        .filter((todo) => !hideCompleted || !todo.completed)
        .map((todo, index) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onKeyDown={(e) => handleKeyDown(e, index)}
            data-todo-id={todo.id}
          />
        ))}
    </ul>
  );
}
