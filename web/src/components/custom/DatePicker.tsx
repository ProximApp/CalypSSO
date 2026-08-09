"use client";

import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useMotionTemplate, useMotionValue, motion } from "framer-motion";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

interface DatePickerProps {
  date?: Date;
  defaultDate?: Date;
  fromDate?: Date;
  toDate?: Date;
  setDate: (date?: Date) => void;
}

export function DatePicker({
  date,
  setDate,
  defaultDate,
  fromDate,
  toDate,
}: DatePickerProps) {
  const radius = 100; // change this to increase the rdaius of the hover effect
  const [visible, setVisible] = React.useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleMouseMove({ currentTarget, clientX, clientY }: any) {
    const { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <motion.div
          style={{
            background: useMotionTemplate`
        radial-gradient(
          ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
          hsl(var(--primary)),
          transparent 80%
        )
      `,
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setVisible(true)}
          onMouseLeave={() => setVisible(false)}
          className="group/input rounded-lg p-[2px] transition duration-300"
        >
          <Button
            variant={"outline"}
            className={cn(
              `bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full justify-start rounded-md border-none px-3 py-2 text-left text-sm transition duration-400 group-hover/input:shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-[2px] focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-[0px_0px_1px_1px_var(--color-neutral-700)]`,
              !date && "text-muted-foreground",
            )}
            type="button"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              format(date, "PPP", { locale: fr })
            ) : (
              <span>Sélectionner une date</span>
            )}
          </Button>
        </motion.div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          locale={fr}
          captionLayout="dropdown"
          startMonth={fromDate ?? new Date(1900)}
          endMonth={toDate ?? new Date()}
          defaultMonth={defaultDate}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
