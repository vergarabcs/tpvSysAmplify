"use client";

import { useState } from "react";
import {
  Button,
  Card,
  Flex,
  Heading,
  TextField,
  Text,
  TextAreaField,
  useTheme,
  View,
  Divider,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

interface CreateItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: any) => void;
}

export function CreateItemModal({ isOpen, onClose, onSave }: CreateItemModalProps) {
  const { tokens } = useTheme();
  const [formData, setFormData] = useState({
    description: "",
    sell_price: "",
    quantity: "",
    low_stock_qty: "",
    tags: "",
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    
    // Clear validation error when user types
    if (validationErrors[field]) {
      setValidationErrors({
        ...validationErrors,
        [field]: "",
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }
    
    if (!formData.sell_price) {
      errors.sell_price = "Price is required";
    } else if (isNaN(parseFloat(formData.sell_price)) || parseFloat(formData.sell_price) < 0) {
      errors.sell_price = "Price must be a positive number";
    }
    
    if (!formData.quantity) {
      errors.quantity = "Quantity is required";
    } else if (isNaN(parseFloat(formData.quantity)) || parseFloat(formData.quantity) < 0) {
      errors.quantity = "Quantity must be a positive number";
    }
    
    if (!formData.low_stock_qty) {
      errors.low_stock_qty = "Low stock quantity is required";
    } else if (isNaN(parseFloat(formData.low_stock_qty)) || parseFloat(formData.low_stock_qty) < 0) {
      errors.low_stock_qty = "Low stock quantity must be a positive number";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({
        description: formData.description,
        sell_price: parseFloat(formData.sell_price),
        quantity: parseFloat(formData.quantity),
        low_stock_qty: parseFloat(formData.low_stock_qty),
        img: "", // Placeholder for future implementation
        qr: "", // Placeholder for future implementation
        create_date: new Date().toISOString(),
        tags: formData.tags,
      });
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      description: "",
      sell_price: "",
      quantity: "",
      low_stock_qty: "",
      tags: "",
    });
    setValidationErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

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
      onClick={handleClose}
    >
      <Flex 
        justifyContent="center" 
        alignItems="center" 
        height="100%"
      >
        <Card
          width={{ base: "90%", medium: "600px" }}
          padding={tokens.space.medium}
          borderRadius={tokens.radii.medium}
          onClick={(e) => e.stopPropagation()}
          variation="elevated"
        >
          <Flex direction="column" gap={tokens.space.medium}>
            <Heading level={3}>
              Add New Item
            </Heading>
            
            <Divider />
            
            <Flex direction="column" gap={tokens.space.medium}>
              <TextField
                label="Description"
                placeholder="Enter item description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                hasError={!!validationErrors.description}
                errorMessage={validationErrors.description}
                isRequired
              />

              <TextField
                label="Sell Price"
                placeholder="0.00"
                value={formData.sell_price}
                onChange={(e) => handleInputChange("sell_price", e.target.value)}
                type="number"
                step="0.01"
                min="0"
                hasError={!!validationErrors.sell_price}
                errorMessage={validationErrors.sell_price}
                isRequired
              />

              <TextField
                label="Quantity"
                placeholder="0"
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
                type="number"
                step="0.01"
                min="0"
                hasError={!!validationErrors.quantity}
                errorMessage={validationErrors.quantity}
                isRequired
              />

              <TextField
                label="Low Stock Quantity"
                placeholder="5"
                value={formData.low_stock_qty}
                onChange={(e) => handleInputChange("low_stock_qty", e.target.value)}
                type="number"
                step="0.01"
                min="0"
                hasError={!!validationErrors.low_stock_qty}
                errorMessage={validationErrors.low_stock_qty}
                isRequired
              />

              <TextAreaField
                label="Tags"
                placeholder="Enter comma-separated tags (e.g. electronics, accessories)"
                value={formData.tags}
                onChange={(e) => handleInputChange("tags", e.target.value)}
                labelHidden={false}
              />

              <Text color={tokens.colors.neutral[60]} fontSize={tokens.fontSizes.xs}>
                Note: Image uploading will be available in a future update.
              </Text>
            </Flex>
            
            <Divider />
            
            <Flex justifyContent="flex-end" gap={tokens.space.xs}>
              <Button variation="link" onClick={handleClose}>
                Cancel
              </Button>
              <Button variation="primary" onClick={handleSubmit}>
                Create Item
              </Button>
            </Flex>
          </Flex>
        </Card>
      </Flex>
    </View>
  );
}
