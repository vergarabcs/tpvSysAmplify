"use client";

import { useEffect } from "react";
import { View, Text, useTheme } from "@aws-amplify/ui-react";
import { redirect } from "next/navigation";

export default function SignOutPage() {
  const { tokens } = useTheme();

  useEffect(() => {
    // Here you would typically call your authentication service's sign-out method
    // For now, we'll just redirect to the home page after a brief delay
    const timer = setTimeout(() => {
      redirect('/');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View padding={tokens.space.medium} textAlign="center">
      <Text fontSize={tokens.fontSizes.large} fontWeight="bold">
        Signing you out...
      </Text>
      <Text marginTop={tokens.space.medium}>
        You will be redirected to the login page shortly.
      </Text>
    </View>
  );
}
