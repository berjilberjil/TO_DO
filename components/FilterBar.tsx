"use client";

import type { Task } from "@/lib/storage";

type Filter = "all" | "active" | "done";

interface FilterBarProps {
  filter: Filter;
  setFilter: (f: Filter) => void;
  tasks: Task[];
}

export default function FilterBar({ filter, setFilter, tasks }: FilterBarProps) {
  const allCount = tasks.length;
  const activeCount = tasks.filter((t) => !t.completed).length;
  const doneCount = tasks.filter((t) => t.completed).length;

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "All", count: allCount },
    { key: "active", label: "Active", count: activeCount },
    { key: "done", label: "Done", count: doneCount },
  ];

  return (
    <div className="flex gap-2 mb-4">
      {filters.map((f) => (
        <button
          key={f.key}
          onClick={() => setFilter(f.key)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            filter === f.key
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          {f.label}
          <span
            className={`ml-1.5 text-xs ${
              filter === f.key ? "text-blue-500 dark:text-blue-300" : "text-gray-400"
            }`}
          >
            {f.count}
          </span>
        </button>
      ))}
    </div>
  );
}
