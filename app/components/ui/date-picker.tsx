import { useState, useRef } from "react";
import { format } from "date-fns";
import * as chrono from "chrono-node";
import { Calendar } from "./calendar";
import {
  Popover,
  PopoverPopup,
  PopoverPositioner,
  PopoverTrigger,
} from "./popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@heroicons/react/16/solid";

export interface DatePickerProps {
  selectedDate?: Date;
  setSelectedDate: (date: Date | undefined) => void;
  className?: string;
  tabIndex?: number;
  ref?: React.Ref<HTMLButtonElement>;
  disabled?: boolean;
}

const DatePicker = ({
  selectedDate,
  setSelectedDate,
  className,
  tabIndex,
  ref,
  disabled = false,
}: DatePickerProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (inputValue.trim() === "") {
        return;
      } else {
        const parsedDate = chrono.parseDate(inputValue);
        if (parsedDate) {
          // Commit the selection on Enter
          setSelectedDate(parsedDate);
        }
      }
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={disabled}
        data-has-value={!!selectedDate}
        className="inline-flex shrink-0 cursor-pointer gap-1 rounded-lg bg-transparent p-2 text-xs duration-75 hover:bg-[#EFD7BF] data-[popup-open]:bg-[#efd7bf]"
        ref={ref}
        tabIndex={tabIndex}
      >
        {selectedDate ? null : (
          <CalendarIcon className="text-foreground/70 h-4 w-4" />
        )}
        {selectedDate ? format(selectedDate, "MMM dd") : ""}
      </PopoverTrigger>
      <PopoverPositioner align="start" side="right">
        <PopoverPopup
          className={cn(
            "bg-background-950 flex w-auto flex-col p-0",
            className
          )}
          initialFocus={inputRef}
        >
          <div className="p-2">
            <input
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              placeholder="Type a date like 'tomorrow'"
              className="w-full p-2 text-sm"
            />
          </div>
          <div className="flex h-[1px] w-full bg-gray-200"></div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            autoFocus={!!selectedDate}
          />
        </PopoverPopup>
      </PopoverPositioner>
    </Popover>
  );
};

export { DatePicker };
