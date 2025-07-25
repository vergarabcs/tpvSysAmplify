"use client"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./app.css";
import { ToastProvider } from "./components/ToastProvider";
import { useItemsStore } from "./store";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const observeItems = useItemsStore(state => state.observeItems)
  
  useEffect(() => {
    const unsubscribe = observeItems()
    return unsubscribe
  }, [observeItems]);

  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
