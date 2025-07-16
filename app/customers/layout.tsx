"use client";

import { Navigation } from "../components/Navigation";

export default function CustomersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Navigation>{children}</Navigation>;
}
