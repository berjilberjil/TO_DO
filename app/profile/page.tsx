"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getUser, updateUserName, updateUserPhone } from "@/lib/auth";
import { getTasks, getGoals } from "@/lib/storage";
import Mascot from "@/components/Mascot";
import Toast from "@/components/Toast";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [memberSince, setMemberSince] = useState("");
  const [phone, setPhone] = useState("");
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [totalTasks, setTotalTasks] = useState(0);
  const [totalGoals, setTotalGoals] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    visible: boolean;
  }>({ message: "", type: "success", visible: false });

  useEffect(() => {
    const user = getUser();
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone || "");
      setEditName(user.name);
      setMemberSince(
        new Date(user.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    }
    const tasks = getTasks();
    const goals = getGoals();
    setTotalTasks(tasks.length);
    setTotalGoals(goals.length);
    const completed = tasks.filter((t) => t.completed).length;
    setCompletionRate(tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0);
  }, []);

  function getInitials(n: string) {
    return n
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  function getColor(n: string) {
    let hash = 0;
    for (let i = 0; i < n.length; i++) hash = n.charCodeAt(i) + ((hash << 5) - hash);
    const colors = ["bg-blue-600", "bg-purple-600", "bg-green-600", "bg-orange-600", "bg-pink-600", "bg-teal-600"];
    return colors[Math.abs(hash) % colors.length];
  }

  function handleSaveName() {
    if (!editName.trim()) return;
    updateUserName(editName.trim());
    setName(editName.trim());
    setEditing(false);
    setToast({ message: "Name updated!", type: "success", visible: true });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-lg mx-auto px-4 py-8"
    >
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Profile</h2>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div
            className={`w-16 h-16 rounded-full ${getColor(name)} text-white flex items-center justify-center text-xl font-bold`}
          >
            {getInitials(name || "U")}
          </div>
          <div className="flex-1">
            {editing ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSaveName}
                  className="text-xs px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setEditName(name);
                  }}
                  className="text-xs px-2 py-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {name}
                </h3>
                <button
                  onClick={() => setEditing(true)}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Edit
                </button>
              </div>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400">{email}</p>
            {phone && (
              <p className="text-xs text-gray-400 dark:text-gray-500">{phone}</p>
            )}
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              Member since {memberSince}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Tasks Created", value: totalTasks },
            { label: "Goals Set", value: totalGoals },
            { label: "Completion", value: `${completionRate}%` },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <Mascot mood="idle" size={80} message="Looking good! 💪" />
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onDismiss={() => setToast((p) => ({ ...p, visible: false }))}
      />
    </motion.div>
  );
}
