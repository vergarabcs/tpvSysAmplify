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
    <View padding={tokens.space.xxxs} width="100%" maxWidth={900} margin="0 auto">
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
      <Card variation="outlined" padding={tokens.space.xxxs}>
        <Flex direction="column" gap={tokens.space.small}>
          {loading ? (
            <Flex justifyContent="center" padding={tokens.space.large}>
              <Loader size="large" />
            </Flex>
          ) : error ? (
            <Text color={tokens.colors.red[80]} padding={tokens.space.medium}>{error}</Text>
          ) : records.length === 0 ? (
            <Text padding={tokens.space.medium} textAlign="center">No purchase records found.</Text>
          ) : (
            <Flex direction="column" gap={tokens.space.medium} padding={tokens.space.xxxs}>
              {records.map((rec, idx) => {
                const item = items.find(i => i.id === rec.itemId);
                const purchaseDate = rec.purchased_at ? new Date(rec.purchased_at).toLocaleDateString() : "-";
                
                return (
                  <Card 
                    key={rec.id || idx} 
                    variation="elevated"
                    padding={tokens.space.small}
                  >
                    <Flex direction="column" gap={tokens.space.xs}>
                      <Text 
                        fontWeight="bold" 
                        fontSize="1.1rem" 
                        color={tokens.colors.font.primary}
                      >
                        {item?.description || 
                          <Text as="span" color={tokens.colors.font.tertiary}>
                            {rec.itemId.substring(0, 8)}...
                          </Text>
                        }
                      </Text>
                      
                      <Flex direction="row" justifyContent="space-between" wrap="wrap" marginTop={tokens.space.xs}>
                        <Flex gap={tokens.space.large} alignItems="center">
                          <Flex direction="column">
                            <Text fontSize="0.8rem" color={tokens.colors.font.tertiary}>Price</Text>
                            <Text fontWeight="medium">₱ {rec.buy_price.toFixed(2)}</Text>
                          </Flex>
                          
                          <Flex direction="column">
                            <Text fontSize="0.8rem" color={tokens.colors.font.tertiary}>Quantity</Text>
                            <Text fontWeight="medium">{rec.quantity}</Text>
                          </Flex>
                          
                          <Flex direction="column">
                            <Text fontSize="0.8rem" color={tokens.colors.font.tertiary}>Date</Text>
                            <Text fontWeight="medium">{purchaseDate}</Text>
                          </Flex>
                        </Flex>
                        
                        {rec.notes && (
                          <Flex direction="column" marginTop={tokens.space.xs}>
                            <Text fontSize="0.8rem" color={tokens.colors.font.tertiary}>Notes</Text>
                            <Text fontStyle="italic" color={tokens.colors.font.secondary}>{rec.notes}</Text>
                          </Flex>
                        )}
                      </Flex>
                    </Flex>
                  </Card>
                );
              })}
            </Flex>
          )}
        </Flex>
        <Divider marginTop={tokens.space.medium} marginBottom={tokens.space.medium} />
        <Flex justifyContent="center" padding={tokens.space.small}>
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
