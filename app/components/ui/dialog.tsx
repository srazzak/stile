import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui-components/react/dialog";
import { cn } from "@/lib/utils";
import { XMarkIcon } from "@heroicons/react/16/solid";

const Dialog = BaseDialog.Root;

const DialogPortal = BaseDialog.Portal;

const DialogTrigger = BaseDialog.Trigger;

const DialogClose = BaseDialog.Close;

const DialogBackdrop = React.forwardRef<
  React.ComponentRef<typeof BaseDialog.Backdrop>,
  React.ComponentPropsWithoutRef<typeof BaseDialog.Backdrop>
>(({ className, ...props }, ref) => (
  <BaseDialog.Backdrop
    ref={ref}
    className={cn(
      "fixed inset-0 bg-black opacity-10 transition-all duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
      className,
    )}
    {...props}
  />
));
DialogBackdrop.displayName = BaseDialog.Backdrop.displayName;

const DialogPopup = React.forwardRef<
  React.ComponentRef<typeof BaseDialog.Popup>,
  React.ComponentPropsWithoutRef<typeof BaseDialog.Popup>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogBackdrop />
    <BaseDialog.Popup
      ref={ref}
      className={cn(
        "shadow-background-100/30 fixed top-1/2 left-1/2 -mt-8 w-full h-full overflow-auto md:h-auto md:w-[650px] max-w-[calc(100vw-3rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#F0E9E0ae] bg-white/10 p-2 text-gray-900 shadow-2xl backdrop-blur-xs",
        "transition-[translate,scale,opacity,shadow] duration-150 data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0",
        className,
      )}
      {...props}
    >
      <div className="relative background-gradient w-full h-full overflow-auto rounded-lg border border-[#EFE7DE] bg-radial-[at_10%_10%] from-[oklch(96.44%_0.009_62.59)] to-[oklch(94.6%_0.018_64.93)] shadow-xs">
        <BaseDialog.Close className="fixed right-4 top-4">
          <XMarkIcon className="h-5 w-5 text-foreground/50 hover:text-foreground/70" />
        </BaseDialog.Close>
        {children}
      </div>
    </BaseDialog.Popup>
  </DialogPortal>
));
DialogPopup.displayName = BaseDialog.Popup.displayName;

const DialogTitle = BaseDialog.Title;

const DialogDescription = BaseDialog.Description;

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogBackdrop,
  DialogPopup,
  DialogTitle,
  DialogDescription,
  DialogClose,
};
