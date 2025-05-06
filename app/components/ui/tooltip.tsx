import { cn } from "@/lib/utils";
import { Tooltip as TooltipPrimitive } from "@base-ui-components/react";
import React from "react";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipPositioner = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Positioner>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Positioner>
>(({ className, sideOffset = 2, children, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Positioner
      className={cn("z-50", className)}
      sideOffset={sideOffset}
      {...props}
      ref={ref}
    >
      {children}
    </TooltipPrimitive.Positioner>
  </TooltipPrimitive.Portal>
));
TooltipPositioner.displayName = TooltipPrimitive.Positioner.displayName;

const TooltipPopup = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Popup>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Popup>
>(({ className, children, ...props }, ref) => (
  <TooltipPrimitive.Popup
    className={cn(
      "z-50, rounded-md bg-background-950 border border-background-800 px-2 py-1 text-xs font-medium text-stone-500 duration-150 transition-[transform,opacity] data-[ending-style]:opacity-100 data-[starting-style]:opacity-0 data-[ending-style]:translate-y-1 data-[starting-style]:translate-y-1",
      className,
    )}
    {...props}
    ref={ref}
  >
    {children}
  </TooltipPrimitive.Popup>
));
TooltipPopup.displayName = TooltipPrimitive.Popup.displayName;

export {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipPositioner,
  TooltipPopup,
};
