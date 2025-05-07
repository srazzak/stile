import { useState, useRef, useEffect } from "react";
import { TodoItem } from "./todo";
import { type Todo } from "@/lib/storage/types";
import { useShortcut } from "@/hooks/useShortcut";
import { todoStore } from "@/lib/storage";
import { useKeyboard } from "@/contexts/keyboard-context";

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

  const { setActiveContext } = useKeyboard();

  useShortcut({
    key: ["x"],
    handler: () => focusedTodoId && todoStore.deleteTodo(focusedTodoId),
    description: "Delete a todo",
    contexts: ["todo"],
  });

  useShortcut({
    key: ["m", "l"],
    handler: () =>
      focusedTodoId &&
      todoStore.updateTodo(focusedTodoId, { sectionId: "later" }),
    description: "Move todo to later",
    contexts: ["todo"],
  });

  useShortcut({
    key: ["m", "t"],
    handler: () =>
      focusedTodoId &&
      todoStore.updateTodo(focusedTodoId, { sectionId: undefined }),
    description: "Move todo to today",
    contexts: ["todo"],
  });

  useShortcut({
    key: ["d"],
    handler: () =>
      focusedTodoId &&
      todoStore.updateTodo(focusedTodoId, {
        completed: true,
        completedAt: new Date(),
      }),
    description: "Complete todo",
    contexts: ["todo"],
  });

  useShortcut({
    key: ["u"],
    handler: () =>
      focusedTodoId &&
      todoStore.updateTodo(focusedTodoId, {
        completed: false,
        completedAt: undefined,
      }),
    description: "Un-complete todo",
    contexts: ["todo"],
  });

  function handleNavigate(dir: "next" | "prev") {
    if (focusedTodoId) {
      const activeEl = document.activeElement;

      if (dir === "prev") {
        const prevSibling = activeEl?.previousElementSibling;

        if (prevSibling?.tagName === "LI") {
          prevSibling.focus();
        }
      } else {
        const nextSibling = activeEl?.nextElementSibling;
        if (nextSibling?.tagName === "LI") {
          nextSibling.focus();
        }
      }
    } else {
      listRef.current?.firstElementChild?.focus();
    }
  }

  useShortcut({
    key: ["j"],
    handler: () => handleNavigate("next"),
    description: "Go to next todo",
    contexts: ["todo"],
  });

  useShortcut({
    key: ["k"],
    handler: () => handleNavigate("prev"),
    description: "Go to previous todo",
    contexts: ["todo"],
  });

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
          data-todo-id={todo.id}
          onFocus={() => {
            setFocusedTodoId(todo.id);
            setActiveContext("todo");
          }}
          onBlur={() => {
            setFocusedTodoId(null);
            setActiveContext("global");
          }}
        />
      ))}
    </ul>
  );
}
