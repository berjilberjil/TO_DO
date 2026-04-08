"use client";

import { motion } from "framer-motion";
import ProgressRing from "./ProgressRing";
import GoalTimer from "./GoalTimer";
import type { Goal, Task } from "@/lib/storage";

interface GoalCardProps {
  goal: Goal;
  tasks: Task[];
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function GoalCard({ goal, tasks, onComplete, onDelete }: GoalCardProps) {
  const linkedTasks = tasks.filter((t) => goal.tasks.includes(t.id));
  const completedCount = linkedTasks.filter((t) => t.completed).length;
  const percentage = linkedTasks.length > 0 ? (completedCount / linkedTasks.length) * 100 : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 60 }}
      className="rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm"
    >
      <div className="flex items-start gap-4">
        <ProgressRing percentage={percentage} size={56} />
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-gray-900 dark:text-white truncate ${goal.completed ? "line-through text-gray-400 dark:text-gray-500" : ""}`}>
            {goal.title}
          </h3>
          {goal.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
              {goal.description}
            </p>
          )}
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 dark:text-gray-500">
            <span>{linkedTasks.length} tasks linked</span>
            <GoalTimer targetDate={goal.targetDate} />
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        {!goal.completed && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onComplete(goal.id)}
            className="text-xs px-3 py-1.5 rounded-lg bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 font-medium transition-colors hover:bg-green-200 dark:hover:bg-green-900/60"
          >
            Complete
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onDelete(goal.id)}
          className="text-xs px-3 py-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-colors"
        >
          Delete
        </motion.button>
      </div>
    </motion.div>
  );
}
