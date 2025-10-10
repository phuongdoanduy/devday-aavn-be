# API Documentation - Product Shopping Backend

## 📋 Overview

This document provides a complete reference for all available APIs in the devday-aavn-be backend service.

**Base URL (Development):** `http://localhost:8080`
**Base URL (Production):** `https://your-heroku-app.herokuapp.com`

## 🔗 Quick Links

- [Swagger Documentation](./swagger.yaml) - Import this into Swagger UI or Postman
- [Health Check](#health-check)
- [Products API](#products-api)
- [Cart API](#cart-api)

---

## 🏥 Health Check

### GET `/health`

Check if the API is running and healthy.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 📦 Products API

### 1. Get All Products

**Endpoint:** `GET /api/products`

Get all products with optional filtering.

**Query Parameters:**
- `isAI` (boolean, optional) - Filter AI-generated products
- `category` (string, optional) - Filter by category: `xmas`, `candy`, `monster`, `camping`, `sporty`
- `search` (string, optional) - Search products by name

**Examples:**
```bash
# Get all products
GET /api/products

# Get AI-generated products only
GET /api/products?isAI=true

# Filter by category
GET /api/products?category=xmas

# Search products
GET /api/products?search=globin
```

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 100,
        "name": "Xmas Globin",
        "image": "/images/100.png",
        "price": 3.12,
        "tags": ["xmas", "candy", "queen", "Season Choice"],
        "rating": 4.5,
        "background": "#49B649",
        "backgroundImg": "/images/xmas-bg/100.png",
        "stockQuantity": 50,
        "stockStatus": "IN_STOCK",
        "isAvailable": true,
        "isLowStock": false,
        "isOutOfStock": false
      }
    ],
    "total": 24
  }
}
```

### 2. Get Featured Products

**Endpoint:** `GET /api/products/featured`

Get products marked as "Season Choice" or featured.

**Query Parameters:**
- `isAI` (boolean, optional) - Filter AI-generated products

**Example:**
```bash
GET /api/products/featured?isAI=false
```

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [...],
    "total": 5
  }
}
```

### 3. Get Top-Rated Products

**Endpoint:** `GET /api/products/top-rated`

Get products with rating >= 5.0.

**Query Parameters:**
- `isAI` (boolean, optional) - Filter AI-generated products

