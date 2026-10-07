import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { getDb } from "../../db";
import { orders } from "../../db/schema";
import { chatGPTSignOutPath, requireChatGPTUser } from "../chatgpt-auth";

export const dynamic = "force-dynamic";
export default async function AccountPage() {
  const user = await requireChatGPTUser("/account");
  const history = await getDb().select().from(orders).where(eq(orders.userId, user.userId)).orderBy(desc(orders.createdAt)).limit(20);
  return <main className="account-page"><div className="account-shell">
    <div className="account-top"><Link href="/">← Back to Matsya</Link><a href={chatGPTSignOutPath("/")} target="_top">Sign out</a></div>
    <p className="eyebrow">YOUR MATSYA ACCOUNT</p><h1>Welcome, {user.fullName?.split(" ")[0] ?? "Matsya friend"}.</h1><p className="account-email">{user.email}</p>
    <section className="order-history"><h2>Your orders</h2>{history.length === 0 ? <div className="empty-order"><p>No orders yet.</p><Link href="/#menu">Explore the menu</Link></div> : history.map(order => <article className="history-card" key={order.id}><div><strong>{order.orderNumber}</strong><span>{order.createdAt}</span></div><div><span className="status-dot" /> {order.status}</div><strong>${order.total.toFixed(2)}</strong></article>)}</section>
  </div></main>;
}
