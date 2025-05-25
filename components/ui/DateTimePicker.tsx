'use client';

import * as React from "react";
import { CalendarIcon } from "lucide-react"; // Changed from @radix-ui/react-icons
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface DateTimePickerProps {
  value?: Date;
  onChange?: (date?: Date) => void;
  disabled?: (date: Date) => boolean; // Added disabled prop for react-hook-form integration
}

export function DateTimePicker({ value, onChange, disabled }: DateTimePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value);
  const [isOpen, setIsOpen] = React.useState(false);

  // Hours for 12-hour format (1-12)
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5); // 0, 5, 10, ..., 55

  React.useEffect(() => {
    setDate(value);
  }, [value]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // Preserve time if date already exists, otherwise set to a default (e.g., midnight or current time)
      const newDateWithTime = new Date(selectedDate);
      if (date) {
        newDateWithTime.setHours(date.getHours());
        newDateWithTime.setMinutes(date.getMinutes());
        newDateWithTime.setSeconds(date.getSeconds());
      }
      setDate(newDateWithTime);
      if (onChange) {
        onChange(newDateWithTime);
      }
    } else {
      setDate(undefined);
      if (onChange) {
        onChange(undefined);
      }
    }
    // Keep popover open for time selection if preferred, or close it:
    // setIsOpen(false); // Uncomment to close after date selection
  };

  const handleTimeChange = (
    type: "hour" | "minute" | "ampm",
    timeValue: string
  ) => {
    const newDate = date ? new Date(date) : new Date(); // If no date, use current date to set time
    if (!date && type !== "ampm") { // Initialize date with current if not set, before setting hour/minute
        setDate(newDate); 
    }

    let currentHours = newDate.getHours();

    if (type === "hour") {
      const selectedHour = parseInt(timeValue);
      const isPM = currentHours >= 12;
      newDate.setHours(isPM ? (selectedHour % 12) + 12 : selectedHour % 12);
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(timeValue));
    } else if (type === "ampm") {
      if (timeValue === "PM" && currentHours < 12) {
        newDate.setHours(currentHours + 12);
      } else if (timeValue === "AM" && currentHours >= 12) {
        newDate.setHours(currentHours - 12);
      }
    }
    setDate(newDate);
    if (onChange) {
      onChange(newDate);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-12 text-base", // Matched height
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "MM/dd/yyyy hh:mm aa")
          ) : (
            <span>Pick a date and time</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            disabled={disabled} // Pass disabled prop to Calendar
          />
          <div className="flex flex-col sm:flex-row sm:h-[280px] border-l">
            <ScrollArea className="h-full w-full sm:w-auto">
              <div className="flex sm:flex-col p-2 items-center">
                {hours.map((hour) => (
                  <Button
                    key={`hour-${hour}`}
                    size="sm" // Adjusted size for better fit
                    variant={
                      date && (date.getHours() % 12 === hour % 12 || (date.getHours() % 12 === 0 && hour === 12)) // Handle 12 AM/PM correctly
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square my-0.5"
                    onClick={() => handleTimeChange("hour", hour.toString())}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="h-full w-full sm:w-auto border-l">
              <div className="flex sm:flex-col p-2 items-center">
                {minutes.map((minute) => (
                  <Button
                    key={`minute-${minute}`}
                    size="sm" // Adjusted size
                    variant={
                      date && date.getMinutes() === minute ? "default" : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square my-0.5"
                    onClick={() =>
                      handleTimeChange("minute", minute.toString())
                    }
                  >
                    {minute.toString().padStart(2, '0')}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="h-full w-full sm:w-auto border-l">
              <div className="flex sm:flex-col p-2 items-center">
                {["AM", "PM"].map((ampm) => (
                  <Button
                    key={ampm}
                    size="sm" // Adjusted size
                    variant={
                      date &&
                      ((ampm === "AM" && date.getHours() < 12) ||
                        (ampm === "PM" && date.getHours() >= 12))
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 my-0.5 h-auto py-2.5" // Adjusted height for AM/PM
                    onClick={() => handleTimeChange("ampm", ampm)}
                  >
                    {ampm}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
} 