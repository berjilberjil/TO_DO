"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import Mascot from "@/components/Mascot";
import RazorpayCheckout from "@/components/RazorpayCheckout";
import Toast from "@/components/Toast";

const check = (
  <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const cross = (
  <svg className="w-5 h-5 text-gray-300 dark:text-gray-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function PricingPage() {
  const [isPro, setIsPro] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("tm_pro") === "true";
    }
    return false;
  });
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    visible: boolean;
  }>({ message: "", type: "success", visible: false });
  const [mascotMood, setMascotMood] = useState<"celebrate" | "idle">(
    isPro ? "celebrate" : "idle"
  );

  function handlePaymentSuccess() {
    setIsPro(true);
    setMascotMood("celebrate");
    setToast({
      message: "Welcome to Pro! All features unlocked.",
      type: "success",
      visible: true,
    });
  }

  function handlePaymentError(msg: string) {
    setToast({ message: msg, type: "error", visible: true });
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="max-w-3xl mx-auto"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pricing</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Choose the plan that works for you.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <Mascot
            mood={mascotMood}
            size={90}
            message={
              isPro
                ? "You're a Pro! All features unlocked 🎉"
                : "Go Pro and unlock everything! ⚡"
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 flex flex-col"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Free</h2>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
              ₹0<span className="text-base font-normal text-gray-500 dark:text-gray-400">/mo</span>
            </p>
            <ul className="mt-6 space-y-3 text-sm text-gray-600 dark:text-gray-300 flex-1">
              <li className="flex items-start gap-2">{check} Up to 10 tasks</li>
              <li className="flex items-start gap-2">{check} 1 goal</li>
              <li className="flex items-start gap-2">{check} Basic filters</li>
              <li className="flex items-start gap-2">{cross} No dark mode</li>
              <li className="flex items-start gap-2">{cross} No persistence</li>
              <li className="flex items-start gap-2">{cross} No PDF export</li>
            </ul>
            {!isPro && (
              <div className="mt-6 block text-center rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                Current Plan
              </div>
            )}
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border-2 border-blue-600 bg-white dark:bg-gray-800 p-6 flex flex-col relative"
          >
            <span className="absolute -top-3 left-4 bg-blue-600 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
              Most Popular
            </span>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Pro</h2>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
              ₹500<span className="text-base font-normal text-gray-500 dark:text-gray-400">/mo</span>
            </p>
            <ul className="mt-6 space-y-3 text-sm text-gray-600 dark:text-gray-300 flex-1">
              <li className="flex items-start gap-2">{check} Unlimited tasks + goals</li>
              <li className="flex items-start gap-2">{check} Priority + due dates</li>
              <li className="flex items-start gap-2">{check} Dark mode</li>
              <li className="flex items-start gap-2">{check} Export to JSON/PDF</li>
              <li className="flex items-start gap-2">{check} Persistent storage</li>
              <li className="flex items-start gap-2">{check} Early access to features</li>
            </ul>
            <div className="mt-6">
              {isPro ? (
                <div className="text-center rounded-lg bg-green-100 dark:bg-green-900/30 px-4 py-2.5 text-sm font-medium text-green-700 dark:text-green-400">
                  Active Plan ✓
                </div>
              ) : (
                <RazorpayCheckout
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              )}
            </div>
          </motion.div>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/"
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            ← Back to Task Manager
          </Link>
        </div>
      </motion.div>

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onDismiss={() => setToast((p) => ({ ...p, visible: false }))}
      />
    </div>
  );
}