**Example:**
```bash
GET /api/products/top-rated
```

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [...],
    "total": 8
  }
}
```

### 4. Get Product by ID

**Endpoint:** `GET /api/products/{id}`

Get a single product by its ID.

**Path Parameters:**
- `id` (integer, required) - Product ID

**Query Parameters:**
- `isAI` (boolean, optional) - Filter AI-generated products

**Example:**
```bash
GET /api/products/100
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 100,
    "name": "Xmas Globin",
    "image": "/images/100.png",
    "price": 3.12,
    "tags": ["xmas", "candy", "queen", "Season Choice"],
    "rating": 4.5,
    "background": "#49B649",
    "backgroundImg": "/images/xmas-bg/100.png",
    "stockQuantity": 50,
    "stockStatus": "IN_STOCK",
    "isAvailable": true,
    "isLowStock": false,
    "isOutOfStock": false
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product with ID 999 not found",
    "details": {}
  }
}
```

---

## 🛒 Cart API

> **Note:** All cart endpoints require a session ID. The session ID is automatically generated and sent via the `x-session-id` header. The middleware handles session management automatically.

### 1. Get Cart Items

**Endpoint:** `GET /api/cart`

Get all items in the current session's cart.

**Headers:**
- `x-session-id` (string, optional) - Session ID (auto-generated if not provided)

**Example:**
```bash
GET /api/cart
Headers: x-session-id: 550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "items": [
      {
        "id": 1,
        "productId": 100,
        "quantity": 2,
        "product": {
          "id": 100,
          "name": "Xmas Globin",
          "price": 3.12,
          "image": "/images/100.png",
          "stockQuantity": 50,
          "stockStatus": "IN_STOCK",
          "isAvailable": true
        },
        "subtotal": 6.24
      }
    ],
    "total": 25.86,
    "itemCount": 6
  }
}
```

### 2. Add Item to Cart

**Endpoint:** `POST /api/cart`

Add a product to the cart or update quantity if already exists.

**Headers:**
- `x-session-id` (string, optional) - Session ID

**Request Body:**
```json
{
  "productId": 100,
  "quantity": 2
}
```

**Validation:**
- `productId` (integer, required) - Must be a positive integer
- `quantity` (integer, required) - Must be between 1 and 100

**Example:**
```bash
POST /api/cart
Headers: x-session-id: 550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{
  "productId": 100,
  "quantity": 2
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "productId": 100,
    "quantity": 2,
    "product": {
      "id": 100,
      "name": "Xmas Globin",
      "price": 3.12,
      "image": "/images/100.png",
      "stockQuantity": 50,
      "stockStatus": "IN_STOCK",
      "isAvailable": true
    },
    "subtotal": 6.24
  },
  "message": "Item added to cart"
}
```

### 3. Update Cart Item Quantity

**Endpoint:** `PUT /api/cart/{productId}`

Update the quantity of a specific product in the cart.

**Path Parameters:**
- `productId` (integer, required) - Product ID to update

**Headers:**
- `x-session-id` (string, optional) - Session ID

**Request Body:**
```json
{
  "quantity": 3
}
```

**Validation:**
- `quantity` (integer, required) - Must be between 1 and 100

**Example:**
```bash
PUT /api/cart/100
Headers: x-session-id: 550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{
  "quantity": 3
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "productId": 100,
    "quantity": 3,
    "product": {
      "id": 100,
      "name": "Xmas Globin",
      "price": 3.12,
      "image": "/images/100.png",
      "stockQuantity": 50,
      "stockStatus": "IN_STOCK",
      "isAvailable": true
    },
    "subtotal": 9.36
  },
  "message": "Cart item updated"
}
```

### 4. Remove Item from Cart

**Endpoint:** `DELETE /api/cart/{productId}`

Remove a specific product from the cart.

**Path Parameters:**
- `productId` (integer, required) - Product ID to remove

**Headers:**
- `x-session-id` (string, optional) - Session ID

**Example:**
```bash
DELETE /api/cart/100
Headers: x-session-id: 550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
{
  "success": true,
  "data": null,
  "message": "Item removed from cart"
}
```

### 5. Clear Cart

**Endpoint:** `DELETE /api/cart`

Remove all items from the cart.

**Headers:**
- `x-session-id` (string, optional) - Session ID

**Example:**
```bash
DELETE /api/cart
Headers: x-session-id: 550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
{
  "success": true,
  "data": null,
  "message": "Cart cleared"
}
```

### 6. Get Cart Total

**Endpoint:** `GET /api/cart/total`

Get the total price and item count for the cart.

**Headers:**
- `x-session-id` (string, optional) - Session ID

**Example:**
```bash
GET /api/cart/total
Headers: x-session-id: 550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 25.86,
    "itemCount": 6
  }
}
```

---

## 🔐 Session Management

The API uses session-based cart tracking:

1. **Auto-generation**: If no `x-session-id` header is provided, the server automatically generates a UUID
2. **Response Header**: The session ID is returned in the `x-session-id` response header
3. **Client Storage**: Frontend should store the session ID (localStorage/cookie) and include it in subsequent requests
4. **Cart Persistence**: All cart operations are tied to the session ID

**Example Flow:**
```javascript
// First request - no session ID
const response1 = await fetch('/api/cart');
const sessionId = response1.headers.get('x-session-id');

// Store session ID
localStorage.setItem('sessionId', sessionId);

// Subsequent requests - include session ID
const response2 = await fetch('/api/cart', {
  headers: {
    'x-session-id': sessionId
  }
});
```

---

## 📊 Data Models

### Product
```typescript
interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  tags: string[];
  rating: number;
  background: string;
  backgroundImg?: string;
  stockQuantity: number;
  stockStatus: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  isAvailable: boolean;
  isLowStock: boolean;
  isOutOfStock: boolean;
}
```

### CartItem
```typescript
interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    stockQuantity: number;
    stockStatus: string;
    isAvailable: boolean;
  };
  subtotal: number;
}
```

### Cart
```typescript
interface Cart {
  sessionId: string;
  items: CartItem[];
  total: number;
  itemCount: number;
}
```

---

## ⚠️ Error Handling

All API endpoints follow a consistent error response format:

### Error Response Structure
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### Common Error Codes

| HTTP Status | Error Code | Description |
|------------|------------|-------------|
| 400 | `VALIDATION_ERROR` | Invalid request data |
| 404 | `PRODUCT_NOT_FOUND` | Product does not exist |
| 404 | `CART_ITEM_NOT_FOUND` | Cart item does not exist |
| 500 | `INTERNAL_SERVER_ERROR` | Unexpected server error |

### Example Error Responses

**Validation Error (400):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": {
      "quantity": "Quantity must be at least 1"
    }
  }
}
```

