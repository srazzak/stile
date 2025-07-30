import {
  forwardRef,
  type ComponentRef,
  type ComponentPropsWithoutRef,
  type ReactElement,
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
        className={cn("outline-none focus-within:outline-none", className)}
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
      "origin-[var(--transform-origin)] rounded-md bg-background-gradient py-1 text-foreground-500 shadow-lg shadow-gray-200 outline-1 outline-gray-100 min-w-24",
      "transition-[transform,scale,opacity]",
      "data-[ending-style]:scale-90 data-[starting-style]:scale-90",
      "data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
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

interface MenuItemProps {
  icon?: ReactElement[];
}

const MenuItem = forwardRef<
  ComponentRef<typeof BaseMenu.Item>,
  MenuItemProps & ComponentPropsWithoutRef<typeof BaseMenu.Item>
>(({ className, icon, ...props }, ref) => (
  <BaseMenu.Item
    ref={ref}
    className={cn(
      "flex items-center font-medium gap-2 cursor-default py-2 pr-8 pl-3 text-sm leading-4 select-none outline-none",
      "data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-foreground-500 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-background-900",
      className,
    )}
    {...props}
  >
    {icon}
    {props.children}
  </BaseMenu.Item>
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
