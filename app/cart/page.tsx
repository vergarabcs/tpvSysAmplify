"use client";

import { useState } from "react";
import { View, Text, Heading, useTheme, Flex, Button, Collection, TextField } from "@aws-amplify/ui-react";
import { MdAdd, MdRemove, MdDelete } from "react-icons/md";

interface CartItem {
  id: string;
  description: string;
  price: number;
  quantity: number;
}

export default function CartPage() {
  const { tokens } = useTheme();
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: "1", description: "Product 1", price: 300, quantity: 2 },
    { id: "2", description: "Product 2", price: 150, quantity: 1 }
  ]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or less
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      // Update quantity
      setCartItems(
        cartItems.map(item => 
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity, 
      0
    );
  };

  const handleCheckout = () => {
    alert("Processing checkout...");
  };

  return (
    <View padding={tokens.space.medium}>
      <Heading level={2}>Cart</Heading>
      
      {cartItems.length === 0 ? (
        <View padding={tokens.space.large} textAlign="center">
          <Text>Your cart is empty.</Text>
          <Button
            variation="primary"
            marginTop={tokens.space.large}
            onClick={() => window.location.href = "/items"}
          >
            Browse Items
          </Button>
        </View>
      ) : (
        <Flex direction="column" gap={tokens.space.medium}>
          <Collection
            items={cartItems}
            type="list"
            direction="column"
            gap={tokens.space.xs}
          >
            {(item) => (
              <Flex 
                key={item.id}
                backgroundColor="white"
                padding={tokens.space.small}
                borderRadius={tokens.radii.small}
                boxShadow="0 1px 4px rgba(0,0,0,0.10)"
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <View flex="1">
                  <Text fontWeight="bold">{item.description}</Text>
                  <Text>₱{item.price} x {item.quantity}</Text>
                </View>
                
                <Flex alignItems="center" gap={tokens.space.xs}>
                  <Button 
                    size="small" 
                    variation="link"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <MdRemove />
                  </Button>
                  
                  <Text fontWeight="bold">{item.quantity}</Text>
                  
                  <Button 
                    size="small" 
                    variation="link"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <MdAdd />
                  </Button>
                  
                  <Button 
                    size="small" 
                    variation="link" 
                    onClick={() => removeItem(item.id)}
                    color={tokens.colors.red[60]}
                  >
                    <MdDelete />
                  </Button>
                </Flex>
              </Flex>
            )}
          </Collection>
          
          <Flex direction="column" gap={tokens.space.medium} marginTop={tokens.space.large}>
            <Heading level={4}>Customer Information</Heading>
            
            <TextField
              label="Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            
            <TextField
              label="Phone"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </Flex>
          
          <Flex 
            direction="column" 
            padding={tokens.space.medium} 
            backgroundColor={tokens.colors.blue[10]}
            borderRadius={tokens.radii.medium}
            marginTop={tokens.space.large}
          >
            <Flex justifyContent="space-between">
              <Text>Subtotal:</Text>
              <Text>₱{calculateTotal()}</Text>
            </Flex>
            
            <Flex justifyContent="space-between" marginTop={tokens.space.xs}>
              <Text>Tax:</Text>
              <Text>₱{(calculateTotal() * 0.12).toFixed(2)}</Text>
            </Flex>
            
            <Flex justifyContent="space-between" marginTop={tokens.space.small} fontWeight="bold">
              <Text>Total:</Text>
              <Text>₱{(calculateTotal() * 1.12).toFixed(2)}</Text>
            </Flex>
          </Flex>
          
          <Button 
            variation="primary" 
            size="large" 
            marginTop={tokens.space.medium}
            onClick={handleCheckout}
          >
            Complete Purchase
          </Button>
        </Flex>
      )}
    </View>
  );
}
