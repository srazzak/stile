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
      "origin-[var(--transform-origin)] rounded-md bg-background-gradient py-1 text-foreground shadow-lg shadow-gray-200 outline-1 outline-gray-200 min-w-24",
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
    className={cn("text-xs text-background-100", className)}
    {...props}
  />
));
MenuGroupLabel.displayName = "MenuGroupLabel";

const MenuItem = forwardRef<
  ComponentRef<typeof BaseMenu.Item>,
  ComponentPropsWithoutRef<typeof BaseMenu.Item>
>(({ className, ...props }, ref) => (
  <BaseMenu.Item
    ref={ref}
    className={cn(
      "flex cursor-default py-2 pr-8 pl-3 text-sm leading-4 outline-none select-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-foreground-500 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-background-900",
      className,
    )}
    {...props}
  />
));

export {
  Menu,
  MenuTrigger,
  MenuPositioner,
  MenuPopup,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
};
