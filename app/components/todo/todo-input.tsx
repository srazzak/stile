import { cn } from "@/lib/utils";
import { Input } from "@base-ui-components/react";
import React from "react";

interface TodoInputProps extends React.ComponentProps<typeof Input> {
  completed: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const TodoInput = React.forwardRef<
  React.ComponentRef<typeof Input>,
  TodoInputProps
>(({ completed, onKeyDown, ...props }: TodoInputProps, ref) => {
  return (
    <Input
      className={cn(
        "text-foreground flex w-full items-center gap-1 p-1 outline-none transition-colors duration-100",
        completed ? "text-foreground/50 line-through" : "",
      )}
      onKeyDown={onKeyDown}
      disabled={completed}
      {...props}
      ref={ref}
    />
  );
});
TodoInput.displayName = "TodoInput";
