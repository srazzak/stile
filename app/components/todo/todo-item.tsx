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
import { Kbd } from "../ui/kbd";
import { useKeyboard } from "@/contexts/keyboard-context";
import { useShortcut } from "@/hooks/useShortcut";
import { IconButton } from "../ui/icon-button/icon-button";

interface TodoItemProps {
  todo: Todo;
  onFocus: () => void;
  onBlur: () => void;
}

export const TodoItem = ({ todo, onFocus, onBlur }: TodoItemProps) => {
  const [title, setTitle] = useState(todo.title);
  const [isInnerFocusMode, setIsInnerFocusMode] = useState(false);

  const { setActiveContext } = useKeyboard();

  const todoRef = useRef<HTMLLIElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize the focus navigation hook
  const { navigate } = useFocusNavigation(todoRef);

  // Focus the input when editing starts
  useEffect(() => {
    if (isInnerFocusMode) {
      inputRef.current?.focus();
    }
  }, [isInnerFocusMode]);

  const handleUpdate = useCallback(
    async (data: Partial<Todo>) => {
      if (title.trim()) {
        todoStore.updateTodo(todo.id, data);
      }
    },
    [title, todo.id],
  );

  const handleDelete = async () => {
    todoStore.deleteTodo(todo.id);
  };

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    handleUpdate({ title: title.trim() });
    todoRef.current?.focus();
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (title.trim()) {
        handleUpdate({ title: title.trim() });
        exitInnerFocusMode();
      }
    }
  };

  const handleTodoKeyDown = (e: React.KeyboardEvent<HTMLLIElement>) => {
    // When not in inner focus mode
    if (!isInnerFocusMode) {
      // Handle entering inner focus mode
      if (e.key === "Enter") {
        e.preventDefault();
        setIsInnerFocusMode(true);
      } else if (e.key === "Escape") {
        e.preventDefault();
        todoRef.current?.blur();
      }

      // // Handle external list navigation
      // if (onKeyDown) {
      //   onKeyDown(e);
      // }

      // Other keys are passed through to parent handlers when not in inner focus mode
      return;
    }

    // When in inner focus mode
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        exitInnerFocusMode();
        break;

      case "Tab":
        if (e.shiftKey) {
          e.preventDefault();
          navigate("prev");
        } else {
          e.preventDefault();
          navigate("next");
        }
        break;
    }
  };

  const exitInnerFocusMode = () => {
    setIsInnerFocusMode(false);
    if (todoRef.current) {
      todoRef.current.focus();
    }
  };

  const handleBlur = () => {
    if (title.trim()) {
      handleUpdate({ title: title.trim() });
    } else {
      setTitle(todo.title);
    }

    setActiveContext("global");
  };

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
      <Tooltip delay={200}>
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
        <TooltipPositioner sideOffset={8} side="left">
          <TooltipPopup className="inline-flex gap-2">
            Toggle complete
            <span>
              <Kbd>T</Kbd>
            </span>
          </TooltipPopup>
        </TooltipPositioner>
      </Tooltip>
      <form
        className="inline-flex justify-between w-full"
        onSubmit={handleSubmit}
      >
        <TodoInput
          type="text"
          id="todo-title"
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          completed={todo.completed}
        />
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

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <IconButton onClick={handleMove} aria-label="Move todo">
            {todo.sectionId ? (
              <ArrowLeftIcon className="h-4 w-4 text-foreground" />
            ) : (
              <ArrowRightIcon className="h-4 w-4 text-foreground/85" />
            )}
          </IconButton>
        }
      />
      <TooltipPositioner sideOffset={8}>
        <TooltipPopup className="inline-flex gap-2">
          Move to {todo.sectionId === "today" ? "Today" : "Later"}
          <span>
            <Kbd>M</Kbd> then <Kbd>{todo.sectionId ? "T" : "L"}</Kbd>
          </span>
        </TooltipPopup>
      </TooltipPositioner>
    </Tooltip>
  );
}

function DeleteTodoButton({ todo }: { todo: Todo }) {
  function handleDelete() {
    todoStore.deleteTodo(todo.id);
  }

  return (
    <Tooltip>
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
      <TooltipPositioner sideOffset={8}>
        <TooltipPopup className="inline-flex gap-2">
          Delete
          <span>
            <Kbd>D</Kbd>
          </span>
        </TooltipPopup>
      </TooltipPositioner>
    </Tooltip>
  );
}
