"use client";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface ProgressRingProps {
  percentage: number;
  size?: number;
}

export default function ProgressRing({ percentage, size = 64 }: ProgressRingProps) {
  const color =
    percentage === 100
      ? "#22c55e"
      : percentage >= 50
        ? "#3b82f6"
        : percentage > 0
          ? "#f59e0b"
          : "#d1d5db";

  return (
    <div style={{ width: size, height: size }}>
      <CircularProgressbar
        value={percentage}
        text={`${Math.round(percentage)}%`}
        styles={buildStyles({
          textSize: "28px",
          pathColor: color,
          textColor: color,
          trailColor: "#e5e7eb",
        })}
      />
    </div>
  );
}
