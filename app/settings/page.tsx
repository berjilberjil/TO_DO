"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { logout } from "@/lib/auth";
import { getTasks, saveTasks } from "@/lib/storage";
import { getStoredTheme, setStoredTheme, type ThemeMode } from "@/lib/themes";
import Toast from "@/components/Toast";
import ExportPDF from "@/components/ExportPDF";
import Mascot from "@/components/Mascot";

export default function SettingsPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [notifications, setNotifications] = useState(true);
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [tasks, setTasksState] = useState(getTasks());
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    visible: boolean;
  }>({ message: "", type: "success", visible: false });

  useEffect(() => {
    setTheme(getStoredTheme());
    setTasksState(getTasks());
  }, []);

  function handleThemeChange(mode: ThemeMode) {
    setTheme(mode);
    setStoredTheme(mode);
  }

  async function handleClearTasks() {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    try {
      await fetch("/api/tasks?id=-1", { method: "DELETE" });
      saveTasks([]);
      setTasksState([]);
      setToast({ message: "All tasks cleared.", type: "success", visible: true });
    } catch {
      setToast({ message: "Failed to clear tasks.", type: "error", visible: true });
    }
    setConfirmClear(false);
  }

  function handleExportJSON() {
    const allTasks = getTasks();
    const blob = new Blob([JSON.stringify(allTasks, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tasks.json";
    a.click();
    URL.revokeObjectURL(url);
    setToast({ message: "Tasks exported as JSON!", type: "success", visible: true });
  }

  function handleDeleteAccount() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    localStorage.clear();
    logout();
    router.push("/signup");
  }

  const themes: { mode: ThemeMode; label: string; icon: string }[] = [
    { mode: "light", label: "Light", icon: "☀️" },
    { mode: "dark", label: "Dark", icon: "🌙" },
    { mode: "system", label: "System", icon: "💻" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-lg mx-auto px-4 py-8"
    >
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Settings</h2>

      <div className="flex justify-center mb-6">
        <Mascot mood="idle" size={80} message="Customize your experience ⚙️" />
      </div>

      {/* Appearance */}
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Appearance
        </h3>
        <div className="flex gap-2">
          {themes.map((t) => (
            <button
              key={t.mode}
              onClick={() => handleThemeChange(t.mode)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                theme === t.mode
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Notifications
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Receive task reminders
            </p>
          </div>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              notifications ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                notifications ? "translate-x-5.5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </section>

      {/* Data */}
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Data
        </h3>
        <div className="flex gap-2 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleClearTasks}
            className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors ${
              confirmClear
                ? "bg-red-600 text-white"
                : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40"
            }`}
          >
            {confirmClear ? "Confirm Clear?" : "Clear All Tasks"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleExportJSON}
            className="text-sm px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Export as JSON
          </motion.button>
          <ExportPDF tasks={tasks} />
        </div>
      </section>

      {/* Account */}
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Account
        </h3>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleDeleteAccount}
          className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors ${
            confirmDelete
              ? "bg-red-600 text-white"
              : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40"
          }`}
        >
          {confirmDelete ? "Confirm Delete Account?" : "Delete Account"}
        </motion.button>
      </section>

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onDismiss={() => setToast((p) => ({ ...p, visible: false }))}
      />
    </motion.div>
  );
}
