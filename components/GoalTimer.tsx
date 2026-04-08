"use client";

import { differenceInDays, differenceInHours, parseISO, isPast } from "date-fns";
import ClockAnimation from "./ClockAnimation";

interface GoalTimerProps {
  targetDate: string;
}

export default function GoalTimer({ targetDate }: GoalTimerProps) {
  const target = parseISO(targetDate);
  const overdue = isPast(target);
  const days = Math.abs(differenceInDays(target, new Date()));
  const hours = Math.abs(differenceInHours(target, new Date())) % 24;

  return (
    <span className="inline-flex items-center gap-1.5">
      <ClockAnimation size={16} showDigital={false} />
      {overdue ? (
        <span className="text-red-500 font-medium">
          {days}d {hours}h overdue
        </span>
      ) : (
        <span className="text-gray-500 dark:text-gray-400">
          {days}d {hours}h left
        </span>
      )}
    </span>
  );
}
