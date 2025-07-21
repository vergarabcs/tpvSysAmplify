"use client";

import { View, Flex, Button, Text, useTheme, Input, SearchField } from '@aws-amplify/ui-react';
import { usePathname } from 'next/navigation';
import { useItemsStore } from '../store';
import { useRef, useState, useEffect } from 'react';

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
  const searchWordFrequency = useItemsStore(state => state.searchWordFrequency);
  const pathname = usePathname();
  const setShowCreateModal = useItemsStore(state => state.setShowCreateModal);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    // Get top 20 most used words
    if (searchWordFrequency) {
      const sorted = Object.entries(searchWordFrequency)
        .sort((a, b) => b[1] - a[1])
        .map(([word]) => word)
        .slice(0, 20);
      setSuggestions(sorted);
    }
  }, [searchWordFrequency]);

  // Debounced search setter
  const handleSearchChange = (e: any) => {
    const value = e.target.value;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchString(value);
    }, 1000);
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
            onChange={handleSearchChange}
            list="search-suggestions"
          />
          <datalist id="search-suggestions">
            {suggestions.map((word) => (
              <option key={word} value={word} />
            ))}
          </datalist>
        </View>
      )}
      <Flex gap={tokens.space.xxxs}>
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
