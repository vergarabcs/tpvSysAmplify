"use client";

import { useState } from "react";
import { View, Text, Heading, useTheme, Button, Flex, TextField, Collection } from "@aws-amplify/ui-react";

interface StockItem {
  id: string;
  description: string;
  quantity: number;
  timestamp: string;
}

export default function ReceiveStockPage() {
  const { tokens } = useTheme();
  const [itemCode, setItemCode] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [receivedItems, setReceivedItems] = useState<StockItem[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would validate and lookup the item
    const newStockItem: StockItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: `Item ${itemCode}`,
      quantity: quantity,
      timestamp: new Date().toISOString()
    };
    
    setReceivedItems([newStockItem, ...receivedItems]);
    setItemCode("");
    setQuantity(1);
  };

  return (
    <View padding={tokens.space.medium}>
      <Heading level={2}>Receive Stock</Heading>
      
      <View as="form" onSubmit={handleSubmit} marginTop={tokens.space.large}>
        <Flex direction="column" gap={tokens.space.medium} maxWidth="600px">
          <TextField 
            label="Item Code/Barcode"
            value={itemCode}
            onChange={(e) => setItemCode(e.target.value)}
            required
            autoFocus
          />
          
          <TextField 
            label="Quantity"
            type="number"
            value={quantity.toString()}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            required
          />
          
          <Button type="submit" variation="primary">
            Add Item
          </Button>
        </Flex>
      </View>
      
      <Heading level={3} marginTop={tokens.space.xl} marginBottom={tokens.space.medium}>
        Recently Received Items
      </Heading>
      
      {receivedItems.length === 0 ? (
        <Text>No items received yet.</Text>
      ) : (
        <Collection
          type="list"
          items={receivedItems}
          gap={tokens.space.small}
        >
          {(item) => (
            <Flex 
              key={item.id}
              backgroundColor="white" 
              padding={tokens.space.medium}
              borderRadius={tokens.radii.small}
              boxShadow={tokens.shadows.small}
              justifyContent="space-between"
            >
              <View>
                <Text fontWeight="bold">{item.description}</Text>
                <Text fontSize={tokens.fontSizes.small} color={tokens.colors.neutral[60]}>
                  {new Date(item.timestamp).toLocaleString()}
                </Text>
              </View>
              <Text fontWeight="bold">Qty: {item.quantity}</Text>
            </Flex>
          )}
        </Collection>
      )}
    </View>
  );
}
