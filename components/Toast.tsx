"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ToastProps {
  message: string;
  type: "success" | "error";
  visible: boolean;
  onDismiss: () => void;
}

export default function Toast({ message, type, visible, onDismiss }: ToastProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onDismiss, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onDismiss]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className={`fixed bottom-20 md:bottom-6 right-6 px-4 py-3 rounded-lg shadow-lg text-sm font-medium z-[60] ${
            type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
