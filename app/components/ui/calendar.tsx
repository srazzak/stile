import * as React from "react";
import { DayPicker } from "react-day-picker";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

const Calendar = ({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) => {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "relative flex flex-col sm:flex-row space-y-4",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "absolute end-0 flex items-center gap-1",
        nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-gray-500 rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        weekday: "text-xs font-medium text-gray-500",
        day: cn(
          "relative p-0 text-center text-xs first:text-gray-400 last::text-gray-400 focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-stone-200 [&:has([aria-selected].day-outside)]:bg-gray-100"
        ),
        day_button: "rounded h-8 w-8 p-0 font-normal aria-selected:opacity-100",
        selected: "bg-foreground text-white rounded font-semibold",
        today: "bg-background rounded-md",
        outside:
          "text-gray-300 aria-selected:bg-stone-200/50 aria-selected:text-gray-500",
        disabled: "text-gray-500 opacity-50",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: (props) => {
          if (props.orientation === "left") {
            return <ChevronLeftIcon className="h-6 w-6" />;
          } else {
            return <ChevronRightIcon className="h-6 w-6" />;
          }
        },
      }}
      {...props}
    />
  );
};
Calendar.displayName = "Calendar";

export { Calendar };
