import { useState, type KeyboardEvent, useRef, forwardRef } from "react";
import { todoStore } from "@/lib/storage";
import { type Todo } from "@/lib/storage/types";
import { TodoInput } from "./todo-input";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipPopup,
  TooltipPositioner,
} from "../ui/tooltip";
import { DatePicker } from "../ui/date-picker";

interface EmptyTodoProps {
  sectionId?: string;
  onNavigateToTodos?: () => void;
}

export const EmptyTodo = forwardRef<HTMLDivElement, EmptyTodoProps>(
  ({ sectionId, onNavigateToTodos }, ref) => {
    const [newTodoTitle, setNewTodoTitle] = useState("");
    const [deadline, setDeadline] = useState<Date | undefined>(undefined);
    const inputRef = useRef<HTMLInputElement>(null);

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
        className="flex items-center justify-center py-1 pr-11 pl-10"
      >
        <TodoInput
          type="text"
          ref={inputRef}
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new todo..."
          completed={false}
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              render={
                <DatePicker
                  selectedDate={deadline}
                  setSelectedDate={setDeadline}
                />
              }
            />
            <TooltipPositioner>
              <TooltipPopup>Due date</TooltipPopup>
            </TooltipPositioner>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }
);

EmptyTodo.displayName = "EmptyTodo";
