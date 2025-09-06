import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type FormEvent,
} from "react";
import { todoStore } from "@/lib/storage";
import { type Todo } from "@/lib/storage/types";
import { TodoCheckbox } from "./todo-checkbox";
import { TodoInput } from "./todo-input";
import {
  ArrowLeftEndOnRectangleIcon,
  ArrowRightEndOnRectangleIcon,
  ArrowRightIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";
import styles from "./todo.module.css";
import { TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { IconButton } from "../ui/icon-button/icon-button";
import { ShortcutTooltip } from "../ui/shortcut-tooltip";
import { useStore } from "@/stores/store";
import { useKeyboard } from "@/contexts/keyboard-context";

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem = ({ todo }: TodoItemProps) => {
  const [title, setTitle] = useState<
    string | number | readonly string[] | undefined
  >(todo.title);

  const setFocusedTodoId = useStore((state) => state.updateActiveTodo);

  const { setActiveContext } = useKeyboard();

  useEffect(() => {
    setTitle(todo.title);
  }, [todo.title]);

  const todoRef = useRef<HTMLLIElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpdate = useCallback(
    async (data: Partial<Todo>) => {
      if (title.trim()) {
        todoStore.updateTodo(todo.id, data);
      }
    },
    [title, todo.id],
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    handleUpdate({ title: title.trim() });
    todoRef.current?.focus();
  }

  function handleFocus() {
    setFocusedTodoId(todo.id);
    setActiveContext("todo");
  }

  function handleBlur(e: React.FocusEvent<HTMLLIElement>) {
    // check to see if blur was caused by a focus within the li (i.e. tabbing within the li)
    // if it isn't, then we reset the value
    const next = e.relatedTarget as Node | null;
    const leftContainer = !next || !e.currentTarget.contains(next);
    if (leftContainer) setTitle(todo.title);

    setFocusedTodoId(null);
    setActiveContext("global");
  }

  function handleCheckedChange(checked: boolean) {
    if (checked) {
      handleUpdate({ completed: true, completedAt: new Date() });
    } else {
      handleUpdate({ completed: false, completedAt: undefined });
    }
  }

  return (
    <li
      ref={todoRef}
      className={cn(styles.todo)}
      aria-label={`Todo: ${todo.title}`}
      data-todo-id={todo.id}
      tabIndex={0}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <ShortcutTooltip content="Toggle complete" shortcut={["T"]}>
        <TooltipTrigger
          render={
            <TodoCheckbox
              checked={todo.completed}
              onCheckedChange={handleCheckedChange}
            />
          }
        />
      </ShortcutTooltip>
      <form
        className="inline-flex justify-between w-full"
        onSubmit={handleSubmit}
      >
        <ShortcutTooltip align="start" content="Edit todo" shortcut={["E"]}>
          <TooltipTrigger
            render={
              <TodoInput
                id="todo-title"
                ref={inputRef}
                value={title}
                defaultValue={todo.title}
                onValueChange={setTitle}
                completed={todo.completed}
              />
            }
          />
        </ShortcutTooltip>
        {title !== todo.title ? (
          <IconButton type="submit" variant="green">
            <ArrowRightIcon className="h-4 w-4 text-green-600" />
          </IconButton>
        ) : null}
      </form>
      <TooltipProvider delay={200}>
        <MoveTodoButton todo={todo} />
        <DeleteTodoButton todo={todo} />
      </TooltipProvider>
    </li>
  );
};

function MoveTodoButton({ todo }: { todo: Todo }) {
  function handleMove() {
    if (todo.sectionId === "later") {
      todoStore.updateTodo(todo.id, { sectionId: "today" });
    } else {
      todoStore.updateTodo(todo.id, { sectionId: "later" });
    }
  }

  const targetText =
    todo.sectionId === "today" ? "Move to Later" : "Move to Today";

  return (
    <ShortcutTooltip content={targetText} shortcut={["M"]}>
      <TooltipTrigger
        render={
          <IconButton onClick={handleMove} aria-label="Move todo">
            {todo.sectionId === "today" ? (
              <ArrowRightEndOnRectangleIcon className="h-4 w-4 text-foreground-500/85" />
            ) : (
              <ArrowLeftEndOnRectangleIcon className="h-4 w-4 text-foreground-500/85" />
            )}
          </IconButton>
        }
      />
    </ShortcutTooltip>
  );
}

function DeleteTodoButton({ todo }: { todo: Todo }) {
  function handleDelete() {
    todoStore.deleteTodo(todo.id);
  }

  return (
    <ShortcutTooltip content="Delete" shortcut={["D"]}>
      <TooltipTrigger
        render={
          <IconButton
            variant="red"
            onClick={handleDelete}
            aria-label="Delete todo"
          >
            <TrashIcon className="h-4 w-4 text-[oklch(0.612_0.18_28.035_/_0.85)]" />
          </IconButton>
        }
      />
    </ShortcutTooltip>
  );
}
