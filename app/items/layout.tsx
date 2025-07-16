"use client";

import { Navigation } from "../components/Navigation";

export default function ItemsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Navigation>{children}</Navigation>;
}