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
  const [itemSearch, setItemSearch] = useState("");

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
    // Convert 'YYYY-MM-DD' to ISO string for purchased_at
    let purchasedAtISO = form.purchased_at;
    if (/^\d{4}-\d{2}-\d{2}$/.test(form.purchased_at)) {
      purchasedAtISO = new Date(form.purchased_at + 'T00:00:00Z').toISOString();
    }
    await createRecord({
      itemId: form.itemId,
      buy_price: Number(form.buy_price),
      quantity: Number(form.quantity),
      purchased_at: purchasedAtISO,
      notes: form.notes || undefined,
    });
    onClose();
  };

  const filteredItems = itemSearch.trim() === ""
    ? items
    : items.filter(item => item.description.toLowerCase().includes(itemSearch.toLowerCase()));

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Text fontWeight="bold" fontSize="1.3rem" marginBottom={tokens.space.xs} letterSpacing="0.01em">Add Purchase Record</Text>
      <Divider margin={`${tokens.space.xs} 0 ${tokens.space.small} 0`} />
      <Flex direction="column" gap={tokens.space.medium}>
        <TextField
          label="Search"
          placeholder="Search item..."
          value={itemSearch}
          onChange={e => setItemSearch(e.target.value)}
          width="100%"
          borderRadius={8}
          marginBottom={tokens.space.xs}
        />
        <SelectField
          label="Item"
          value={form.itemId}
          onChange={e => onFormChange("itemId", e.target.value)}
          width="100%"
          isRequired
          borderRadius={8}
        >
          <option value="">Select Item</option>
          {filteredItems.map(item => (
            <option key={item.id} value={item.id}>{item.description}</option>
          ))}
        </SelectField>
        <Flex gap={tokens.space.small}>
          <TextField
            label="Buy Price"
            type="number"
            value={form.buy_price}
            onChange={e => onFormChange("buy_price", e.target.value)}
            width="100%"
            isRequired
            borderRadius={8}
          />
          <TextField
            label="Quantity"
            type="number"
            value={form.quantity}
            onChange={e => onFormChange("quantity", e.target.value)}
            width="100%"
            isRequired
            borderRadius={8}
          />
        </Flex>
        <TextField
          label="Purchased At"
          type="date"
          value={form.purchased_at}
          onChange={e => onFormChange("purchased_at", e.target.value)}
          width="100%"
          isRequired
          borderRadius={8}
        />
        <TextField
          label="Notes"
          value={form.notes}
          onChange={e => onFormChange("notes", e.target.value)}
          width="100%"
          borderRadius={8}
        />
        {formError && <Text color={tokens.colors.red[80]} fontSize="0.95em">{formError}</Text>}
      </Flex>
      <Flex gap={tokens.space.small} marginTop={tokens.space.large} justifyContent="flex-end">
        <Button onClick={handleCreate} isLoading={creating} variation="primary" borderRadius={8} padding={tokens.space.large}>Create</Button>
        <Button onClick={onClose} variation="link" borderRadius={8}>Cancel</Button>
      </Flex>
    </Modal>
  );
}
