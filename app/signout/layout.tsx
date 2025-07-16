"use client";

import { Navigation } from "../components/Navigation";

export default function SignOutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Navigation>{children}</Navigation>;
}
