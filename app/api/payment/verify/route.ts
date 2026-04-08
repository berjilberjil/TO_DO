export const dynamic = "force-dynamic";

import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return Response.json(
        { error: "Missing payment verification fields" },
        { status: 400 }
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      return Response.json({
        verified: true,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
    }

    return Response.json(
      { verified: false, error: "Invalid signature" },
      { status: 400 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Verification failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
