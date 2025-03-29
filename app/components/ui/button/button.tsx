import React, { type ComponentProps } from "react";
import styles from "./button.module.css";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(styles.button, {
  variants: {
    variant: {
      primary: styles.primary,
      secondary: styles.secondary,
      red: styles.red,
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

interface ButtonProps
  extends ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  iconLeft?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, className, iconLeft, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, className }))}
        ref={ref}
        {...props}
      >
        {iconLeft && <span className={styles.icon}>{iconLeft}</span>}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button };
