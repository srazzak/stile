import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type FormEvent,
} from "react";
import { todoStore } from "@/lib/storage";
import { useFocusNavigation } from "@/hooks/useFocusNavigation";
import { type Todo } from "@/lib/storage/types";
import { TodoCheckbox } from "./todo-checkbox";
import { TodoInput } from "./todo-input";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";
import styles from "./todo.module.css";
import {
  Tooltip,
  TooltipPopup,
  TooltipPositioner,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { IconButton } from "../ui/icon-button/icon-button";
import { ShortcutTooltip } from "../ui/shortcut-tooltip";

interface TodoItemProps {
  todo: Todo;
  onFocus: () => void;
  onBlur: () => void;
}

export const TodoItem = ({ todo, onFocus, onBlur }: TodoItemProps) => {
  const [title, setTitle] = useState(todo.title);

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

  return (
    <li
      ref={todoRef}
      className={cn(styles.todo)}
      aria-label={`Todo: ${todo.title}`}
      data-todo-id={todo.id}
      tabIndex={0}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <ShortcutTooltip content="Toggle complete" shortcut={["T"]}>
        <TooltipTrigger
          render={
            <TodoCheckbox
              checked={todo.completed}
              onCheckedChange={(checked) =>
                checked
                  ? handleUpdate({ completed: true, completedAt: new Date() })
                  : handleUpdate({ completed: false, completedAt: undefined })
              }
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
                type="text"
                id="todo-title"
                ref={inputRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                completed={todo.completed}
              />
            }
          />
        </ShortcutTooltip>
        {title !== todo.title ? (
          <IconButton type="submit" variant="green">
            <CheckIcon className="h-4 w-4 text-green-600" />
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
    <ShortcutTooltip
      content={targetText}
      shortcut={["M", todo.sectionId === "today" ? "L" : "T"]}
    >
      <TooltipTrigger
        render={
          <IconButton onClick={handleMove} aria-label="Move todo">
            {todo.sectionId === "later" ? (
              <ArrowLeftIcon className="h-4 w-4 text-foreground" />
            ) : (
              <ArrowRightIcon className="h-4 w-4 text-foreground/85" />
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
