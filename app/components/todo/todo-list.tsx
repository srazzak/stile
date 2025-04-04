import { useState, useRef, useEffect } from "react";
import { TodoItem } from "./todo";
import { EmptyTodo } from "./empty-todo";
import { type Todo } from "@/lib/storage/types";

interface TodoListProps {
  todos: Todo[];
  sectionId?: string;
}

export function TodoList({ todos, sectionId }: TodoListProps) {
  const [focusedTodoId, setFocusedTodoId] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const emptyTodoRef = useRef<HTMLDivElement>(null);

  // Handle keyboard navigation between todos
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLLIElement>,
    index: number,
  ) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (index + 1) % todos.length;
      setFocusedTodoId(todos[nextIndex].id);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = (index - 1 + todos.length) % todos.length;
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
        />
      ))}
      <EmptyTodo sectionId={sectionId} ref={emptyTodoRef} />
    </ul>
  );
}
