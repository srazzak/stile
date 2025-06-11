import { Tabs as BaseTabs } from "@base-ui-components/react/tabs";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

function Tabs({ ...props }: ComponentProps<typeof BaseTabs.Root>) {
  return (
    <BaseTabs.Root
      className={cn("flex flex-col w-full", props.className)}
      {...props}
    />
  );
}

function TabsList({ ...props }: ComponentProps<typeof BaseTabs.List>) {
  return (
    <BaseTabs.List className={cn("relative z-0 inline-flex gap-4")} {...props}>
      {props.children}
      <TabsIndicator />
    </BaseTabs.List>
  );
}

function TabsIndicator({
  ...props
}: ComponentProps<typeof BaseTabs.Indicator>) {
  return (
    <BaseTabs.Indicator
      className={cn(
        "absolute bottom-0 left-0 z-[-1] h-px bg-foreground-500 w-[var(--active-tab-width)] -translate-y-1/2 translate-x-[var(--active-tab-left)]",
        "transition-all duration-200 ease-in-out",
      )}
      {...props}
    />
  );
}

function TabsPanel({ ...props }: ComponentProps<typeof BaseTabs.Panel>) {
  return (
    <BaseTabs.Panel
      className={cn(
        "w-full h-full",
        "transition-transform duration-200",
        props.className,
      )}
      {...props}
    />
  );
}

function TabsTab({ ...props }: ComponentProps<typeof BaseTabs.Tab>) {
  return (
    <BaseTabs.Tab
      className={cn(
        "font-serif font-medium text-gray-400 outline-none select-none data-[selected]:text-foreground-500 hover:text-gray-500 duration-200",
        props.className,
      )}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsPanel, TabsTab };
