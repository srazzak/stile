import { useState, type KeyboardEvent, useRef, forwardRef } from "react";
import { todoStore } from "@/lib/storage";
import { type Todo } from "@/lib/storage/types";
import { TodoInput } from "./todo-input";
import { useLiveQuery } from "dexie-react-hooks";
import { cn } from "@/lib/utils";
import { useShortcut } from "@/hooks/useShortcut";

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
      key: "c",
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

    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-center py-2 pr-11 pl-10")}
      >
        {todos.length <= 10 ? (
          <TodoInput
            type="text"
            ref={inputRef}
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a new todo..."
            completed={false}
          />
        ) : (
          <div className="text-neutral-400">
            There's too many todos, delete some to add more.
          </div>
        )}
      </div>
    );
  },
);

EmptyTodo.displayName = "EmptyTodo";
