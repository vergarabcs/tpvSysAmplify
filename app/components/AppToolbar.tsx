"use client";

import { View, Flex, Button, Text, useTheme, Input, SearchField } from '@aws-amplify/ui-react';
import { usePathname } from 'next/navigation';
import { useItemsStore } from '../store';
import { useRef } from 'react';

interface AppToolbarProps {
  onOptions?: () => void;
  onPrint?: () => void;
}

export function AppToolbar({
  onOptions,
  onPrint,
}: AppToolbarProps) {
  const { tokens } = useTheme();
  const fetchItems = useItemsStore(state => state.fetchItems)
  const setSearchString = useItemsStore(state => state.setSearchString)
  const searchString = useItemsStore(state => state.searchString)
  const pathname = usePathname();
  const setShowCreateModal = useItemsStore(state => state.setShowCreateModal);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search setter
  const handleSearchChange = (e: any) => {
    const value = e.target.value;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchString(value);
    }, 2000);
  };

  // Example: change toolbar buttons based on page
  // You can expand this logic for more complex needs
  const showSearch = pathname === '/items' || pathname === '/cart';
  const showAdd = pathname === '/items';
  const showOptions = true;
  const showRefresh = true;
  const showPrint = pathname === '/reports' || pathname === '/cart';

  const onAdd = () => {
    setShowCreateModal(true)
  }

  return (
    <>
      {showSearch && (
        <View as="div" width="100%" maxWidth="300px" padding={tokens.space.xs}>
          <Input
            type="text"
            placeholder="Search..."
            backgroundColor={tokens.colors.primary[20].value}
            value={searchString}
            onChange={handleSearchChange}
          />
        </View>
      )}
      <Flex gap={tokens.space.xs}>
        {showAdd && (
          <Button
            aria-label="Add item"
            backgroundColor="transparent"
            color="white"
            size="small"
            variation="link"
            onClick={onAdd}
          >
            <Text fontSize="1.5rem">+</Text>
          </Button>
        )}
        {showOptions && (
          <Button
            aria-label="View options"
            backgroundColor="transparent"
            color="white"
            size="small"
            variation="link"
            onClick={onOptions}
          >
            <Text fontSize="1.5rem">≡</Text>
          </Button>
        )}
        {showRefresh && (
          <Button
            aria-label="Refresh"
            backgroundColor="transparent"
            color="white"
            size="small"
            variation="link"
            onClick={() => fetchItems()}
          >
            <Text fontSize="1.5rem">↻</Text>
          </Button>
        )}
        {showPrint && (
          <Button
            aria-label="Print"
            backgroundColor="transparent"
            color="white"
            size="small"
            variation="link"
            onClick={onPrint}
          >
            <Text fontSize="1.5rem">🖨️</Text>
          </Button>
        )}
      </Flex>
    </>
  );
}
