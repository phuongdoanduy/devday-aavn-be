# Database Update Scripts

Scripts for manually updating the Product table in the database, both locally and on Heroku.

## Available Scripts

### 1. Pre-built Update Script (`update-products.ts`)

Contains common update patterns:
- Update specific product by ID
- Bulk update products by condition
- Update stock status based on quantity
- Apply discounts to tagged products

**Usage:**
```bash
# Local
npm run update:products

# Heroku
heroku run npm run update:products
```

### 2. Custom Update Script (`custom-update.ts`)

Empty template for your custom update logic. Edit this file with your specific requirements.

**Usage:**
```bash
# Local
npm run update:custom

# Heroku
heroku run npm run update:custom
```

### 3. JSON-based Update Script (`update-from-json.ts`)

Update products from a JSON file. Great for batch updates.

**JSON Format:**
```json
[
  {
    "id": 1,
    "data": {
      "name": "Updated Product Name",
      "price": 99.99,
      "stockQuantity": 50,
      "stockStatus": "IN_STOCK"
    }
  },
  {
    "id": 2,
    "data": {
      "tags": ["sale", "featured"],
      "price": 149.99
    }
  }
]
```

**Usage:**
```bash
# Local
npm run update:json path/to/updates.json

# Heroku
# First, upload your JSON file, then run:
heroku run npm run update:json updates.json
```

## Running on Heroku

### Method 1: Run Directly (Recommended)

```bash
# Run any script on Heroku
heroku run npm run update:products

# Or with environment variables
heroku run npm run update:custom --app your-app-name
```

### Method 2: Using Heroku Postgres CLI

For direct SQL updates (advanced):

```bash
# Connect to Heroku Postgres
heroku pg:psql

# Run SQL commands
UPDATE "Product" SET "stockStatus" = 'LOW_STOCK' WHERE "stockQuantity" <= 10;
```

### Method 3: One-off Dyno

```bash
# Deploy and run on Heroku
git push heroku main
heroku run npm run update:products
```

## Environment Setup

### Local Development

1. Make sure your `.env` file has the correct `DATABASE_URL`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
```

2. Run the script:
```bash
npm run update:products
```

### Heroku Production

1. Get your Heroku database URL:
```bash
heroku config:get DATABASE_URL
```

2. Run against Heroku database from local (optional):
```bash
DATABASE_URL="<heroku-database-url>" npm run update:products
```

3. Or run directly on Heroku:
```bash
heroku run npm run update:products
```

## Common Update Patterns

### Update Single Product
```typescript
await prisma.product.update({
  where: { id: 1 },
  data: {
    name: 'New Name',
    price: 99.99,
  },
});
```

### Bulk Update by Condition
```typescript
await prisma.product.updateMany({
  where: {
    stockQuantity: { lte: 10 },
  },
  data: {
    stockStatus: StockStatus.LOW_STOCK,
  },
});
```

### Update with Tags
```typescript
await prisma.product.updateMany({
  where: {
    tags: { has: 'sale' },
  },
  data: {
    price: { multiply: 0.8 }, // 20% off
  },
});
```

### Update Multiple Fields
```typescript
await prisma.product.update({
  where: { id: 1 },
  data: {
    name: 'Updated Name',
    price: 149.99,
    stockQuantity: 100,
    stockStatus: StockStatus.IN_STOCK,
    tags: ['featured', 'popular'],
    isAI: true,
  },
});
```

## Safety Tips

1. **Test Locally First**: Always test your update script against a local database before running on production

2. **Backup Database**: Before major updates on Heroku:
```bash
heroku pg:backups:capture
```

3. **Dry Run**: Add a `--dry-run` flag to preview changes without committing:
```typescript
// In your script
const DRY_RUN = process.argv.includes('--dry-run');

if (DRY_RUN) {
  console.log('DRY RUN - Changes will not be saved');
  // Use transactions and rollback
}
```

4. **Use Transactions**: For multiple related updates:
```typescript
await prisma.$transaction(async (tx) => {
  await tx.product.update({ ... });
  await tx.product.updateMany({ ... });
});
```

## Troubleshooting

### Connection Issues
```bash
# Check Heroku database connection
heroku pg:info

# Check app logs
heroku logs --tail
```

### Permission Errors
```bash
# Ensure you're logged in to Heroku
heroku login

# Check app access
heroku apps:info
```

### Prisma Client Issues
```bash
# Regenerate Prisma client
npm run prisma:generate

# On Heroku, this happens automatically during build
```

## Examples

### Example 1: Mark Low Stock Products
```bash
# Edit scripts/custom-update.ts with:
const result = await prisma.product.updateMany({
  where: { stockQuantity: { lt: 10 } },
  data: { stockStatus: 'LOW_STOCK' },
});

# Run it
npm run update:custom
```

### Example 2: Update from JSON file
```bash
# Create updates.json
echo '[{"id": 1, "data": {"price": 99.99}}]' > updates.json

# Run update
npm run update:json updates.json
```

### Example 3: Bulk Price Update
```bash
# Edit scripts/custom-update.ts
const result = await prisma.product.updateMany({
  where: { isAI: true },
  data: { price: { multiply: 1.1 } }, // 10% increase
});
```

## Additional Resources

- [Prisma Update Documentation](https://www.prisma.io/docs/concepts/components/prisma-client/crud#update)
- [Heroku Run Documentation](https://devcenter.heroku.com/articles/heroku-cli-commands#heroku-run)
- [Heroku Postgres Documentation](https://devcenter.heroku.com/articles/heroku-postgresql)
