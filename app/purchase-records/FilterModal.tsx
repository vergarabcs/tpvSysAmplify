import { Flex, Button, TextField, SelectField, useTheme, Text, Divider } from "@aws-amplify/ui-react";
import { Modal } from "./Modal";
import { useItemsStore } from "../store/itemsStore";
import { usePurchaseRecordsStore } from "../store/purchaseRecordsStore";

export function FilterModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { tokens } = useTheme();
  const items = useItemsStore(state => state.items);
  const filterItem = usePurchaseRecordsStore(state => state.filterItem);
  const filterStart = usePurchaseRecordsStore(state => state.filterStart);
  const filterEnd = usePurchaseRecordsStore(state => state.filterEnd);
  const setFilterItem = usePurchaseRecordsStore(state => state.setFilterItem);
  const setFilterStart = usePurchaseRecordsStore(state => state.setFilterStart);
  const setFilterEnd = usePurchaseRecordsStore(state => state.setFilterEnd);

  // Handlers
  const handleApply = () => {
    onClose();
  };
  const handleClear = () => {
    setFilterItem("");
    setFilterStart(null);
    setFilterEnd(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Text fontWeight="bold" fontSize="1.2rem">Filter Purchase Records</Text>
      <Divider margin={tokens.space.small} />
      <Flex direction="column" gap={tokens.space.medium}>
        <SelectField
          label="Filter by Item"
          value={filterItem}
          onChange={e => setFilterItem(e.target.value)}
          width="200px"
        >
          <option value="">All Items</option>
          {items.map(item => (
            <option key={item.id} value={item.id}>{item.description}</option>
          ))}
        </SelectField>
        <TextField
          label="Start Date"
          type="date"
          value={filterStart || ""}
          onChange={e => setFilterStart(e.target.value || null)}
          width="170px"
        />
        <TextField
          label="End Date"
          type="date"
          value={filterEnd || ""}
          onChange={e => setFilterEnd(e.target.value || null)}
          width="170px"
        />
        <Flex gap={tokens.space.small}>
          <Button onClick={handleApply} variation="primary">Apply</Button>
          <Button onClick={handleClear} variation="link">Clear</Button>
          <Button onClick={onClose} variation="link">Cancel</Button>
        </Flex>
      </Flex>
    </Modal>
  );
}
