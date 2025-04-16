import {
  forwardRef,
  type ComponentRef,
  type ComponentPropsWithoutRef,
} from "react";
import { Menu as BaseMenu } from "@base-ui-components/react";
import { cn } from "@/lib/utils";

const Menu = BaseMenu.Root;

const MenuTrigger = BaseMenu.Trigger;

const MenuPositioner = forwardRef<
  ComponentRef<typeof BaseMenu.Positioner>,
  ComponentPropsWithoutRef<typeof BaseMenu.Positioner>
>(
  (
    { className, align = "center", sideOffset = 4, children, ...props },
    ref,
  ) => (
    <BaseMenu.Portal>
      <BaseMenu.Positioner
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn("z-50", className)}
        {...props}
      >
        {children}
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  ),
);
MenuPositioner.displayName = "MenuPositioner";

const MenuPopup = forwardRef<
  ComponentRef<typeof BaseMenu.Popup>,
  ComponentPropsWithoutRef<typeof BaseMenu.Popup>
>(({ className, ...props }, ref) => (
  <BaseMenu.Popup
    ref={ref}
    className={cn(
      "w-60 origin-[var(--transform-origin)] rounded-xl border border-gray-200 shadow bg-background-950 p-4 duration-150 outline-none",
      "transition-[scale,opacity]",
      "data-[ending-style]:scale-90 data-[starting-style]:scale-90",
      "data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
      "data-[side=bottom]:slide-in-from-top-2",
      "data-[side=left]:slide-in-from-right-2",
      "data-[side=right]:slide-in-from-left-2",
      "data-[side=top]:slide-in-from-bottom-2",
      className,
    )}
    {...props}
  />
));
MenuPopup.displayName = "MenuContent";

const MenuGroup = BaseMenu.Group;

const MenuGroupLabel = forwardRef<
  ComponentRef<typeof BaseMenu.GroupLabel>,
  ComponentPropsWithoutRef<typeof BaseMenu.GroupLabel>
>(({ className, ...props }, ref) => (
  <BaseMenu.GroupLabel
    ref={ref}
    className={cn("text-sm text-background-100", className)}
    {...props}
  />
));
MenuGroupLabel.displayName = "MenuGroupLabel";

export {
  Menu,
  MenuTrigger,
  MenuPositioner,
  MenuPopup,
  MenuGroup,
  MenuGroupLabel,
};
