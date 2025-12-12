"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import type { DateRange as DayPickerDateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface DateRange {
  from: Date;
  to: Date;
}

interface DateRangePickerProps {
  value?: DateRange;
  onChange: (range: DateRange | undefined) => void;
  className?: string;
}

export function DateRangePicker({
  value,
  onChange,
  className,
}: DateRangePickerProps) {
  const [date, setDate] = useState<DayPickerDateRange | undefined>(value);

  const handleDateChange = (newDate: DayPickerDateRange | undefined) => {
    console.log(newDate);
    setDate(newDate);
    if (newDate?.from && newDate?.to) {
      onChange({ from: newDate.from, to: newDate.to });
    } else {
      onChange(undefined);
    }
  };

  const setPreset = (days: number) => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);
    const range = { from, to };
    console.log(range);
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button>
            <CalendarIcon />
            {date?.from ? (
              date?.to ? (
                <>
                  {format(date.from, "LL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent>
          <div>
            <div>
              <div>
                <Button onClick={() => setPreset(7)}>Last 7 days</Button>
                <Button onClick={() => setPreset(14)}>Last 14 days</Button>
                <Button onClick={() => setPreset(30)}>Last 30 days</Button>
              </div>
              <Calendar
                autoFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={handleDateChange}
                numberOfMonths={2}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
