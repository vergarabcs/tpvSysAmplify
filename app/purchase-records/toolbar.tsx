import { useState } from "react";
import {
  Flex,
  Button,
  useTheme,
} from "@aws-amplify/ui-react";
import { useItemsStore } from "../store/itemsStore";
import { usePurchaseRecordsStore } from "../store/purchaseRecordsStore";
import { CreateModal } from "./CreateModal";
import { FilterModal } from "./FilterModal";

export function PurchaseRecordsToolbar() {
  const { tokens } = useTheme();
  const items = useItemsStore(state => state.items);
  // Use store for creation and filter state
  const createRecord = usePurchaseRecordsStore(state => state.createRecord);
  const filterItem = usePurchaseRecordsStore(state => state.filterItem);
  const filterStart = usePurchaseRecordsStore(state => state.filterStart);
  const filterEnd = usePurchaseRecordsStore(state => state.filterEnd);
  const setFilterItem = usePurchaseRecordsStore(state => state.setFilterItem);
  const setFilterStart = usePurchaseRecordsStore(state => state.setFilterStart);
  const setFilterEnd = usePurchaseRecordsStore(state => state.setFilterEnd);

  // Dialog state
  const [showCreate, setShowCreate] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  // Create form state
  const [form, setForm] = useState({
    itemId: "",
    buy_price: "",
    quantity: "1",
    purchased_at: new Date().toISOString().slice(0, 10),
    notes: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  // Filter form state (controlled by store)
  // Use local state for dialog editing, but initialize from store
  const [localFilterItem, setLocalFilterItem] = useState(filterItem);
  const [localFilterStart, setLocalFilterStart] = useState(filterStart);
  const [localFilterEnd, setLocalFilterEnd] = useState(filterEnd);

  // Sync dialog state with store when opening
  const openFilterDialog = () => {
    setLocalFilterItem(filterItem);
    setLocalFilterStart(filterStart);
    setLocalFilterEnd(filterEnd);
    setShowFilter(true);
  };

  return (
    <Flex gap={tokens.space.small} alignItems="center">
      <Button variation="primary" onClick={() => setShowCreate(true)}>
        Add
      </Button>
      <Button variation="link" onClick={openFilterDialog}>
        Filter
      </Button>
      <CreateModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
      />
      <FilterModal
        isOpen={showFilter}
        onClose={() => setShowFilter(false)}
      />
    </Flex>
  );
}
