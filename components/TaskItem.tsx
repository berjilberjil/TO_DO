"use client";

import { motion } from "framer-motion";
import { isPast, parseISO, format } from "date-fns";
import type { Task } from "@/lib/storage";

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const priorityBadge: Record<string, string> = {
  low: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
  high: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
};

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const overdue =
    task.dueDate && !task.completed && isPast(parseISO(task.dueDate));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ x: 60, opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="flex items-center gap-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4 bg-white dark:bg-gray-800"
    >
      <motion.input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        whileTap={{ scale: 1.2 }}
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 shrink-0 cursor-pointer"
      />
      <div className="flex-1 min-w-0">
        <span
          className={`text-sm block truncate ${
            task.completed
              ? "line-through text-gray-400 dark:text-gray-500"
              : "text-gray-900 dark:text-white"
          }`}
        >
          {task.title}
        </span>
        <div className="flex items-center gap-2 mt-1">
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${priorityBadge[task.priority]}`}
          >
            {task.priority}
          </span>
          {task.dueDate && (
            <span
              className={`text-[10px] ${
                overdue
                  ? "text-red-500 font-medium"
                  : "text-gray-400 dark:text-gray-500"
              }`}
            >
              {overdue ? "Overdue: " : "Due: "}
              {format(parseISO(task.dueDate), "MMM d")}
            </span>
          )}
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onDelete(task.id)}
        className="text-red-400 hover:text-red-600 transition-colors text-sm font-medium shrink-0"
      >
        Delete
      </motion.button>
    </motion.div>
  );
}
