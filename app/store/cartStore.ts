import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { storage } from './storage';
import { Item } from './itemsStore';
import toast from 'react-hot-toast';

export interface CartItem {
  id: string;
  description: string;
  price: number;
  quantity: number;
}

interface CustomerInfo {
  name: string;
  phone: string;
}

interface CartState {
  cartItems: CartItem[];
  customerInfo: CustomerInfo;
  
  // Actions
  addItem: (item: Item) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  setCustomerInfo: (info: CustomerInfo) => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
  cartItems: [],
  customerInfo: {
    name: '',
    phone: '',
  },
  
  // Actions
  addItem: (item) => {
    set((state) => {
      // Check if item already exists in cart
      const existingItemIndex = state.cartItems.findIndex(
        cartItem => cartItem.id === item.id
      );
      
      if (existingItemIndex !== -1) {
        // Update quantity of existing item
        const updatedItems = [...state.cartItems];
        updatedItems[existingItemIndex].quantity += 1;
        toast.success(`Added another ${item.description} to cart`);
        return { cartItems: updatedItems };
      } else {
        // Add new item to cart
        const newCartItem: CartItem = {
          id: item.id,
          description: item.description,
          price: item.sell_price,
          quantity: 1,
        };
        toast.success(`${item.description} added to cart`);
        return { cartItems: [...state.cartItems, newCartItem] };
      }
    });
  },
  
  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      get().removeItem(id);
    } else {
      set((state) => {
        const item = state.cartItems.find(item => item.id === id);
        if (item) {
          toast.success(`Updated ${item.description} quantity to ${quantity}`);
        }
        return {
          cartItems: state.cartItems.map(item => 
            item.id === id ? { ...item, quantity } : item
          )
        };
      });
    }
  },
  
  removeItem: (id) => {
    set((state) => {
      const item = state.cartItems.find(item => item.id === id);
      if (item) {
        toast.success(`Removed ${item.description} from cart`);
      }
      return {
        cartItems: state.cartItems.filter(item => item.id !== id)
      };
    });
  },
  
  clearCart: () => {
    set({ cartItems: [] });
  },
  
  setCustomerInfo: (info) => {
    set({ customerInfo: info });
  },
  
  getTotal: () => {
    return get().cartItems.reduce(
      (total, item) => total + item.price * item.quantity, 
      0
    );
  },
}),
    {
      name: 'tpv-cart-storage',
      storage,
    }
  )
);