**Product Not Found (404):**
```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product with ID 999 not found",
    "details": {}
  }
}
```

---

## 🧪 Testing with cURL

### Products

```bash
# Get all products
curl http://localhost:8080/api/products

# Get featured products
curl http://localhost:8080/api/products/featured

# Get product by ID
curl http://localhost:8080/api/products/100

# Search products
curl "http://localhost:8080/api/products?search=globin"
```

### Cart

```bash
# Get cart
curl -H "x-session-id: test-session-123" \
  http://localhost:8080/api/cart

# Add item to cart
curl -X POST \
  -H "Content-Type: application/json" \
  -H "x-session-id: test-session-123" \
  -d '{"productId": 100, "quantity": 2}' \
  http://localhost:8080/api/cart

# Update cart item
curl -X PUT \
  -H "Content-Type: application/json" \
  -H "x-session-id: test-session-123" \
  -d '{"quantity": 3}' \
  http://localhost:8080/api/cart/100

# Remove cart item
curl -X DELETE \
  -H "x-session-id: test-session-123" \
  http://localhost:8080/api/cart/100

# Clear cart
curl -X DELETE \
  -H "x-session-id: test-session-123" \
  http://localhost:8080/api/cart

# Get cart total
curl -H "x-session-id: test-session-123" \
  http://localhost:8080/api/cart/total
```

---

## 📱 Client Integration

### JavaScript/TypeScript (Fetch)

```typescript
// API client configuration
const API_BASE_URL = 'http://localhost:8080';

// Session management
const getSessionId = () => localStorage.getItem('sessionId');
const setSessionId = (id: string) => localStorage.setItem('sessionId', id);

// Generic fetch wrapper
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const sessionId = getSessionId();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(sessionId && { 'x-session-id': sessionId }),
      ...options.headers,
    },
  });

  // Store session ID from response
  const newSessionId = response.headers.get('x-session-id');
  if (newSessionId) {
    setSessionId(newSessionId);
  }

  return response.json();
}

// Example: Get products
const products = await apiRequest('/api/products');

// Example: Add to cart
const cartItem = await apiRequest('/api/cart', {
  method: 'POST',
  body: JSON.stringify({ productId: 100, quantity: 2 }),
});
```

### Swift (iOS)

```swift
import Foundation

struct APIClient {
    static let baseURL = "http://localhost:8080"

    // Session management
    @AppStorage("sessionId") private static var sessionId: String?

    static func request<T: Decodable>(
        endpoint: String,
        method: String = "GET",
        body: Data? = nil
    ) async throws -> T {
        var request = URLRequest(url: URL(string: baseURL + endpoint)!)
        request.httpMethod = method
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        if let sessionId = sessionId {
            request.setValue(sessionId, forHTTPHeaderField: "x-session-id")
        }

        if let body = body {
            request.httpBody = body
        }

        let (data, response) = try await URLSession.shared.data(for: request)

        // Store session ID from response
        if let httpResponse = response as? HTTPURLResponse,
           let newSessionId = httpResponse.value(forHTTPHeaderField: "x-session-id") {
            sessionId = newSessionId
        }

        return try JSONDecoder().decode(T.self, from: data)
    }
}

// Example: Get products
struct ProductsResponse: Codable {
    let success: Bool
    let data: ProductsData

    struct ProductsData: Codable {
        let products: [Product]
        let total: Int
    }
}

let response: ProductsResponse = try await APIClient.request(endpoint: "/api/products")
```

---

## 🔧 Development Setup

### Prerequisites
- Node.js 20 LTS
- PostgreSQL database

### Environment Variables
```env
NODE_ENV=development
PORT=8080
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
CORS_ORIGIN=http://localhost:3000
```

### Run Development Server
```bash
npm run dev
```

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests

---

## 📚 Additional Resources

- **Swagger UI**: Import `swagger.yaml` into [Swagger Editor](https://editor.swagger.io/)
- **Postman**: Import `swagger.yaml` as an OpenAPI 3.0 collection
- **Architecture Guide**: See `backend-clean-architecture-guide.md`
- **Deployment Guide**: See `DEPLOYMENT.md`

---

## 🤝 Support

For issues or questions:
- Check the [README.md](./README.md)
- Review error messages in API responses
- Verify request format matches examples above
