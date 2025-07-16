"use client";

import { View, Text, Heading, useTheme } from "@aws-amplify/ui-react";

export default function ReportsPage() {
  const { tokens } = useTheme();

  return (
    <View padding={tokens.space.medium}>
      <Heading level={2}>Reports</Heading>
      <Text>Your reports and analytics will appear here.</Text>
    </View>
  );
}
