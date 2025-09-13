import { useRef, useEffect } from "react";
import { TodoItem } from "./todo-item";
import { type Todo } from "@/lib/storage/types";
import { useShortcut } from "@/hooks/useShortcut";
import { todoStore } from "@/lib/storage";
import { useKeyboard } from "@/contexts/keyboard-context";
import { useStore } from "@/stores/store";

interface TodoListProps {
  todos: Todo[];
}

export function TodoList({ todos }: TodoListProps) {
  const listRef = useRef<HTMLUListElement>(null);

  const activeTodo = useStore((state) => state.activeTodo);
  const updateActiveTodo = useStore((state) => state.updateActiveTodo);
  const lastActiveTodo = useStore((state) => state.lastActiveTodo);
  const updateLastActiveTodo = useStore((state) => state.updateLastActiveTodo);

  const { setActiveContext } = useKeyboard();

  useEffect(() => {
    setActiveContext("global");

    return () => {
      updateLastActiveTodo(null);
      updateActiveTodo(null);
    };
  }, []);

  function handleMove() {
    if (activeTodo) {
      const todo = todos.find((todo) => todo.id === activeTodo);

      todoStore.updateTodo(activeTodo, {
        sectionId: todo?.sectionId === "today" ? "later" : "today",
      });
    }

    handleNavigate("next");
  }

  function handleDelete() {
    if (activeTodo) {
      todoStore.deleteTodo(activeTodo);
    }

    handleNavigate("next");
  }

  function getTodoEl(id: string): HTMLElement | null {
    return document.querySelector(`[data-todo-id="${id}"]`);
  }

  useShortcut({
    key: ["d"],
    handler: handleDelete,
    description: "Delete a todo",
    contexts: ["todo"],
  });

  useShortcut({
    key: ["m"],
    handler: handleMove,
    description: "Move todo to later",
    contexts: ["todo"],
  });

  function handleComplete() {
    if (activeTodo) {
      const focusedTodo = todos.find((t) => t.id === activeTodo);

      if (!focusedTodo) return;

      if (focusedTodo.completed) {
        todoStore.updateTodo(activeTodo, {
          completed: false,
          completedAt: undefined,
        });
      } else {
        todoStore.updateTodo(activeTodo, {
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
    if (activeTodo) {
      const activeTodoEl = getTodoEl(activeTodo);

      if (dir === "prev") {
        const prevSibling = activeTodoEl?.previousElementSibling as HTMLElement;

        if (prevSibling?.tagName === "LI") {
          prevSibling.focus();
        }
      } else {
        const nextSibling = activeTodoEl?.nextElementSibling as HTMLElement;
        if (nextSibling?.tagName === "LI") {
          nextSibling.focus();
        }
      }
    } else {
      if (lastActiveTodo) {
        const lastActiveTodoEl = getTodoEl(lastActiveTodo);

        lastActiveTodoEl?.focus();
      } else {
        const firstEl = listRef.current?.firstElementChild as HTMLElement;
        const lastEl = listRef.current?.lastElementChild as HTMLElement;

        if (dir === "next" && firstEl) {
          firstEl.focus();
        } else if (dir === "prev" && lastEl) {
          lastEl.focus();
        } else {
          setActiveContext("global");
        }
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

  function handleEscape() {
    if (activeTodo) {
      const activeTodoEl = getTodoEl(activeTodo);

      updateLastActiveTodo(activeTodo);
      activeTodoEl?.blur();
    }
  }

  useShortcut({
    key: ["escape"],
    handler: handleEscape,
    description: "Blur currently active todo",
    contexts: ["global"],
  });

  function handleFocusActive() {
    if (activeTodo) {
      const activeTodoEl = getTodoEl(activeTodo);

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
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}
