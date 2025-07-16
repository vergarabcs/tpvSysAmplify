"use client";

import { Navigation } from "../components/Navigation";

export default function SuppliersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Navigation>{children}</Navigation>;
}
