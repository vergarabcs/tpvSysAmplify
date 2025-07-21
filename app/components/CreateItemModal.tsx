"use client";

import { useState } from "react";
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
import { useItemsStore } from "../store/itemsStore";

export function CreateItemModal() {
  const { tokens } = useTheme();
  const isOpen = useItemsStore((state) => state.showCreateModal);
  const onClose = () => useItemsStore.getState().setShowCreateModal(false);
  const onSave = useItemsStore((state) => state.createItem);

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
        description: formData.description,
        sell_price: parseFloat(formData.sell_price),
        quantity: parseFloat(formData.quantity),
        low_stock_qty: parseFloat(formData.low_stock_qty),
        img: "", // Placeholder for future implementation
        qr: "", // Placeholder for future implementation
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
      <Flex justifyContent="center" alignItems="center" height="100%">
        <Card
          width={{ base: "90%", medium: "600px" }}
          padding={tokens.space.medium}
          borderRadius={tokens.radii.medium}
          onClick={(e) => e.stopPropagation()}
          variation="elevated"
        >
          <Flex direction="column" gap={tokens.space.medium}>
            <Heading level={3}>Add New Item</Heading>

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
