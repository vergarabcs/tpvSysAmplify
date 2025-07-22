"use client";

import { useEffect } from "react";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import {
  Flex,
  Text,
  View,
  useTheme,
  Pagination,
  Card,
  Divider,
  Loader,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { usePurchaseRecordsStore } from "../store/purchaseRecordsStore";
import { useItemsStore } from "../store/itemsStore";

Amplify.configure(outputs);
const client = generateClient<Schema>();

export default function PurchaseRecordsPage() {
  const { tokens } = useTheme();
  const items = useItemsStore(state => state.items);
  // Use purchase records store
  const {
    records,
    loading,
    error,
    page,
    hasNext,
    fetchRecords,
    setPage,
    filterItem,
    filterStart,
    filterEnd,
    setFilterItem,
    setFilterStart,
    setFilterEnd,
    resetPagination,
  } = usePurchaseRecordsStore();

  // Fetch items for dropdown (if needed)
  // Items are already fetched by itemsStore

  // Fetch purchase records on mount and when filters/page change
  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line
  }, [filterItem, filterStart, filterEnd, page]);

  // Pagination handler
  const handlePageChange = (newPage?: number, prevPage?: number) => {
    if (!newPage || newPage < 1) return;
    setPage(newPage);
  };

  // Reset pagination on filter change
  useEffect(() => {
    resetPagination();
  }, [filterItem, filterStart, filterEnd, resetPagination]);

  return (
    <View padding={tokens.space.medium} width="100%" maxWidth={900} margin="0 auto">
      {/* <PurchaseRecordsToolbar
        onCreated={fetchRecords}
        filterItem={filterItem}
        filterStart={filterStart}
        filterEnd={filterEnd}
        setFilterItem={setFilterItem}
        setFilterStart={setFilterStart}
        setFilterEnd={setFilterEnd}
      /> */}
      <Divider margin={tokens.space.medium} />
      {/* List */}
      <Card variation="outlined">
        <Flex direction="column" gap={tokens.space.small}>
          {loading ? (
            <Loader />
          ) : error ? (
            <Text color={tokens.colors.red[80]}>{error}</Text>
          ) : records.length === 0 ? (
            <Text>No purchase records found.</Text>
          ) : (
            records.map((rec, idx) => (
              <View key={rec.id || idx} padding={tokens.space.xs} style={{ borderBottom: "1px solid #eee" }}>
                <Flex direction="row" gap={tokens.space.medium} alignItems="center">
                  <Text fontWeight="bold">{items.find(i => i.id === rec.itemId)?.description || rec.itemId}</Text>
                  <Text>₱ {rec.buy_price}</Text>
                  <Text>Qty: {rec.quantity}</Text>
                  <Text>Date: {rec.purchased_at ? new Date(rec.purchased_at).toLocaleDateString() : "-"}</Text>
                  {rec.notes && <Text color="#666">Notes: {rec.notes}</Text>}
                </Flex>
              </View>
            ))
          )}
        </Flex>
        <Divider marginTop={tokens.space.medium} marginBottom={tokens.space.medium} />
        <Flex justifyContent="center">
          <Pagination
            currentPage={page}
            totalPages={hasNext ? page + 1 : page}
            onChange={handlePageChange}
            siblingCount={1}
          />
        </Flex>
      </Card>
    </View>
  );
}
