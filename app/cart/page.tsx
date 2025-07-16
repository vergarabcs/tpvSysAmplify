"use client";

import { View, Text, Heading, useTheme, Flex, Button, Collection, TextField } from "@aws-amplify/ui-react";
import { MdAdd, MdRemove, MdDelete } from "react-icons/md";
import { useCartStore } from "../store";

export default function CartPage() {
  const { tokens } = useTheme();
  const { 
    cartItems, 
    customerInfo, 
    updateQuantity, 
    removeItem, 
    getTotal,
    setCustomerInfo
  } = useCartStore();

  // Destructure customerInfo for easier access
  const { name, phone } = customerInfo;

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
              value={name}
              onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
            />
            
            <TextField
              label="Phone"
              value={phone}
              onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
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
              <Text>₱{getTotal()}</Text>
            </Flex>
            
            <Flex justifyContent="space-between" marginTop={tokens.space.xs}>
              <Text>Tax:</Text>
              <Text>₱{(getTotal() * 0.12).toFixed(2)}</Text>
            </Flex>
            
            <Flex justifyContent="space-between" marginTop={tokens.space.small} fontWeight="bold">
              <Text>Total:</Text>
              <Text>₱{(getTotal() * 1.12).toFixed(2)}</Text>
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
