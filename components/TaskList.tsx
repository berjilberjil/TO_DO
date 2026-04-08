"use client";

import { AnimatePresence, motion } from "framer-motion";
import TaskItem from "./TaskItem";
import EmptyState from "./EmptyState";
import type { Task } from "@/lib/storage";

type Filter = "all" | "active" | "done";

interface TaskListProps {
  tasks: Task[];
  filter: Filter;
  searchQuery: string;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TaskList({
  tasks,
  filter,
  searchQuery,
  onToggle,
  onDelete,
}: TaskListProps) {
  let filtered = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "done") return t.completed;
    return true;
  });

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter((t) => t.title.toLowerCase().includes(q));
  }

  if (filtered.length === 0) {
    if (searchQuery) {
      return (
        <EmptyState
          mood="think"
          message={`Nothing found for "${searchQuery}"`}
        />
      );
    }
    if (filter === "done") {
      return (
        <EmptyState
          mood="idle"
          message="No completed tasks yet. Keep going!"
        />
      );
    }
    return <EmptyState mood="sad" message="No tasks yet. Add your first task above!" />;
  }

  return (
    <motion.div layout className="flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {filtered.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
