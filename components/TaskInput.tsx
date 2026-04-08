"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface TaskInputProps {
  onAdd: (title: string, priority: "low" | "medium" | "high", dueDate: string | null) => void;
}

const priorities: { value: "low" | "medium" | "high"; label: string; color: string; activeColor: string }[] = [
  { value: "low", label: "Low", color: "text-green-600 border-green-300", activeColor: "bg-green-100 text-green-700 border-green-400 dark:bg-green-900/40 dark:text-green-400" },
  { value: "medium", label: "Med", color: "text-yellow-600 border-yellow-300", activeColor: "bg-yellow-100 text-yellow-700 border-yellow-400 dark:bg-yellow-900/40 dark:text-yellow-400" },
  { value: "high", label: "High", color: "text-red-600 border-red-300", activeColor: "bg-red-100 text-red-700 border-red-400 dark:bg-red-900/40 dark:text-red-400" },
];

export default function TaskInput({ onAdd }: TaskInputProps) {
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  function handleSubmit() {
    const trimmed = input.trim();
    if (!trimmed) {
      setError("Task title cannot be empty.");
      return;
    }
    if (trimmed.length > 200) {
      setError("Task title must be 200 characters or less.");
      return;
    }
    setError("");
    onAdd(trimmed, priority, dueDate || null);
    setInput("");
    setDueDate("");
  }

  return (
    <div className="mb-4 space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (error) setError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
          placeholder="Add a new task..."
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors shrink-0"
        >
          Add
        </motion.button>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex gap-1">
          {priorities.map((p) => (
            <button
              key={p.value}
              onClick={() => setPriority(p.value)}
              className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                priority === p.value ? p.activeColor : `${p.color} bg-transparent dark:border-gray-600 dark:text-gray-400`
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="text-xs border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
