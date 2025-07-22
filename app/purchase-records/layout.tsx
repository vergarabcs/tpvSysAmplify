"use client";

import { Navigation } from "../components/Navigation";
import { PurchaseRecordsToolbar } from "./toolbar";
import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

export default function ReceiveStockLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <Navigation
      toolbar={<PurchaseRecordsToolbar/>}
    >
      {children}
    </Navigation>
  );
}
