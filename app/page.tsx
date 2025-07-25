"use client";

import { useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { redirect } from 'next/navigation';

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {

  // Redirect to items page
  useEffect(() => {
    redirect('/items');
  }, []);
  
  return null;
}
