import * as React from "react";
import { Input as BaseInput } from "@base-ui-components/react";

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<typeof BaseInput>
>((props, ref) => (
  <BaseInput className="rounded-sm p-2 duration-150" {...props} ref={ref} />
));
Input.displayName = "Input";

export { Input };
