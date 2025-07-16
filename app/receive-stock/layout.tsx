"use client";

import { Navigation } from "../components/Navigation";

export default function ReceiveStockLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Navigation>{children}</Navigation>;
}
