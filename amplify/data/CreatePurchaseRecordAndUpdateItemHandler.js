import { util } from '@aws-appsync/utils';

export function request(ctx) {
    const { itemId, buy_price, quantity, purchased_at, notes } = ctx.args;
    const now = util.time.nowISO8601();
    const purchaseRecordId = util.autoId();

    const env = 'NONE'
    const apiId = ctx?.request?.headers?.host === 'gfyx6antrvbunhynp4ckq5qooi.appsync-api.ap-southeast-1.amazonaws.com' ?
        '2xtj2wesdbh4xjszjgzcsrqtva' : '3q5xjmcdjvhspe6pdptj4dlclq'
    // Table names
    const purchaseRecordTable = `PurchaseRecord-${apiId}-${env}`;
    const itemTable = `Item-${apiId}-${env}`;
    // Transaction: create PurchaseRecord, update Item quantity
    ctx.stash.purchaseRecordId = purchaseRecordId;
    ctx.stash.createdAt = now;
    ctx.stash.updatedAt = now;
    return {
        operation: 'TransactWriteItems',
        transactItems: [
            {
                table: purchaseRecordTable,
                operation: 'PutItem',
                key: util.dynamodb.toMapValues({ id: purchaseRecordId }),
                attributeValues: util.dynamodb.toMapValues({
                    id: purchaseRecordId,
                    itemId,
                    buy_price,
                    quantity,
                    purchased_at,
                    notes,
                    createdAt: now,
                    updatedAt: now,
                }),
            },
            {
                table: itemTable,
                operation: 'UpdateItem',
                key: util.dynamodb.toMapValues({ id: itemId }),
                update: {
                    expression: 'SET quantity = if_not_exists(quantity, :zero) + :inc, updatedAt = :now',
                    expressionValues: util.dynamodb.toMapValues({
                        ':inc': quantity,
                        ':zero': 0,
                        ':now': now,
                    }),
                },
            },
        ],
    };
}

export function response(ctx) {
    if (ctx.error) {
        util.error(ctx.error.message, ctx.error.type);
    }
    // Return the created PurchaseRecord using stashed values
    return {
        id: ctx.stash.purchaseRecordId,
        itemId: ctx.args.itemId,
        buy_price: ctx.args.buy_price,
        quantity: ctx.args.quantity,
        purchased_at: ctx.args.purchased_at,
        notes: ctx.args.notes,
        createdAt: ctx.stash.createdAt,
        updatedAt: ctx.stash.updatedAt,
    };
}
