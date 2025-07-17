"use client";

import { View, Flex, Button, Text, useTheme } from '@aws-amplify/ui-react';
import { usePathname } from 'next/navigation';
import { useItemsStore } from '../store';

interface AppToolbarProps {
  onSearchChange?: (value: string) => void;
  onOptions?: () => void;
  onPrint?: () => void;
}

export function AppToolbar({
  onSearchChange,
  onOptions,
  onPrint,
}: AppToolbarProps) {
  const { tokens } = useTheme();
  const fetchItems = useItemsStore(state => state.fetchItems)
  const pathname = usePathname();
  const setShowCreateModal = useItemsStore(state => state.setShowCreateModal);

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
          <input
            type="text"
            placeholder="Search..."
            style={{
              width: '100%',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: 'white',
            }}
            onChange={e => onSearchChange?.(e.target.value)}
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
