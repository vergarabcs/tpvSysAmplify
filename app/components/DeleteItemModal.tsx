"use client";

import {
  Button,
  Card,
  Flex,
  Heading,
  Text,
  View,
  useTheme,
  Divider,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

interface Item {
  id: string;
  description: string;
  sell_price: number;
  quantity: number;
  low_stock_qty: number;
  img?: string;
  qr?: string;
  create_date: string;
  tags?: string;
}

interface DeleteItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  item: Item;
}

export function DeleteItemModal({ isOpen, onClose, onConfirm, item }: DeleteItemModalProps) {
  const { tokens } = useTheme();

  if (!isOpen) return null;
  
  return (
    <View
      position="fixed"
      top="0"
      left="0"
      width="100vw"
      height="100vh"
      backgroundColor="rgba(0, 0, 0, 0.4)"
      style={{ zIndex: 100 }}
      onClick={onClose}
    >
      <Flex 
        justifyContent="center" 
        alignItems="center" 
        height="100%"
      >
        <Card
          width={{ base: "90%", medium: "400px" }}
          padding={tokens.space.medium}
          borderRadius={tokens.radii.medium}
          onClick={(e) => e.stopPropagation()}
          variation="elevated"
        >
          <Flex direction="column" gap={tokens.space.medium}>
            <Heading level={3}>
              Delete Item
            </Heading>
            
            <Divider />
            
            <Text>
              Are you sure you want to delete "{item.description}"? This action cannot be undone.
            </Text>
            
            <Divider />
            
            <Flex justifyContent="flex-end" gap={tokens.space.xs}>
              <Button variation="link" onClick={onClose}>
                Cancel
              </Button>
              <Button variation="destructive" onClick={onConfirm}>
                Delete
              </Button>
            </Flex>
          </Flex>
        </Card>
      </Flex>
    </View>
  );
}
