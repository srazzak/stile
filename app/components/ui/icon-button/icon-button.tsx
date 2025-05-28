import { forwardRef, type ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import styles from "./icon-button.module.css";
import { cn } from "@/lib/utils";

const iconButtonVariants = cva(
  // base styles
  styles.iconButton,
  {
    variants: {
      variant: {
        default: styles.default,
        green: styles.green,
        red: styles.red,
        withText: styles.withText,
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface IconButtonProps
  extends ComponentProps<"button">,
    VariantProps<typeof iconButtonVariants> {}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, className, variant, ...props }, ref) => {
    return (
      <button
        className={cn(iconButtonVariants({ variant, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  },
);
IconButton.displayName = "IconButton";

export { IconButton, iconButtonVariants };
