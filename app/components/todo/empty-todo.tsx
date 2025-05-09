import { useState, type KeyboardEvent, useRef, forwardRef } from "react";
import { todoStore } from "@/lib/storage";
import { type Todo } from "@/lib/storage/types";
import { TodoInput } from "./todo-input";
import { useLiveQuery } from "dexie-react-hooks";
import { cn } from "@/lib/utils";
import { useShortcut } from "@/hooks/useShortcut";
import styles from "./todo.module.css";
import { Checkbox } from "../ui/checkbox";

interface EmptyTodoProps {
  sectionId?: string;
  onNavigateToTodos?: () => void;
}

export const EmptyTodo = forwardRef<HTMLDivElement, EmptyTodoProps>(
  ({ sectionId, onNavigateToTodos }, ref) => {
    const [newTodoTitle, setNewTodoTitle] = useState("");
    const [deadline, setDeadline] = useState<Date | undefined>(undefined);
    const inputRef = useRef<HTMLInputElement>(null);

    useShortcut({
      key: ["c"],
      description: "Focus the todo input",
      handler: () => inputRef.current?.focus(),
      contexts: ["global"],
    });

    const todos = useLiveQuery(
      () => todoStore.getPendingTodos(),
      [sectionId],
      [],
    );

    const createTodo = async () => {
      if (newTodoTitle.trim()) {
        const newTodo: Omit<Todo, "createdAt" | "id"> = {
          title: newTodoTitle.trim(),
          description: "",
          completed: false,
          updatedAt: new Date(),
          deadline: deadline,
          sectionId: sectionId,
        };

        await todoStore.createTodo(newTodo);
        setNewTodoTitle("");
        setDeadline(undefined);
      }
    };

    const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        await createTodo();
      } else if (e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey)) {
        e.preventDefault();
        if (onNavigateToTodos) {
          onNavigateToTodos();
        }
      }
    };

    if (todos.length < 10 || sectionId) {
      return (
        <div
          ref={ref}
          className="flex items-center w-full gap-2 py-2 pr-1 pl-3"
        >
          <Checkbox disabled />
          <TodoInput
            type="text"
            ref={inputRef}
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a new todo..."
            completed={false}
          />
        </div>
      );
    } else {
      return (
        <div className="w-full text-center text-neutral-400 mt-4">
          There's too many todos, delete some to add more.
        </div>
      );
    }
  },
);

EmptyTodo.displayName = "EmptyTodo";
