export const dynamic = "force-dynamic";

import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const amount = body.amount || 500; // amount in INR (500 = Rs 5)

    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects paise
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
