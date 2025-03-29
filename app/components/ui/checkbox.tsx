import React from "react";
import { Checkbox as BaseCheckbox } from "@base-ui-components/react";
import { CheckIcon } from "@heroicons/react/16/solid";

const Checkbox = React.forwardRef<
  React.ComponentRef<typeof BaseCheckbox.Root>,
  React.ComponentPropsWithoutRef<typeof BaseCheckbox.Root>
>(({ ...props }, ref) => (
  <BaseCheckbox.Root className="checkbox" {...props} ref={ref}>
    <BaseCheckbox.Indicator className="flex translate-y-[1px] transition-[opacity] data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 data-[unchecked]:hidden">
      <CheckIcon className="h-4 w-4 stroke-2 text-white data-[unchecked]:hidden" />
    </BaseCheckbox.Indicator>
  </BaseCheckbox.Root>
));
Checkbox.displayName = "Checkbox";

export { Checkbox };
