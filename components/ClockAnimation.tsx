"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ClockAnimationProps {
  size?: number;
  showDigital?: boolean;
}

export default function ClockAnimation({
  size = 48,
  showDigital = true,
}: ClockAnimationProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourDeg = hours * 30 + minutes * 0.5;
  const minuteDeg = minutes * 6;
  const secondDeg = seconds * 6;

  const center = size / 2;
  const hourLen = size * 0.22;
  const minLen = size * 0.3;
  const secLen = size * 0.33;

  return (
    <div className="flex items-center gap-2">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Clock face */}
        <circle
          cx={center}
          cy={center}
          r={center - 2}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="text-gray-300 dark:text-gray-600"
        />
        {/* Hour markers */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const outerR = center - 4;
          const innerR = center - 7;
          return (
            <line
              key={i}
              x1={center + innerR * Math.cos(angle)}
              y1={center + innerR * Math.sin(angle)}
              x2={center + outerR * Math.cos(angle)}
              y2={center + outerR * Math.sin(angle)}
              stroke="currentColor"
              strokeWidth={1.5}
              className="text-gray-400 dark:text-gray-500"
            />
          );
        })}
        {/* Hour hand */}
        <motion.line
          x1={center}
          y1={center}
          x2={
            center +
            hourLen * Math.cos((hourDeg - 90) * (Math.PI / 180))
          }
          y2={
            center +
            hourLen * Math.sin((hourDeg - 90) * (Math.PI / 180))
          }
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          className="text-gray-700 dark:text-gray-200"
        />
        {/* Minute hand */}
        <motion.line
          x1={center}
          y1={center}
          x2={
            center +
            minLen * Math.cos((minuteDeg - 90) * (Math.PI / 180))
          }
          y2={
            center +
            minLen * Math.sin((minuteDeg - 90) * (Math.PI / 180))
          }
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          className="text-gray-600 dark:text-gray-300"
        />
        {/* Second hand */}
        <motion.line
          x1={center}
          y1={center}
          x2={
            center +
            secLen * Math.cos((secondDeg - 90) * (Math.PI / 180))
          }
          y2={
            center +
            secLen * Math.sin((secondDeg - 90) * (Math.PI / 180))
          }
          stroke="currentColor"
          strokeWidth={1}
          strokeLinecap="round"
          className="text-red-500"
        />
        {/* Center dot */}
        <circle cx={center} cy={center} r={2} fill="currentColor" className="text-gray-700 dark:text-gray-200" />
      </svg>
      {showDigital && (
        <span className="text-sm font-mono text-gray-600 dark:text-gray-400 tabular-nums">
          {time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </span>
      )}
    </div>
  );
}
