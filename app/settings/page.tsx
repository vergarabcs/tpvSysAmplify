"use client";

import { View, Text, Heading, useTheme } from "@aws-amplify/ui-react";

export default function SettingsPage() {
  const { tokens } = useTheme();

  return (
    <View padding={tokens.space.medium}>
      <Heading level={2}>Settings</Heading>
      <Text>Your application settings will appear here.</Text>
    </View>
  );
}
