import { useState, useEffect, useRef, useCallback } from "react";
import { todoStore } from "@/lib/storage";
import { useFocusNavigation } from "@/hooks/useFocusNavigation";
import { type Todo } from "@/lib/storage/types";
import { TodoCheckbox } from "./todo-checkbox";
import { TodoInput } from "./todo-input";
import { TrashIcon } from "@heroicons/react/16/solid";
import styles from "./todo.module.css";
import { Button } from "@/components/ui/button";
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
      <TooltipProvider delay={200}>
        <Tooltip>
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
      </TooltipProvider>
      <TodoInput
        type="text"
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleInputKeyDown}
        completed={todo.completed}
      />
      <TooltipProvider delay={200}>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="red"
                onClick={handleDelete}
                aria-label="Delete todo"
                className="p-[6px]"
              >
                <TrashIcon className="h-4 w-4 text-white" />
              </Button>
            }
          />
          <TooltipPositioner sideOffset={8} side="right">
            <TooltipPopup className="inline-flex gap-2">
              Delete
              <span>
                <Kbd>D</Kbd>
              </span>
            </TooltipPopup>
          </TooltipPositioner>
        </Tooltip>
      </TooltipProvider>
    </li>
  );
};
