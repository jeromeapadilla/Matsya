import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderNumber: text("order_number").notNull().unique(),
  userId: text("user_id"),
  customerName: text("customer_name").notNull(), email: text("email").notNull(), phone: text("phone").notNull(),
  fulfilment: text("fulfilment").notNull(), address: text("address"), requestedTime: text("requested_time").notNull(),
  itemsJson: text("items_json").notNull(), notes: text("notes").notNull().default(""), promoCode: text("promo_code"),
  subtotal: real("subtotal").notNull(), discount: real("discount").notNull().default(0), total: real("total").notNull(),
  status: text("status").notNull().default("received"), createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
