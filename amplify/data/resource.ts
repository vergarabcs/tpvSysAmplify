import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  PurchaseRecord: a.model({
    itemId: a.id(),
    item: a.belongsTo('Item', 'itemId'),
    buy_price: a.float().required(),
    quantity: a.float().default(1),
    purchased_at: a.datetime().default("1970-01-01T00:00:00Z"),
    notes: a.string(),
    suppliers: a.hasMany('SupplierPurchaseRecord', 'purchaseRecordId'),
  }).authorization((allow) => [allow.publicApiKey()]),
  Item: a.model({
    description: a.string(),
    sell_price: a.float().default(999999),
    quantity: a.float().default(999999),
    low_stock_qty: a.float().default(999999),
    img: a.string(),
    qr: a.string(), // S3 key or URL
    tags: a.string(), // comma-separated tags
    purchaseRecords: a.hasMany('PurchaseRecord', 'itemId'),
  }).authorization((allow) => [allow.publicApiKey()]),
  SupplierPurchaseRecord: a.model({
    supplierId: a.id().required(),
    purchaseRecordId: a.id().required(),
    supplier: a.belongsTo('Supplier', 'supplierId'),
    purchaseRecord: a.belongsTo('PurchaseRecord', 'purchaseRecordId'),
  }).authorization((allow) => [allow.publicApiKey()]),
  Supplier: a.model({
    name: a.string().required(),
    contact: a.string(),
    email: a.string(),
    phone: a.string(),
    address: a.string(),
    purchaseRecords: a.hasMany('SupplierPurchaseRecord', 'supplierId'),
  }).authorization((allow) => [allow.publicApiKey()]),

  // Custom mutation for atomic transaction
  CreatePurchaseRecordAndUpdateItem: a
    .mutation()
    .arguments({
      itemId: a.id().required(),
      buy_price: a.float().required(),
      quantity: a.float().required(),
      purchased_at: a.datetime().required(),
      notes: a.string(), // optional by default
    })
    .returns(a.ref('PurchaseRecord'))
    .authorization((allow) => [allow.publicApiKey()])
    .handler(
      a.handler.custom({
        dataSource: a.ref('PurchaseRecord'),
        entry: './CreatePurchaseRecordAndUpdateItemHandler.js',
      })
    ),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});