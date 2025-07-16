"use client";

import { useEffect } from "react";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import {
  Button,
  Collection,
  Flex,
  Pagination,
  Text,
  View,
  useBreakpointValue,
  useTheme,
  Image
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { CreateItemModal } from "../components/CreateItemModal";
import { EditItemModal } from "../components/EditItemModal";
import { DeleteItemModal } from "../components/DeleteItemModal";
import { useItemsStore, useCartStore, Item } from "../store";

Amplify.configure(outputs);

export default function ItemsPage() {
  const { 
    items,
    filteredItems, 
    loading,
    currentPage, 
    itemsPerPage,
    showCreateModal, 
    selectedItem,
    showEditModal,
    showDeleteModal,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    setSelectedItem,
    setShowCreateModal,
    setShowEditModal,
    setShowDeleteModal,
    setCurrentPage
  } = useItemsStore();
  
  const { addItem } = useCartStore();

  const isMobile = useBreakpointValue({
    base: true,
    small: true,
    medium: false,
    large: false,
  });

  const { tokens } = useTheme();

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const openEditModal = (item: Item) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const openDeleteModal = (item: Item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

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
        <Collection
          items={currentItems}
          type="list"
          direction="column"
          gap="0"
          padding="0"
        >
          {(item) => (
            <Flex 
              key={item.id}
              direction="row"
              width="100%"
              padding={0}
              backgroundColor="white"
              style={{ borderBottom: "1px solid #eaeaea" }}
              onClick={() => openEditModal(item)}
            >
              <View flex="1" padding={tokens.space.small}>
                <Text fontSize={tokens.fontSizes.medium} fontWeight="bold">
                  {item.description}
                </Text>
              </View>
              
              <Flex direction="column" padding={tokens.space.xs} justifyContent="center" alignItems="flex-end" minWidth="100px">
                <Text fontWeight="bold">₱ {item.sell_price}</Text>
                <Text>Qty: {item.quantity}</Text>
                <Button 
                  size="small"
                  variation="primary"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent edit modal from opening
                    addItem(item);
                  }}
                  marginTop={tokens.space.xs}
                >
                  Add to Cart
                </Button>
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
          )}
        </Collection>
      )}

      {totalPages > 1 && (
        <Flex justifyContent="center" marginTop={tokens.space.medium}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onNext={() => setCurrentPage(currentPage + 1)}
            onPrevious={() => setCurrentPage(currentPage - 1)}
            onChange={(pageIndex) => pageIndex !== undefined ? setCurrentPage(pageIndex) : null}
            siblingCount={isMobile ? 0 : 1}
          />
        </Flex>
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