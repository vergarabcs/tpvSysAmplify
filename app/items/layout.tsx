"use client";

import { Navigation } from "../components/Navigation";
import { ItemsToolbar } from "./ItemsToolbar";

export default function ItemsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Navigation toolbar={<ItemsToolbar />}>{children}</Navigation>;
}