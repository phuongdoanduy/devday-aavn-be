-- SQL script for direct database updates
-- Use with: heroku pg:psql < scripts/sql-updates.sql
-- Or connect to Heroku: heroku pg:psql and paste these commands

-- Update stock status for low quantity products
UPDATE "Product"
SET "stockStatus" = 'LOW_STOCK', "updatedAt" = NOW()
WHERE "stockQuantity" <= 10 AND "stockQuantity" > 0;

-- Mark out of stock products
UPDATE "Product"
SET "stockStatus" = 'OUT_OF_STOCK', "updatedAt" = NOW()
WHERE "stockQuantity" = 0;

-- Update specific product
UPDATE "Product"
SET
  "name" = 'Updated Product Name',
  "price" = 99.99,
  "stockQuantity" = 100,
  "updatedAt" = NOW()
WHERE "id" = 1;

-- Bulk update AI products tags
UPDATE "Product"
SET
  "tags" = ARRAY['AI', 'Technology', 'Innovation'],
  "updatedAt" = NOW()
WHERE "isAI" = true;

-- Apply discount to sale items
UPDATE "Product"
SET
  "price" = "price" * 0.8,
  "updatedAt" = NOW()
WHERE 'sale' = ANY("tags");

-- Reset stock status based on quantity
UPDATE "Product"
SET "stockStatus" = CASE
  WHEN "stockQuantity" = 0 THEN 'OUT_OF_STOCK'::\"StockStatus\"
  WHEN "stockQuantity" <= 10 THEN 'LOW_STOCK'::\"StockStatus\"
  ELSE 'IN_STOCK'::\"StockStatus\"
END,
"updatedAt" = NOW();

-- View products to verify updates
SELECT "id", "name", "price", "stockQuantity", "stockStatus"
FROM "Product"
ORDER BY "id"
LIMIT 10;
