"use client";

import { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import {
  Button,
  Flex,
  Text,
  View,
  TextField,
  useTheme,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

Amplify.configure(outputs);
const client = generateClient<Schema>();

export default function PurchaseRecordsPage() {
  const { tokens } = useTheme();

  return (
    <View padding={tokens.space.medium} width="100%">
      Hello
    </View>
  );
}
