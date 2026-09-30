import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

// Keys must live in environment variables, never in client code.
// Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local (see .env.example).
export async function POST(req: NextRequest) {
  const { amountInRupees } = await req.json();

  if (!amountInRupees || amountInRupees <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json(
      { error: "Razorpay keys are not configured on the server yet." },
      { status: 500 }
    );
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amountInRupees * 100), // Razorpay expects paise
      currency: "INR",
      receipt: `order_rcpt_${Date.now()}`,
    });
    return NextResponse.json(order);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not create order" }, { status: 500 });
  }
}
