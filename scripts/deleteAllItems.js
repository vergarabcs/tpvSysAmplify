// Import required modules
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, BatchWriteCommand } = require('@aws-sdk/lib-dynamodb');
const path = require('path');
const fs = require('fs');

// Load config
const configPath = path.resolve(__dirname, 'scriptConfigs.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const TABLE_NAME = config.TABLE_NAME;

// AWS DynamoDB client
const client = new DynamoDBClient({ region: 'ap-southeast-1' });
const ddbDocClient = DynamoDBDocumentClient.from(client);

// Scan all items from the table
async function scanAllItems() {
  let items = [];
  let ExclusiveStartKey = undefined;
  do {
    const params = {
      TableName: TABLE_NAME,
      ExclusiveStartKey,
    };
    const result = await ddbDocClient.send(new ScanCommand(params));
    items = items.concat(result.Items);
    ExclusiveStartKey = result.LastEvaluatedKey;
  } while (ExclusiveStartKey);
  return items;
}

// Batch delete items (max 25 per batch)
async function batchDelete(items) {
  const BATCH_SIZE = 25;
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);
    const params = {
      RequestItems: {
        [TABLE_NAME]: batch.map((item) => ({ DeleteRequest: { Key: { id: item.id } } })),
      },
    };
    try {
      const result = await ddbDocClient.send(new BatchWriteCommand(params));
      if (result.UnprocessedItems && Object.keys(result.UnprocessedItems).length > 0) {
        console.warn('Some items were not deleted:', result.UnprocessedItems);
      }
      console.log(`Batch ${i / BATCH_SIZE + 1} deleted.`);
    } catch (err) {
      console.error('Batch delete error:', err);
    }
  }
}

// Main function
(async () => {
  try {
    console.log('Scanning all items...');
    const items = await scanAllItems();
    console.log(`Found ${items.length} items.`);
    if (items.length === 0) {
      console.log('No items to delete.');
      return;
    }
    console.log('Deleting items from DynamoDB...');
    await batchDelete(items);
    console.log('Delete complete.');
  } catch (err) {
    console.error('Error:', err);
  }
})();