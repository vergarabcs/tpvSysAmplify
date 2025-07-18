"use client";

import { useEffect } from "react";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import {
  Button,
  Flex,
  Text,
  View,
  useBreakpointValue,
  useTheme
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { CreateItemModal } from "../components/CreateItemModal";
import { EditItemModal } from "../components/EditItemModal";
import { DeleteItemModal } from "../components/DeleteItemModal";
import { HighLightedText } from "../components/HighLightedText";
import { useItemsStore, useCartStore, Item } from "../store";
import { FixedSizeList as List } from "react-window";

Amplify.configure(outputs);


export default function ItemsPage() {
  const { 
    items,
    loading,
    showCreateModal, 
    selectedItem,
    showEditModal,
    showDeleteModal,
    error,
    observeItems,
    createItem,
    updateItem,
    deleteItem,
    setSelectedItem,
    setShowCreateModal,
    setShowEditModal,
    setShowDeleteModal,
  } = useItemsStore();

  const searchString = useItemsStore(state => state.searchString)
  const filteredItems = getFiltered(items, searchString)

  const { addItem } = useCartStore();

  const isMobile = useBreakpointValue({
    base: true,
    small: true,
    medium: false,
    large: false,
  });

  const { tokens } = useTheme();

  useEffect(() => {
    const unsubscribe = observeItems()
    return unsubscribe
  }, [observeItems]);

  const openEditModal = (item: Item) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const openDeleteModal = (item: Item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  return (
    <View padding={0} width="100%">
      {error && (
        <View padding={tokens.space.small} backgroundColor={tokens.colors.red[10]}>
          <Text color={tokens.colors.red[80]}>{error}</Text>
        </View>
      )}

      {loading ? (
        <View padding={tokens.space.large} textAlign="center">
          <Text>Loading items...</Text>
        </View>
      ) : filteredItems.length === 0 ? (
        <View padding={tokens.space.large} textAlign="center">
          <Text>No items found.</Text>
        </View>
      ) : (
        <List
          height={710}
          itemCount={filteredItems.length}
          itemSize={120}
          width={"100%"}
          
        >
          {({ index, style }) => {
            const item = filteredItems[index];
            return (
              <div style={style} key={item.id}>
                <Flex 
                  direction="row"
                  width="100%"
                  padding={0}
                  backgroundColor="white"
                  style={{ borderBottom: "1px solid #eaeaea" }}
                  onClick={() => openEditModal(item)}
                >
                  <View flex="1" padding={tokens.space.small}>
                    <Text fontSize={tokens.fontSizes.medium} fontWeight="bold">
                      <HighLightedText searchString={searchString}>
                        {item.description}
                      </HighLightedText>
                    </Text>
                  </View>
                  <Flex direction="column" padding={tokens.space.xs} justifyContent="center" alignItems="flex-end" minWidth="100px">
                    <Text fontWeight="bold">₱ {item.sell_price}</Text>
                    <Text>Qty: {item.quantity}</Text>
                  </Flex>
                  <View
                    width="120px"
                    height="100px"
                    backgroundColor="#ccc"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Text color="#666">Image</Text>
                  </View>
                </Flex>
              </div>
            );
          }}
        </List>
      )}

      <CreateItemModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        onSave={createItem}
      />

      {selectedItem && (
        <>
          <EditItemModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedItem(null);
            }}
            item={selectedItem}
            onSave={updateItem}
          />

          <DeleteItemModal
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setSelectedItem(null);
            }}
            item={selectedItem}
            onConfirm={() => deleteItem(selectedItem.id)}
          />
        </>
      )}
    </View>
  );
}

function getFiltered(items: Item[], searchString: string) {
  if (!searchString.trim()) return items;
  const stringList = searchString.split(' ').map(word => word.toLowerCase()).filter((val) => !!val);
  // Map each item to its match count
  const filteredWithMatchCount = items
    .map(item => {
      const descriptionLower = item.description.toLowerCase();
      const matchCount = stringList.reduce((count, word) =>
        descriptionLower.includes(word) ? count + 1 : count, 0
      );
      return { item, matchCount };
    })
    .filter(({ matchCount }) => matchCount > 0);
  // Sort by match count (desc), then alphabetically
  filteredWithMatchCount.sort((a, b) => {
    if (b.matchCount !== a.matchCount) {
      return b.matchCount - a.matchCount;
    }
    return a.item.description.localeCompare(b.item.description);
  });
  return filteredWithMatchCount.map(({ item }) => item);
}
