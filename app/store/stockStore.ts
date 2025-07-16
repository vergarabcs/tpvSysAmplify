import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { storage } from './storage';
import toast from 'react-hot-toast';

export interface StockItem {
  id: string;
  description: string;
  quantity: number;
  timestamp: string;
}

interface StockState {
  receivedItems: StockItem[];
  itemCode: string;
  quantity: number;
  
  // Actions
  setItemCode: (code: string) => void;
  setQuantity: (quantity: number) => void;
  addReceivedItem: () => void;
  clearReceivedItems: () => void;
}

export const useStockStore = create<StockState>()(
  persist(
    (set, get) => ({
  receivedItems: [],
  itemCode: '',
  quantity: 1,
  
  // Actions
  setItemCode: (code) => set({ itemCode: code }),
  setQuantity: (quantity) => set({ quantity }),
  
  addReceivedItem: () => {
    const { itemCode, quantity } = get();
    
    // In a real app, you would validate and lookup the item
    const newStockItem: StockItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: `Item ${itemCode}`,
      quantity: quantity,
      timestamp: new Date().toISOString()
    };
    
    toast.success(`Received ${quantity} units of Item ${itemCode}`);
    
    set((state) => ({
      receivedItems: [newStockItem, ...state.receivedItems],
      itemCode: '',
      quantity: 1
    }));
  },
  
  clearReceivedItems: () => set({ receivedItems: [] }),
}),
    {
      name: 'tpv-stock-storage',
      storage,
    }
  )
);
