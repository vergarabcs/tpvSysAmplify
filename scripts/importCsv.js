// Import required modules
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, BatchWriteCommand } = require('@aws-sdk/lib-dynamodb');

// DynamoDB table name (update if needed)
const TABLE_NAME = 'Item-2xtj2wesdbh4xjszjgzcsrqtva-NONE';
// CSV file path (update if needed)
const CSV_PATH = path.resolve(__dirname, '/Users/billcarlo.vergara/Downloads/inventory.item.csv');
const LIMIT = 300;

// AWS DynamoDB client
const client = new DynamoDBClient({ region: 'ap-southeast-1' });
const ddbDocClient = DynamoDBDocumentClient.from(client);

// Helper to clean and map CSV row to DynamoDB item
function mapRow(row) {
  // Only import rows with a id and description
  if (!row.id || !row.description) return null;
const now = new Date().toISOString();
return {
    id: row.id,
    __typename: 'Item',
    description: row.description,
    sell_price: row.sell_price ? Number(row.sell_price) : undefined,
    quantity: row.quantity ? Number(row.quantity) : undefined,
    low_stock_qty: row.low_stock_qty ? Number(row.low_stock_qty) : undefined,
    img: row.img || undefined,
    qr: row.qr || undefined,
    createdAt: row.create_date || now,
    updatedAt: row.create_date || now
};
}

// Read and parse CSV
function readCsv(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        const item = mapRow(data);
        if (item) results.push(item);
      })
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

// Batch write to DynamoDB (max 25 items per batch)
async function batchWrite(items) {
  const BATCH_SIZE = 25;
  for (let i = 0; i < Math.min(items.length, LIMIT); i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);
    const params = {
      RequestItems: {
        [TABLE_NAME]: batch.map((item) => ({ PutRequest: { Item: item } })),
      },
    };
    try {
      const result = await ddbDocClient.send(new BatchWriteCommand(params));
      if (result.UnprocessedItems && Object.keys(result.UnprocessedItems).length > 0) {
        console.warn('Some items were not processed:', result.UnprocessedItems);
      }
      console.log(`Batch ${i / BATCH_SIZE + 1} written.`);
    } catch (err) {
      console.error('Batch write error:', err);
    }
  }
}

// Main function
(async () => {
  try {
    console.log('Reading CSV...');
    const items = await readCsv(CSV_PATH);
    console.log(`Parsed ${items.length} items.`);
    if (items.length === 0) {
      console.log('No valid items to import.');
      return;
    }
    console.log('Importing to DynamoDB...');
    await batchWrite(items);
    console.log('Import complete.');
  } catch (err) {
    console.error('Error:', err);
  }
})();
