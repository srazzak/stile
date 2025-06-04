import { useState, useRef, forwardRef, type FormEvent } from "react";
import { todoStore } from "@/lib/storage";
import { TodoInput } from "./todo-input";
import { useLiveQuery } from "dexie-react-hooks";
import { useShortcut } from "@/hooks/useShortcut";
import { IconButton } from "../ui/icon-button/icon-button";
import { CheckIcon } from "@heroicons/react/16/solid";

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

    if (todos.length < 10 || sectionId) {
      return (
        <form
          ref={ref}
          className="flex items-center w-full gap-1 py-1 pr-1 pl-[36px]"
          onSubmit={handleSubmit}
        >
          <TodoInput
            type="text"
            id="title"
            ref={inputRef}
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            placeholder="Add a new todo..."
            completed={false}
          />
          {newTodoTitle.length > 0 ? (
            <IconButton type="submit" variant="green">
              <CheckIcon className="h-4 w-4 text-green-600" />
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
