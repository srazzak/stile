import { useShortcut } from "@/hooks/useShortcut";
import { cn } from "@/lib/utils";
import { Input } from "@base-ui-components/react";
import React, { useRef } from "react";

interface TodoInputProps extends React.ComponentProps<typeof Input> {
  completed: boolean;
}

export const TodoInput = React.forwardRef<
  React.ComponentRef<typeof Input>,
  TodoInputProps
>(({ completed, ...props }: TodoInputProps, ref) => {
  return (
    <Input
      ref={ref}
      className={cn(
        "text-foreground flex w-full items-center gap-1 p-1 outline-none transition-colors duration-100",
        completed ? "text-foreground-500/50 line-through decoration-2" : "",
      )}
      placeholder="Add title"
      disabled={completed}
      type="text"
      {...props}
    />
  );
});
TodoInput.displayName = "TodoInput";
