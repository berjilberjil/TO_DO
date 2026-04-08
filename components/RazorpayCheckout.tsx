"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { getUser } from "@/lib/auth";

interface RazorpayCheckoutProps {
  onSuccess: () => void;
  onError: (msg: string) => void;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

export default function RazorpayCheckout({
  onSuccess,
  onError,
}: RazorpayCheckoutProps) {
  const [loading, setLoading] = useState(false);

  async function handlePayment() {
    setLoading(true);

    try {
      // Load Razorpay script if not loaded
      if (!window.Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load Razorpay"));
          document.body.appendChild(script);
        });
      }

      // Create order
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 500 }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create order");
      }

      const order = await res.json();
      const user = getUser();

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Task Manager",
        description: "Pro Plan - Monthly Subscription",
        order_id: order.orderId,
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#2563eb",
        },
        handler: async function (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          // Verify payment
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const verifyData = await verifyRes.json();

            if (verifyData.verified) {
              // Save pro status
              localStorage.setItem("tm_pro", "true");
              localStorage.setItem(
                "tm_payment",
                JSON.stringify({
                  paymentId: verifyData.paymentId,
                  orderId: verifyData.orderId,
                  date: new Date().toISOString(),
                })
              );
              onSuccess();
            } else {
              onError("Payment verification failed. Please contact support.");
            }
          } catch {
            onError("Payment verification failed. Please try again.");
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={handlePayment}
      disabled={loading}
      className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Processing...
        </span>
      ) : (
        "Upgrade to Pro — ₹500/mo"
      )}
    </motion.button>
  );
}
