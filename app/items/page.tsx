"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
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

Amplify.configure(outputs);

const client = generateClient<Schema>();

// Define nullable type for Amplify model fields
type Nullable<T> = T | null;

// Define the API response item type
interface ApiItem {
  id: string;
  description: Nullable<string>;
  sell_price: Nullable<number>;
  quantity: Nullable<number>;
  low_stock_qty: Nullable<number>;
  img: Nullable<string>;
  qr: Nullable<string>;
  create_date: Nullable<string>;
  tags: Nullable<string>;
  readonly createdAt: string;
  readonly updatedAt: string;
}

// Define the Item interface for our UI
interface Item {
  id: string;
  description: string;
  sell_price: number;
  quantity: number;
  low_stock_qty: number;
  img?: string;
  qr?: string;
  create_date: string;
  tags?: string;
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMobile = useBreakpointValue({
    base: true,
    small: true,
    medium: false,
    large: false,
  });

  const { tokens } = useTheme();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await client.models.Item.list();
      
      // Transform ApiItem to Item, handling nullable fields
      const transformedItems: Item[] = response.data.map((apiItem: ApiItem) => ({
        id: apiItem.id,
        description: apiItem.description ?? "",
        sell_price: apiItem.sell_price ?? 0,
        quantity: apiItem.quantity ?? 0,
        low_stock_qty: apiItem.low_stock_qty ?? 0,
        img: apiItem.img ?? undefined,
        qr: apiItem.qr ?? undefined,
        create_date: apiItem.create_date ?? apiItem.createdAt,
        tags: apiItem.tags ?? undefined,
      }));
      
      setItems(transformedItems);
      setFilteredItems(transformedItems);
      setError(null);
    } catch (err) {
      console.error("Error fetching items:", err);
      setError("Failed to load items. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async (newItem: Omit<Item, 'id'>) => {
    try {
      await client.models.Item.create({
        ...newItem,
        create_date: new Date().toISOString(),
      });
      setShowCreateModal(false);
      fetchItems();
    } catch (err) {
      console.error("Error creating item:", err);
      setError("Failed to create item. Please try again.");
    }
  };

  const handleEditItem = async (updatedItem: Item) => {
    try {
      await client.models.Item.update({
        ...updatedItem,
      });
      setShowEditModal(false);
      fetchItems();
    } catch (err) {
      console.error("Error updating item:", err);
      setError("Failed to update item. Please try again.");
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await client.models.Item.delete({ id });
      setShowDeleteModal(false);
      fetchItems();
    } catch (err) {
      console.error("Error deleting item:", err);
      setError("Failed to delete item. Please try again.");
    }
  };

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
        onSave={handleCreateItem}
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
            onSave={handleEditItem}
          />

          <DeleteItemModal
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setSelectedItem(null);
            }}
            item={selectedItem}
            onConfirm={() => handleDeleteItem(selectedItem.id)}
          />
        </>
      )}
    </View>
  );
}