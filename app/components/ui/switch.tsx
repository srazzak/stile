import { Switch as BaseSwitch } from "@base-ui-components/react";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";

export const Switch = forwardRef<
  ComponentRef<typeof BaseSwitch.Root>,
  ComponentPropsWithoutRef<typeof BaseSwitch.Root>
>((props, ref) => (
  <BaseSwitch.Root
    ref={ref}
    className="relative flex h-4 w-7 rounded-full bg-background-900 data-[checked]:bg-green-600 duration-100 transition-transform border border-gray-200"
    {...props}
  >
    <BaseSwitch.Thumb className="aspect-square h-full rounded-full bg-white transition-transform duration-150 data-[checked]:translate-x-3" />
  </BaseSwitch.Root>
));
Switch.displayName = "Switch";
