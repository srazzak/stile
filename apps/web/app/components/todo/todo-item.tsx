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
  ClockIcon,
  PaperAirplaneIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";
import styles from "./todo.module.css";
import { TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog as BaseDialog, Input } from "@base-ui-components/react";
import { cn } from "@/lib/utils";
import { IconButton } from "../ui/icon-button/icon-button";
import { ShortcutTooltip } from "../ui/shortcut-tooltip";
import { useStore } from "@/stores/store";
import { useKeyboard } from "@/contexts/keyboard-context";

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem = ({ todo }: TodoItemProps) => {
  const [title, setTitle] = useState<string>(todo.title);

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

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      e.currentTarget.blur();
      setTitle(todo.title);
    }
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
                onKeyDown={handleKeyDown}
                // TODO: strange TypeError where a SetStateAction<string> isn't
                // valid for the onValueChange handler in BaseUI need to investigate
                // @ts-ignore
                onValueChange={setTitle}
                completed={todo.completed}
              />
            }
          />
        </ShortcutTooltip>
        {title !== todo.title ? (
          <IconButton type="submit" variant="green">
            <ArrowRightIcon className="h-4 w-4 text-green-700" />
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

function FocusTaskButton({ todo }: { todo: Todo }) {
  const [open, setOpen] = useState(false);
  const [duration, setDuration] = useState<undefined | number>(30);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value;
    v = v.replace(/\D/g, "");

    if (v === "") {
      setDuration(undefined);
      return;
    }

    v = v.replace(/^0+/g, "");
    if (v === "") v = "0";

    if (v.length > 2) v = v.slice(0, 2);

    setDuration(Number(v));
  };

  function cleanup() {
    setDuration(30);
  }

  return (
    <BaseDialog.Root
      open={open}
      onOpenChange={setOpen}
      onOpenChangeComplete={cleanup}
    >
      <ShortcutTooltip content="Focus task" shortcut={["F"]}>
        <TooltipTrigger
          render={
            <BaseDialog.Trigger
              render={
                <IconButton>
                  <ClockIcon className="h-4 w-4 text-foreground-500/70" />
                </IconButton>
              }
            />
          }
        />
      </ShortcutTooltip>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="fixed h-full w-full inset-0 [background:var(--color-background-gradient)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 transition-all duration-200" />
        <BaseDialog.Popup className="absolute h-full w-full inset-0">
          <div className="flex flex-col items-center h-full w-full pt-60 gap-8">
            <div className="font-serif text-6xl text-foreground-900">
              {todo.title}
            </div>
            <Input
              type="number"
              value={duration}
              onChange={handleChange}
              max={90}
              className="ml-8 text-3xl font-semibold font-mono w-16"
            />
          </div>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

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
            <PaperAirplaneIcon className="h-4 w-4 text-foreground-500/70 -rotate-45" />
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
