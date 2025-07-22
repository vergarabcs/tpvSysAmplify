import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./app.css";
import { ToastProvider } from "./components/ToastProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Store Name",
  description: "Point of Sale System built with Next.js and AWS Amplify",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
