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

interface TodoItemProps {
  todo: Todo;
  onKeyDown?: (e: React.KeyboardEvent<HTMLLIElement>) => void;
  "data-todo-id"?: string;
}

export const TodoItem = ({
  todo,
  onKeyDown,
  "data-todo-id": dataTodoId,
}: TodoItemProps) => {
  const [title, setTitle] = useState(todo.title);
  const [deadline, setDeadline] = useState(todo.deadline);

  const [isInnerFocusMode, setIsInnerFocusMode] = useState(false);

  const todoRef = useRef<HTMLLIElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);
  const checkboxRef = useRef<HTMLButtonElement>(null);

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

  useEffect(() => {
    handleUpdate({ deadline: deadline });
  }, [deadline, handleUpdate]);

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

      // Handle external list navigation
      if (onKeyDown) {
        onKeyDown(e);
      }

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
    // setIsEditing is handled by the useEffect
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
  };

  return (
    <li
      ref={todoRef}
      className={cn(styles.todo, isInnerFocusMode ? styles.innerFocusMode : "")}
      tabIndex={isInnerFocusMode ? -1 : 0}
      onKeyDown={handleTodoKeyDown}
      aria-label={`Todo: ${todo.title}`}
      data-todo-id={dataTodoId}
    >
      <TodoCheckbox
        ref={checkboxRef}
        checked={todo.completed}
        onCheckedChange={(checked) =>
          handleUpdate({
            completed: checked,
            completedAt: checked ? new Date() : undefined,
          })
        }
        tabIndex={isInnerFocusMode ? 0 : -1}
      />
      <TodoInput
        type="text"
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleInputKeyDown}
        completed={todo.completed}
        disabled={todo.completed}
        tabIndex={isInnerFocusMode ? 0 : -1}
        onFocus={() => setIsInnerFocusMode(true)}
      />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                ref={deleteButtonRef}
                variant="red"
                onClick={handleDelete}
                aria-label="Delete todo"
                tabIndex={isInnerFocusMode ? 0 : -1}
                className="p-[6px]"
              >
                <TrashIcon className="h-4 w-4 text-white" />
              </Button>
            }
          />
          <TooltipPositioner>
            <TooltipPopup>Delete</TooltipPopup>
          </TooltipPositioner>
        </Tooltip>
      </TooltipProvider>
    </li>
  );
};
