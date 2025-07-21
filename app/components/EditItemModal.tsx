"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Card,
  Flex,
  Heading,
  useTheme,
  View,
  Divider,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { ItemFormFields } from "./ItemFormFields";
import { validateItemForm } from "./itemFormValidation";

interface Item {
  id: string;
  description: string;
  sell_price: number;
  quantity: number;
  low_stock_qty: number;
  img?: string;
  qr?: string;
  tags?: string;
}

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Item) => void;
  item: Item;
}

export function EditItemModal({ isOpen, onClose, onSave, item }: EditItemModalProps) {
  const { tokens } = useTheme();
  const [formData, setFormData] = useState({
    description: "",
    sell_price: "",
    quantity: "",
    low_stock_qty: "",
    tags: "",
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (item) {
      setFormData({
        description: item.description,
        sell_price: item.sell_price.toString(),
        quantity: item.quantity.toString(),
        low_stock_qty: item.low_stock_qty.toString(),
        tags: item.tags || "",
      });
    }
  }, [item]);

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    if (validationErrors[field]) {
      setValidationErrors({
        ...validationErrors,
        [field]: "",
      });
    }
  };

  const validateForm = () => {
    const errors = validateItemForm(formData);
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({
        ...item,
        description: formData.description,
        sell_price: parseFloat(formData.sell_price),
        quantity: parseFloat(formData.quantity),
        low_stock_qty: parseFloat(formData.low_stock_qty),
        tags: formData.tags,
      });
    }
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
      onClick={onClose}
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
              Edit Item
            </Heading>
            
            <Divider />
            
            <Flex direction="column" gap={tokens.space.medium}>
              <ItemFormFields
                formData={formData}
                validationErrors={validationErrors}
                onInputChange={handleInputChange}
              />
            </Flex>
            
            <Divider />
            
            <Flex justifyContent="flex-end" gap={tokens.space.xs}>
              <Button variation="link" onClick={onClose}>
                Cancel
              </Button>
              <Button variation="primary" onClick={handleSubmit}>
                Update Item
              </Button>
            </Flex>
          </Flex>
        </Card>
      </Flex>
    </View>
  );
}
