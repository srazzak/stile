import * as React from "react";
import { Popover as BasePopover } from "@base-ui-components/react";
import { cn } from "@/lib/utils";

const Popover = BasePopover.Root;

const PopoverTrigger = BasePopover.Trigger;

const PopoverPositioner = React.forwardRef<
  React.ComponentRef<typeof BasePopover.Positioner>,
  React.ComponentPropsWithoutRef<typeof BasePopover.Positioner>
>(
  (
    { className, align = "center", sideOffset = 4, children, ...props },
    ref
  ) => (
    <BasePopover.Portal>
      <BasePopover.Positioner
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn("z-50", className)}
        {...props}
      >
        {children}
      </BasePopover.Positioner>
    </BasePopover.Portal>
  )
);
PopoverPositioner.displayName = "PopoverPositioner";

const PopoverPopup = React.forwardRef<
  React.ComponentRef<typeof BasePopover.Popup>,
  React.ComponentPropsWithoutRef<typeof BasePopover.Popup>
>(({ className, ...props }, ref) => (
  <BasePopover.Popup
    ref={ref}
    className={cn(
      "w-72 origin-[var(--transform-origin)] rounded-xl border border-gray-200 bg-white p-4 shadow-md duration-150 outline-none",
      "transition-[scale,opacity]",
      "data-[ending-style]:scale-90 data-[starting-style]:scale-90",
      "data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
      "data-[side=bottom]:slide-in-from-top-2",
      "data-[side=left]:slide-in-from-right-2",
      "data-[side=right]:slide-in-from-left-2",
      "data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
PopoverPopup.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverPositioner, PopoverPopup };
