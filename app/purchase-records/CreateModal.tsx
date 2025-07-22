import React, { useState, useEffect } from "react";
import { Flex, Button, TextField, SelectField, useTheme, Text, Divider } from "@aws-amplify/ui-react";
import { Modal } from "./Modal";
import { useItemsStore } from "../store/itemsStore";
import { usePurchaseRecordsStore } from "../store/purchaseRecordsStore";

export function CreateModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { tokens } = useTheme();
  const items = useItemsStore((s) => s.items);
  const createRecord = usePurchaseRecordsStore((s) => s.createRecord);
  const creating = usePurchaseRecordsStore((s) => s.loading);

  // Local form state
  const [form, setForm] = useState({
    itemId: "",
    buy_price: "",
    quantity: "",
    purchased_at: "",
    notes: "",
  });
  const [formError, setFormError] = useState<string | null>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setForm({ itemId: "", buy_price: "", quantity: "", purchased_at: "", notes: "" });
      setFormError(null);
    }
  }, [isOpen]);

  const onFormChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreate = async () => {
    // Basic validation
    if (!form.itemId || !form.buy_price || !form.quantity || !form.purchased_at) {
      setFormError("All required fields must be filled.");
      return;
    }
    setFormError(null);
    await createRecord({
      itemId: form.itemId,
      buy_price: Number(form.buy_price),
      quantity: Number(form.quantity),
      purchased_at: form.purchased_at,
      notes: form.notes || undefined,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Text fontWeight="bold" fontSize="1.2rem">Add Purchase Record</Text>
      <Divider margin={tokens.space.small} />
      <Flex direction="column" gap={tokens.space.medium}>
        <SelectField
          label="Item"
          value={form.itemId}
          onChange={e => onFormChange("itemId", e.target.value)}
          width="200px"
          isRequired
        >
          <option value="">Select Item</option>
          {items.map(item => (
            <option key={item.id} value={item.id}>{item.description}</option>
          ))}
        </SelectField>
        <TextField
          label="Buy Price"
          type="number"
          value={form.buy_price}
          onChange={e => onFormChange("buy_price", e.target.value)}
          width="120px"
          isRequired
        />
        <TextField
          label="Quantity"
          type="number"
          value={form.quantity}
          onChange={e => onFormChange("quantity", e.target.value)}
          width="100px"
          isRequired
        />
        <TextField
          label="Purchased At"
          type="date"
          value={form.purchased_at}
          onChange={e => onFormChange("purchased_at", e.target.value)}
          width="170px"
          isRequired
        />
        <TextField
          label="Notes"
          value={form.notes}
          onChange={e => onFormChange("notes", e.target.value)}
          width="200px"
        />
        {formError && <Text color={tokens.colors.red[80]}>{formError}</Text>}
      </Flex>
      <Flex gap={tokens.space.small} marginTop={tokens.space.medium}>
        <Button onClick={handleCreate} isLoading={creating} variation="primary">Create</Button>
        <Button onClick={onClose} variation="link">Cancel</Button>
      </Flex>
    </Modal>
  );
}
