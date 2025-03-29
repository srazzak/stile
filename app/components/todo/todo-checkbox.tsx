import React, { forwardRef } from "react";
import { Checkbox } from "../ui/checkbox";

interface TodoCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  tabIndex?: number;
  onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
}

export const TodoCheckbox = forwardRef<HTMLButtonElement, TodoCheckboxProps>(
  ({ checked, onCheckedChange, tabIndex = 0, onKeyDown }, ref) => {
    return (
      <Checkbox
        ref={ref}
        role="checkbox"
        aria-checked={checked}
        tabIndex={tabIndex}
        checked={checked}
        onCheckedChange={onCheckedChange}
        onKeyDown={(e) => {
          if (onKeyDown) {
            onKeyDown(e);
          }
        }}
      />
    );
  },
);

TodoCheckbox.displayName = "TodoCheckbox";
