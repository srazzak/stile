import { useState, useRef, useEffect } from "react";
import { TodoItem } from "./todo-item";
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

  const { setActiveContext } = useKeyboard();

  function handleMove(sectionId: string | undefined) {
    if (focusedTodoId) {
      todoStore.updateTodo(focusedTodoId, { sectionId: sectionId });
    }

    handleNavigate("next");
  }

  function handleDelete() {
    if (focusedTodoId) {
      todoStore.deleteTodo(focusedTodoId);
    }

    handleNavigate("next");
  }

  useShortcut({
    key: ["d"],
    handler: handleDelete,
    description: "Delete a todo",
    contexts: ["todo"],
  });

  useShortcut({
    key: ["m", "l"],
    handler: () => handleMove("later"),
    description: "Move todo to later",
    contexts: ["todo"],
  });

  useShortcut({
    key: ["m", "t"],
    handler: () => handleMove(undefined),
    description: "Move todo to today",
    contexts: ["todo"],
  });

  function handleComplete() {
    if (focusedTodoId) {
      const focusedTodo = todos.find((t) => t.id === focusedTodoId);

      if (!focusedTodo) return;

      if (focusedTodo.completed) {
        todoStore.updateTodo(focusedTodoId, {
          completed: false,
          completedAt: undefined,
        });
      } else {
        todoStore.updateTodo(focusedTodoId, {
          completed: true,
          completedAt: new Date(),
        });
      }
    }
  }

  useShortcut({
    key: ["t"],
    handler: handleComplete,
    description: "Toggle complete",
    contexts: ["todo"],
  });

  function handleNavigate(dir: "next" | "prev") {
    if (focusedTodoId) {
      const activeTodoEl = document.querySelector(
        `[data-todo-id="${focusedTodoId}"]`,
      );

      if (dir === "prev") {
        const prevSibling = activeTodoEl?.previousElementSibling as HTMLElement;

        if (prevSibling?.tagName === "LI") {
          prevSibling.focus();
        }
      } else {
        const nextSibling = activeTodoEl?.nextElementSibling as HTMLElement;
        console.log(nextSibling);
        if (nextSibling?.tagName === "LI") {
          nextSibling.focus();
        }
      }
    } else {
      const firstEl = listRef.current?.firstElementChild as HTMLElement;

      if (firstEl) {
        firstEl.focus();
      } else {
        setActiveContext("global");
      }
    }
  }

  useShortcut({
    key: ["j"],
    handler: () => handleNavigate("next"),
    description: "Go to next todo",
    contexts: ["global"],
  });

  useShortcut({
    key: ["k"],
    handler: () => handleNavigate("prev"),
    description: "Go to previous todo",
    contexts: ["global"],
  });

  useShortcut({
    key: ["arrowdown"],
    handler: () => handleNavigate("next"),
    description: "Go to next todo",
    contexts: ["global"],
  });

  useShortcut({
    key: ["arrowup"],
    handler: () => handleNavigate("prev"),
    description: "Go to previous todo",
    contexts: ["global"],
  });

  function handleFocusActive() {
    if (focusedTodoId) {
      const activeTodoEl = document.querySelector(
        `[data-todo-id="${focusedTodoId}"]`,
      ) as HTMLElement | null;

      if (activeTodoEl) {
        // Find the input element within the focused todo item
        const inputElement = activeTodoEl.querySelector(
          "input[type='text']",
        ) as HTMLInputElement | null;

        if (inputElement) {
          inputElement.select();
        }
      }
    }
  }

  useShortcut({
    key: ["e"],
    handler: handleFocusActive,
    description: "Focus active todo input",
    contexts: ["todo"],
  });

  return (
    <ul
      ref={listRef}
      className="flex h-full w-full flex-col space-y-[1px]"
      role="list"
    >
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
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
