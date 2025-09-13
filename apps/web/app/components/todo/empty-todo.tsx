import { useState, useRef, forwardRef, type FormEvent } from "react";
import { todoStore } from "@/lib/storage";
import { TodoInput } from "./todo-input";
import { useLiveQuery } from "dexie-react-hooks";
import { useShortcut } from "@/hooks/useShortcut";
import { IconButton } from "../ui/icon-button/icon-button";
import { ArrowUpIcon, PlusIcon } from "@heroicons/react/16/solid";

interface EmptyTodoProps {
  sectionId: string;
  onNavigateToTodos?: () => void;
}

export const EmptyTodo = forwardRef<HTMLFormElement, EmptyTodoProps>(
  ({ sectionId }, ref) => {
    const [newTodoTitle, setNewTodoTitle] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useShortcut({
      key: ["c"],
      description: "Focus the todo input",
      handler: () => inputRef.current?.focus(),
      contexts: ["global"],
    });

    const todos = useLiveQuery(
      () => todoStore.getPendingTodos(sectionId),
      [sectionId],
      [],
    );

    const createTodo = async () => {
      if (newTodoTitle.trim()) {
        const newTodo = {
          title: newTodoTitle.trim(),
          description: "",
          sectionId: sectionId,
        };

        await todoStore.createTodo(newTodo);
        setNewTodoTitle("");
      }
    };

    function handleSubmit(e: FormEvent) {
      e.preventDefault();
      createTodo();
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
      if (e.key === "Escape") {
        e.currentTarget.blur();
        setNewTodoTitle("");
      }
    }

    if (todos.length < 10 || sectionId) {
      return (
        <form
          ref={ref}
          className="flex items-center w-full gap-1 py-1 pl-[14px] pr-1 focus-within:bg-[oklch(93.94%_0.013_71.33)] hover:bg-[oklch(93.94%_0.013_71.33)] duration-100"
          onSubmit={handleSubmit}
        >
          <div className="h-5 w-5 flex justify-between items-center">
            <PlusIcon className="h-4 w-4 text-foreground-500/50" />
          </div>
          <TodoInput
            type="text"
            id="title"
            ref={inputRef}
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a new todo..."
            completed={false}
          />
          {newTodoTitle.length > 0 ? (
            <IconButton type="submit" variant="green">
              <ArrowUpIcon className="h-4 w-4 text-green-700" />
            </IconButton>
          ) : null}
        </form>
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
