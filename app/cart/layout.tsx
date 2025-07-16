"use client";

import { Navigation } from "../components/Navigation";

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Navigation>{children}</Navigation>;
}
