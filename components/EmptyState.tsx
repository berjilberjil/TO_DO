"use client";

import Mascot from "./Mascot";

interface EmptyStateProps {
  mood?: "idle" | "celebrate" | "think" | "sad";
  message?: string;
}

export default function EmptyState({
  mood = "sad",
  message = "No tasks yet. Add one above.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Mascot mood={mood} size={100} message={message} />
    </div>
  );
}
