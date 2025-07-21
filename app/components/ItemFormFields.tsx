import { TextField, TextAreaField, Text } from "@aws-amplify/ui-react";

export interface ItemFormFieldsProps {
  formData: {
    description: string;
    sell_price: string;
    quantity: string;
    low_stock_qty: string;
    tags: string;
  };
  validationErrors: Record<string, string>;
  onInputChange: (field: string, value: string) => void;
}

export function ItemFormFields({ formData, validationErrors, onInputChange }: ItemFormFieldsProps) {
  return (
    <>
      <TextField
        label="Description"
        placeholder="Enter item description"
        value={formData.description}
        onChange={(e) => onInputChange("description", e.target.value)}
        hasError={!!validationErrors.description}
        errorMessage={validationErrors.description}
        isRequired
      />

      <TextField
        label="Sell Price"
        placeholder="0.00"
        value={formData.sell_price}
        onChange={(e) => onInputChange("sell_price", e.target.value)}
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
        onChange={(e) => onInputChange("quantity", e.target.value)}
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
        onChange={(e) => onInputChange("low_stock_qty", e.target.value)}
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
        onChange={(e) => onInputChange("tags", e.target.value)}
        labelHidden={false}
      />

      <Text color="#666" fontSize="0.875rem">
        Note: Image uploading will be available in a future update.
      </Text>
    </>
  );
}
