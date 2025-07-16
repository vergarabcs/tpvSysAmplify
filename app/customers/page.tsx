"use client";

import { View, Text, Heading, useTheme } from "@aws-amplify/ui-react";

export default function CustomersPage() {
  const { tokens } = useTheme();

  return (
    <View padding={tokens.space.medium}>
      <Heading level={2}>Customers</Heading>
      <Text>Your customers list will appear here.</Text>
    </View>
  );
}
