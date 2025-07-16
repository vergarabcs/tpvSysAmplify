import { create } from 'zustand';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import toast from 'react-hot-toast';

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
export interface Item {
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

interface ItemsState {
  items: Item[];
  filteredItems: Item[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  itemsPerPage: number;
  selectedItem: Item | null;
  showCreateModal: boolean;
  showEditModal: boolean;
  showDeleteModal: boolean;
  
  // Actions
  fetchItems: () => Promise<void>;
  createItem: (newItem: Omit<Item, 'id'>) => Promise<void>;
  updateItem: (updatedItem: Item) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  setSelectedItem: (item: Item | null) => void;
  setShowCreateModal: (show: boolean) => void;
  setShowEditModal: (show: boolean) => void;
  setShowDeleteModal: (show: boolean) => void;
  setCurrentPage: (page: number) => void;
  setFilteredItems: (items: Item[]) => void;
}

export const useItemsStore = create<ItemsState>((set, get) => ({
  items: [],
  filteredItems: [],
  loading: false,
  error: null,
  currentPage: 1,
  itemsPerPage: 10,
  selectedItem: null,
  showCreateModal: false,
  showEditModal: false,
  showDeleteModal: false,
  
  // Actions
  fetchItems: async () => {
    set({ loading: true });
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
      
      set({
        items: transformedItems,
        filteredItems: transformedItems,
        error: null,
        loading: false
      });
    } catch (err) {
      console.error("Error fetching items:", err);
      set({
        error: "Failed to load items. Please try again later.",
        loading: false
      });
    }
  },
  
  createItem: async (newItem) => {
    try {
      await client.models.Item.create({
        ...newItem,
        create_date: new Date().toISOString(),
      });
      set({ showCreateModal: false });
      toast.success(`${newItem.description} created successfully`);
      get().fetchItems();
    } catch (err) {
      console.error("Error creating item:", err);
      toast.error("Failed to create item");
      set({ error: "Failed to create item. Please try again." });
    }
  },
  
  updateItem: async (updatedItem) => {
    try {
      await client.models.Item.update({
        ...updatedItem,
      });
      set({ showEditModal: false });
      toast.success(`${updatedItem.description} updated successfully`);
      get().fetchItems();
    } catch (err) {
      console.error("Error updating item:", err);
      toast.error("Failed to update item");
      set({ error: "Failed to update item. Please try again." });
    }
  },
  
  deleteItem: async (id) => {
    try {
      const itemToDelete = get().selectedItem;
      await client.models.Item.delete({ id });
      set({ showDeleteModal: false });
      if (itemToDelete) {
        toast.success(`${itemToDelete.description} deleted successfully`);
      } else {
        toast.success('Item deleted successfully');
      }
      get().fetchItems();
    } catch (err) {
      console.error("Error deleting item:", err);
      toast.error("Failed to delete item");
      set({ error: "Failed to delete item. Please try again." });
    }
  },
  
  setSelectedItem: (item) => set({ selectedItem: item }),
  setShowCreateModal: (show) => set({ showCreateModal: show }),
  setShowEditModal: (show) => set({ showEditModal: show }),
  setShowDeleteModal: (show) => set({ showDeleteModal: show }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setFilteredItems: (items) => set({ filteredItems: items }),
}));
