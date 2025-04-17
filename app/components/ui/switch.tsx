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
    className="relative flex h-4 w-8 rounded-full bg-background-400 data-[checked]:bg-green-600"
    {...props}
  >
    <BaseSwitch.Thumb />
  </BaseSwitch.Root>
));
