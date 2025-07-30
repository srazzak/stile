import { cn } from "@/lib/utils";
import { Separator as BaseSeparator } from "@base-ui-components/react";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";

export const Separator = forwardRef<
  ComponentRef<typeof BaseSeparator>,
  ComponentPropsWithoutRef<typeof BaseSeparator>
>((props, ref) => (
  <BaseSeparator
    className={cn(
      "bg-separator relative h-px w-full after:absolute after:bottom-[-1px] after:h-px after:w-full after:bg-white",
    )}
    {...props}
    ref={ref}
  />
));
Separator.displayName = BaseSeparator.displayName;
