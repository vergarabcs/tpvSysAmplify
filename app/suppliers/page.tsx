"use client";

import { View, Text, Heading, useTheme } from "@aws-amplify/ui-react";

export default function SuppliersPage() {
  const { tokens } = useTheme();

  return (
    <View padding={tokens.space.medium}>
      <Heading level={2}>Suppliers</Heading>
      <Text>Your suppliers list will appear here.</Text>
    </View>
  );
}
