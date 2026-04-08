export const dynamic = "force-dynamic";

import Razorpay from "razorpay";

function getRazorpay() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error("Razorpay credentials not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.");
  }

  return new Razorpay({ key_id, key_secret });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const amount = body.amount || 500;

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        plan: "pro",
        description: "Task Manager Pro - Monthly",
      },
    });

    return Response.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Payment initialization failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
