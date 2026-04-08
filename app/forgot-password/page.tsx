"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { requestPasswordOTP, verifyOTP } from "@/lib/auth";
import Mascot from "@/components/Mascot";

type Step = "request" | "verify";
type Method = "email" | "phone";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("request");
  const [method, setMethod] = useState<Method>("email");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [sentOTP, setSentOTP] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  function handleRequestOTP(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!identifier.trim()) {
      setError(method === "email" ? "Email is required." : "Phone number is required.");
      return;
    }

    if (method === "email" && !/\S+@\S+\.\S+/.test(identifier)) {
      setError("Please enter a valid email.");
      return;
    }

    if (method === "phone" && !/^\+?\d{10,15}$/.test(identifier.replace(/\s/g, ""))) {
      setError("Please enter a valid phone number.");
      return;
    }

    const result = requestPasswordOTP(identifier, method);
    if (!result.success) {
      setError(result.error || "Failed to send OTP.");
      return;
    }

    // In production the OTP goes via email/SMS
    // For demo we show it as an info message
    setSentOTP(result.otp || "");
    setInfo(
      `OTP sent! For demo purposes, your code is: ${result.otp}. In production this would be sent via ${method === "email" ? "email" : "SMS"}.`
    );
    setStep("verify");
  }

  function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!otp.trim() || otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    const result = verifyOTP(identifier, otp, method);
    if (!result.success) {
      setError(result.error || "Verification failed.");
      return;
    }

    router.push(`/reset-password?token=${result.resetToken}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="flex justify-center mb-6">
          <Mascot mood="think" size={100} message="Let's recover your account 🔐" />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {step === "request" ? "Forgot Password" : "Enter OTP"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {step === "request"
              ? "We'll send you a verification code."
              : `Enter the 6-digit code sent to your ${method}.`}
          </p>

          {step === "request" ? (
            <form onSubmit={handleRequestOTP} className="space-y-4">
              {/* Method selector */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setMethod("email"); setIdentifier(""); setError(""); }}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    method === "email"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                  }`}
                >
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => { setMethod("phone"); setIdentifier(""); setError(""); }}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    method === "phone"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                  }`}
                >
                  Phone
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {method === "email" ? "Email Address" : "Phone Number"}
                </label>
                <input
                  type={method === "email" ? "email" : "tel"}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={method === "email" ? "you@example.com" : "+91 9876543210"}
                />
              </div>

              {error && <p className="text-red-500 text-xs">{error}</p>}

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full bg-blue-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Send OTP
              </motion.button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              {info && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-xs text-blue-700 dark:text-blue-300">
                  {info}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-[0.5em] font-mono text-lg"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>

              {error && <p className="text-red-500 text-xs">{error}</p>}

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full bg-blue-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Verify & Continue
              </motion.button>

              <button
                type="button"
                onClick={() => {
                  setStep("request");
                  setOtp("");
                  setError("");
                  setInfo("");
                }}
                className="w-full text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Back to request
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            Remember your password?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
