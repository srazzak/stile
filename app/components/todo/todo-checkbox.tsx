import React, { forwardRef } from "react";
import { Checkbox } from "../ui/checkbox";

interface TodoCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const TodoCheckbox = forwardRef<HTMLButtonElement, TodoCheckboxProps>(
  ({ checked, onCheckedChange }, ref) => {
    return (
      <Checkbox
        ref={ref}
        role="checkbox"
        aria-checked={checked}
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
    );
  },
);

TodoCheckbox.displayName = "TodoCheckbox";
