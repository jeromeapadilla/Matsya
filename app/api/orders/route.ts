import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "../../../db";
import { orders } from "../../../db/schema";
import { getChatGPTUser } from "../../chatgpt-auth";

const schema = z.object({
  customerName: z.string().trim().min(2).max(80), email: z.string().email().max(160), phone: z.string().trim().min(7).max(30),
  fulfilment: z.enum(["pickup", "delivery"]), address: z.string().trim().max(240).optional().default(""),
  requestedTime: z.string().trim().min(2).max(80), notes: z.string().trim().max(500).optional().default(""),
  promoCode: z.string().trim().max(24).optional().default(""),
  items: z.array(z.object({ id: z.string(), name: z.string(), price: z.number().positive(), quantity: z.number().int().min(1).max(20) })).min(1).max(30),
});

export async function POST(request: NextRequest) {
  try {
    const data = schema.parse(await request.json());
    if (data.fulfilment === "delivery" && !data.address) return NextResponse.json({ error: "Please enter a delivery address." }, { status: 400 });
    const user = await getChatGPTUser();
    const subtotal = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = data.promoCode.toUpperCase() === "MATSYA10" ? subtotal * 0.1 : 0;
    const deliveryFee = data.fulfilment === "delivery" ? 5 : 0;
    const total = subtotal - discount + deliveryFee;
    const orderNumber = `MAT-${Date.now().toString().slice(-7)}`;
    await getDb().insert(orders).values({ orderNumber, userId: user?.userId ?? null, customerName: data.customerName, email: data.email, phone: data.phone, fulfilment: data.fulfilment, address: data.address || null, requestedTime: data.requestedTime, itemsJson: JSON.stringify(data.items), notes: data.notes, promoCode: data.promoCode || null, subtotal, discount, total });
    const webhook = process.env.ORDER_WEBHOOK_URL;
    if (webhook) await fetch(webhook, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ orderNumber, ...data, subtotal, discount, total }) }).catch(() => null);
    return NextResponse.json({ orderNumber, total });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Please check your order details." }, { status: 400 });
    console.error(error); return NextResponse.json({ error: "We could not place your order. Please try again." }, { status: 500 });
  }
}
