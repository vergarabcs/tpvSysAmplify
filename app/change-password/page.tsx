"use client";

import { useState } from "react";
import { View, Text, Heading, TextField, Button, Flex, useTheme } from "@aws-amplify/ui-react";

export default function ChangePasswordPage() {
  const { tokens } = useTheme();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Password change logic would go here
    alert("Password change functionality will be implemented later");
  };

  return (
    <View padding={tokens.space.medium}>
      <Heading level={2}>Change My Password</Heading>
      
      <View as="form" onSubmit={handleSubmit} maxWidth="500px" marginTop={tokens.space.large}>
        <Flex direction="column" gap={tokens.space.medium}>
          <TextField 
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          
          <TextField 
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          
          <TextField 
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          
          <Button type="submit" variation="primary">
            Change Password
          </Button>
        </Flex>
      </View>
    </View>
  );
}
