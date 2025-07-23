import { useState } from "react";
import {
  Flex,
  Button,
  useTheme,
  Icon,
} from "@aws-amplify/ui-react";
import { useItemsStore } from "../store/itemsStore";
import { usePurchaseRecordsStore } from "../store/purchaseRecordsStore";
import { CreateModal } from "./CreateModal";
import { FilterModal } from "./FilterModal";

export function PurchaseRecordsToolbar() {
  const { tokens } = useTheme();
  const fetchRecords = usePurchaseRecordsStore(state => state.fetchRecords)

  // Dialog state
  const [showCreate, setShowCreate] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  return (
    <Flex gap={tokens.space.small} alignItems="center">
      <Button color={'white'} onClick={() => setShowCreate(true)}>
        Add
      </Button>
      <Button color='white' onClick={() => setShowFilter(true)}>
        Filter
      </Button>
      <Button color='white' onClick={() => fetchRecords()}>
        Reload
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
