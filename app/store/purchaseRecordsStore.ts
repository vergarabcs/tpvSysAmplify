import { create } from 'zustand';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import toast from 'react-hot-toast';

const client = generateClient<Schema>();

export interface PurchaseRecord {
  id: string;
  itemId: string;
  buy_price: number;
  quantity: number;
  purchased_at: string;
  notes?: string;
}

interface PurchaseRecordsState {
  records: PurchaseRecord[];
  loading: boolean;
  error: string | null;
  page: number;
  nextToken: string | null;
  prevTokens: string[];
  pageSize: number;
  hasNext: boolean;
  filterItem: string;
  filterStart: string | null;
  filterEnd: string | null;
  fetchRecords: () => Promise<void>;
  setPage: (page: number) => void;
  setFilterItem: (id: string) => void;
  setFilterStart: (date: string | null) => void;
  setFilterEnd: (date: string | null) => void;
  resetPagination: () => void;
  createRecord: (data: Omit<PurchaseRecord, 'id'>) => Promise<void>;
}

export const usePurchaseRecordsStore = create<PurchaseRecordsState>((set, get) => ({
  records: [],
  loading: false,
  error: null,
  page: 1,
  nextToken: null,
  prevTokens: [],
  pageSize: 10,
  hasNext: false,
  filterItem: '',
  filterStart: null,
  filterEnd: null,

  fetchRecords: async () => {
    set({ loading: true, error: null });
    const { filterItem, filterStart, filterEnd, page, nextToken, pageSize } = get();
    let filter: any = {};
    if (filterItem) filter.itemId = { eq: filterItem };
    if (filterStart || filterEnd) {
      filter.purchased_at = {};
      if (filterStart) filter.purchased_at.ge = filterStart;
      if (filterEnd) filter.purchased_at.le = filterEnd;
    }
    try {
      const res = await client.models.PurchaseRecord.list({
        filter,
        limit: pageSize,
        nextToken: page === 1 ? undefined : nextToken,
      });
      set({
        records: (res.data ?? []).filter((r: any) => r && r.itemId != null && r.id != null && r.buy_price != null && r.quantity != null && r.purchased_at != null)
          .map((r: any) => ({
            id: r.id,
            itemId: r.itemId,
            buy_price: r.buy_price,
            quantity: r.quantity,
            purchased_at: r.purchased_at,
            notes: r.notes ?? undefined,
          })),
        hasNext: !!res.nextToken,
        nextToken: res.nextToken || null,
        loading: false,
      });
    } catch (e) {
      set({ error: 'Failed to load purchase records.', loading: false });
    }
  },

  setPage: (page) => set({ page }),
  setFilterItem: (id) => set({ filterItem: id }),
  setFilterStart: (date) => set({ filterStart: date }),
  setFilterEnd: (date) => set({ filterEnd: date }),
  resetPagination: () => set({ page: 1, prevTokens: [] }),

  createRecord: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await client.models.PurchaseRecord.create(data);
      if(response?.errors?.length && response?.errors?.length > 0){
        throw response.errors?.map(error => error.message).join(' ')
      }
      // After creation, refresh list
      await get().fetchRecords();
    } catch (e) {
      toast.error('Failed to create purchase record.' + e)
    } finally {
      set({ loading: false });
    }
  },
}));
