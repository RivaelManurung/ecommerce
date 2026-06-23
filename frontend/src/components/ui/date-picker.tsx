"use client";

import * as React from "react";
import { format, isValid, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface AdminDatePickerProps {
  value: string; // "YYYY-MM-DD"
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * Shadcn DatePicker implementation using Radix Popover and react-day-picker Calendar.
 */
export function AdminDatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  disabled,
}: AdminDatePickerProps) {
  // Convert string "YYYY-MM-DD" to Date object for the Calendar
  const [date, setDate] = React.useState<Date | undefined>(() => {
    if (!value) return undefined;
    const parsed = parseISO(value);
    return isValid(parsed) ? parsed : undefined;
  });

  // Sync prop changes
  React.useEffect(() => {
    if (!value) {
      setDate(undefined);
    } else {
      const parsed = parseISO(value);
      if (isValid(parsed)) setDate(parsed);
    }
  }, [value]);

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      onChange(format(selectedDate, "yyyy-MM-dd"));
    } else {
      onChange("");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          disabled={disabled}
          className={cn(
            "flex h-9 w-full items-center justify-start rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-none transition-colors",
            "hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20 focus-visible:border-gray-400",
            !date && "text-gray-500",
            disabled && "cursor-not-allowed opacity-50 hover:bg-white",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-gray-500 shrink-0" />
          <span className="flex-1 truncate text-left">
            {date ? format(date, "MMM d, yyyy") : placeholder}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
