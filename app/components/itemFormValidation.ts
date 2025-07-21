export function validateItemForm(formData: {
  description: string;
  sell_price: string;
  quantity: string;
  low_stock_qty: string;
  tags: string;
}) {
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

  return errors;
}
