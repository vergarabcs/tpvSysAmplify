"use client";

import { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import {
  Button,
  Flex,
  Text,
  View,
  TextField,
  SelectField,
  useTheme,
  Pagination,
  Card,
  Divider,
  Heading,
  Loader,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

Amplify.configure(outputs);
const client = generateClient<Schema>();

export default function PurchaseRecordsPage() {
  const { tokens } = useTheme();
  // State for items (for dropdown)
  const [items, setItems] = useState<{ id: string; description: string }[]>([]);
  // State for purchase records
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Pagination
  const [page, setPage] = useState(1);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [prevTokens, setPrevTokens] = useState<string[]>([]); // for going back
  const pageSize = 10;
  // Filters
  const [filterItem, setFilterItem] = useState("");
  const [filterStart, setFilterStart] = useState<string | null>(null);
  const [filterEnd, setFilterEnd] = useState<string | null>(null);
  // Form state
  const [form, setForm] = useState({
    itemId: "",
    buy_price: "",
    quantity: "1",
    purchased_at: new Date().toISOString().slice(0, 10),
    notes: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [hasNext, setHasNext] = useState(false);

  // Fetch items for dropdown
  useEffect(() => {
    client.models.Item.list({
      limit: 1000,
    }).then(res => {
      setItems(res.data.map((i: any) => ({ id: i.id, description: i.description })));
    });
  }, []);

  // Fetch purchase records (with filters and pagination)
  useEffect(() => {
    setLoading(true);
    setError(null);
    let filter: any = {};
    if (filterItem) filter.itemId = { eq: filterItem };
    if (filterStart || filterEnd) {
      filter.purchased_at = {};
      if (filterStart) filter.purchased_at.ge = filterStart;
      if (filterEnd) filter.purchased_at.le = filterEnd;
    }
    client.models.PurchaseRecord.list({
      filter,
      limit: pageSize,
      nextToken: page === 1 ? undefined : nextToken,
      // sort: { field: "purchased_at", direction: "desc" }, // Removed unsupported sort
    })
      .then(res => {
        setRecords(res.data);
        setHasNext(!!res.nextToken);
        setNextToken(res.nextToken || null);
      })
      .catch(() => setError("Failed to load purchase records."))
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, [filterItem, filterStart, filterEnd, page]);

  // Handle form input
  const handleFormChange = (field: string, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    setFormError(null);
  };

  // Handle create
  const handleCreate = async () => {
    if (!form.itemId || !form.buy_price || !form.quantity || !form.purchased_at) {
      setFormError("All fields except notes are required.");
      return;
    }
    setCreating(true);
    try {
      await client.models.PurchaseRecord.create({
        itemId: form.itemId,
        buy_price: parseFloat(form.buy_price),
        quantity: parseFloat(form.quantity),
        purchased_at: new Date(form.purchased_at).toISOString(),
        notes: form.notes,
      });
      setForm({
        itemId: "",
        buy_price: "",
        quantity: "1",
        purchased_at: new Date().toISOString().slice(0, 10),
        notes: "",
      });
      setPage(1);
      setPrevTokens([]);
    } catch (e) {
      setFormError("Failed to create purchase record.");
    } finally {
      setCreating(false);
    }
  };

  // Pagination handler
  const handlePageChange = (newPage?: number, prevPage?: number) => {
    if (!newPage || newPage < 1) return;
    if (newPage > page) {
      // Going forward
      setPrevTokens(prev => [...prev, nextToken || ""]);
      setPage(newPage);
    } else if (newPage < page) {
      // Going back
      setPrevTokens(prev => prev.slice(0, -1));
      setPage(newPage);
    }
  };

  // Reset pagination on filter change
  useEffect(() => {
    setPage(1);
    setPrevTokens([]);
  }, [filterItem, filterStart, filterEnd]);

  return (
    <View padding={tokens.space.medium} width="100%" maxWidth={900} margin="0 auto">
      <Heading level={3} marginBottom={tokens.space.medium}>Purchase Records</Heading>
      {/* Create Form */}
      <Card variation="outlined" marginBottom={tokens.space.large}>
        <Heading level={5}>Add Purchase Record</Heading>
        <Flex direction="row" gap={tokens.space.medium} wrap="wrap" marginTop={tokens.space.small}>
          <SelectField
            label="Item"
            value={form.itemId}
            onChange={e => handleFormChange("itemId", e.target.value)}
            width="200px"
            isRequired
          >
            <option value="">Select Item</option>
            {items.map(item => (
              <option key={item.id} value={item.id}>{item.description}</option>
            ))}
          </SelectField>
          <TextField
            label="Buy Price"
            type="number"
            value={form.buy_price}
            onChange={e => handleFormChange("buy_price", e.target.value)}
            width="120px"
            isRequired
          />
          <TextField
            label="Quantity"
            type="number"
            value={form.quantity}
            onChange={e => handleFormChange("quantity", e.target.value)}
            width="100px"
            isRequired
          />
          <TextField
            label="Purchased At"
            type="date"
            value={form.purchased_at}
            onChange={e => handleFormChange("purchased_at", e.target.value)}
            width="170px"
            isRequired
          />
          <TextField
            label="Notes"
            value={form.notes}
            onChange={e => handleFormChange("notes", e.target.value)}
            width="200px"
          />
          <Button onClick={handleCreate} isLoading={creating} variation="primary">Create</Button>
        </Flex>
        {formError && <Text color={tokens.colors.red[80]}>{formError}</Text>}
      </Card>
      {/* Filters */}
      <Flex direction="row" gap={tokens.space.medium} marginBottom={tokens.space.medium} alignItems="center">
        <SelectField
          label="Filter by Item"
          value={filterItem}
          onChange={e => { setFilterItem(e.target.value); }}
          width="200px"
        >
          <option value="">All Items</option>
          {items.map(item => (
            <option key={item.id} value={item.id}>{item.description}</option>
          ))}
        </SelectField>
        <TextField
          label="Start Date"
          type="date"
          value={filterStart || ""}
          onChange={e => { setFilterStart(e.target.value || null); }}
          width="170px"
        />
        <TextField
          label="End Date"
          type="date"
          value={filterEnd || ""}
          onChange={e => { setFilterEnd(e.target.value || null); }}
          width="170px"
        />
        <Button onClick={() => { setFilterItem(""); setFilterStart(null); setFilterEnd(null); setPage(1); setPrevTokens([]); }}>Clear Filters</Button>
      </Flex>
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
