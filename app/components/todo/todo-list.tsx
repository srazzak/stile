import { useState, useRef, useEffect } from "react";
import { TodoItem } from "./todo";
import { type Todo } from "@/lib/storage/types";

interface TodoListProps {
  todos: Todo[];
  sectionId?: string;
}

export function TodoList({ todos }: TodoListProps) {
  const [focusedTodoId, setFocusedTodoId] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

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
      {todos.map((todo, index) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onKeyDown={(e) => handleKeyDown(e, index)}
          data-todo-id={todo.id}
          onFocusCapture={() => setFocusedTodoId(todo.id)}
        />
      ))}
    </ul>
  );
}
