"use client";

import { View, Text, Heading, useTheme, Button, Flex, TextField, Collection } from "@aws-amplify/ui-react";
import { useStockStore } from "../store";

export default function ReceiveStockPage() {
  const { tokens } = useTheme();
  const { 
    itemCode, 
    quantity, 
    receivedItems, 
    setItemCode, 
    setQuantity, 
    addReceivedItem 
  } = useStockStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addReceivedItem();
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
              boxShadow="0 1px 4px rgba(0,0,0,0.10)"
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
