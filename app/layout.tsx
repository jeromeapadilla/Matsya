import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Matsya | Matcha Taho & Filipino Delicacy",
  description: "A Filipino classic, reimagined. Order handcrafted Matsya drinks for pickup or local delivery.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
