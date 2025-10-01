# Product Shopping API - Clean Architecture

Backend API for the Product Shopping application built with Express.js, TypeScript, PostgreSQL, and Clean Architecture principles.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Presentation Layer                      │
│              (Controllers, Routes, DTOs)                 │
├─────────────────────────────────────────────────────────┤
│                  Application Layer                       │
│           (Use Cases, Application Services)              │
├─────────────────────────────────────────────────────────┤
│                    Domain Layer                          │
│         (Entities, Value Objects, Interfaces)            │
├─────────────────────────────────────────────────────────┤
│                 Infrastructure Layer                     │
│              (Prisma, Database, External APIs)           │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Tech Stack

- **Runtime:** Node.js 20 LTS
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL (Heroku Postgres)
- **ORM:** Prisma
- **Deployment:** Heroku

## 📋 Prerequisites

- Node.js 20+ installed
- Heroku CLI installed
- Git initialized

## 🔧 Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

The `.env` file is already configured with Heroku PostgreSQL credentials:

```env
DATABASE_URL=postgresql://...
PORT=8080
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

### 3. Build the Project

```bash
npm run build
```

## 🚢 Deploy to Heroku

### 1. Login to Heroku

```bash
heroku login
```

### 2. Add Heroku Remote (if not already added)

```bash
heroku git:remote -a devday-aavn
```

### 3. Deploy

```bash
git add .
git commit -m "Initial commit: Products API with Clean Architecture"
git push heroku main
```

### 4. Run Database Migrations

```bash
heroku run npx prisma db push --app devday-aavn
```

### 5. Seed the Database

```bash
heroku run npx prisma db seed --app devday-aavn
```

### 6. Check Deployment

```bash
heroku logs --tail --app devday-aavn
heroku open --app devday-aavn
```

## 📡 API Endpoints

### Health Check
```
GET /health
```

### Products

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| GET | `/api/products` | Get all products | `isAI`, `category`, `search` |
| GET | `/api/products/:id` | Get product by ID | `isAI` |
| GET | `/api/products/featured` | Get featured products | `isAI` |
| GET | `/api/products/top-rated` | Get top-rated products | `isAI` |

### Query Parameters

- `isAI` (boolean): Return AI-generated products (`true` / `false`)
- `category` (string): Filter by category (`xmas`, `candy`, `monster`, `camping`, `sporty`)
- `search` (string): Search by product name

### Example Requests

```bash
# Get all regular products
curl https://devday-aavn.herokuapp.com/api/products

# Get all AI products
curl https://devday-aavn.herokuapp.com/api/products?isAI=true

# Get products by category
curl https://devday-aavn.herokuapp.com/api/products?category=xmas

# Search products
curl https://devday-aavn.herokuapp.com/api/products?search=santa

# Get featured products
curl https://devday-aavn.herokuapp.com/api/products/featured

# Get product by ID
curl https://devday-aavn.herokuapp.com/api/products/100

# Get AI version of product
curl https://devday-aavn.herokuapp.com/api/products/1100?isAI=true
```

### Response Format

**Success Response:**
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
        "backgroundImg": "/images/xmas-bg/100.png"
      }
    ],
    "total": 1
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product with ID 999 not found"
  }
}
```

## 📁 Project Structure

```
backend-api/
├── src/
│   ├── domain/                      # Domain Layer
│   │   ├── entities/
│   │   │   └── Product.ts
│   │   ├── value-objects/
│   │   │   ├── Money.ts
│   │   │   └── Rating.ts
│   │   ├── repositories/
│   │   │   └── IProductRepository.ts
│   │   └── exceptions/
│   │       ├── DomainException.ts
│   │       └── ProductNotFound.ts
│   │
│   ├── application/                 # Application Layer
│   │   ├── use-cases/
│   │   │   └── product/
│   │   │       ├── GetAllProducts.ts
│   │   │       ├── GetProductById.ts
│   │   │       ├── GetFeaturedProducts.ts
│   │   │       └── SearchProducts.ts
│   │   ├── dtos/
│   │   │   └── ProductDTO.ts
│   │   └── mappers/
│   │       └── ProductMapper.ts
│   │
│   ├── infrastructure/              # Infrastructure Layer
│   │   ├── database/
│   │   │   ├── prisma/
│   │   │   │   └── client.ts
│   │   │   └── repositories/
│   │   │       └── ProductRepository.ts
│   │   └── config/
│   │       └── env.config.ts
│   │
│   ├── presentation/                # Presentation Layer
│   │   ├── http/
│   │   │   ├── controllers/
│   │   │   │   └── ProductController.ts
│   │   │   ├── routes/
│   │   │   │   ├── index.ts
│   │   │   │   └── product.routes.ts
│   │   │   └── middleware/
│   │   │       ├── cors.ts
│   │   │       └── error-handler.ts
│   │   └── responses/
│   │       ├── ApiResponse.ts
│   │       └── ErrorResponse.ts
│   │
│   ├── shared/
│   │   └── utils/
│   │       └── async-handler.ts
│   │
│   └── app.ts                       # Entry point
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── Procfile
└── README.md
```

## 🧪 Testing

### Test on Heroku

After deployment, test the API:

```bash
# Health check
curl https://devday-aavn.herokuapp.com/health

# Get all products
curl https://devday-aavn.herokuapp.com/api/products

# Get product by ID
curl https://devday-aavn.herokuapp.com/api/products/100
```

### Test with Postman/Thunder Client

Import these endpoints:
- Base URL: `https://devday-aavn.herokuapp.com`
- Endpoints: `/api/products`, `/api/products/:id`, `/api/products/featured`

## 📦 Available Scripts

```bash
npm run dev          # Run development server with hot reload
npm run build        # Build for production
npm run start        # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations (local dev only)
npm run prisma:seed      # Seed database
npm run prisma:studio    # Open Prisma Studio
```

## 🔐 Environment Variables

Required environment variables (already configured in `.env`):

```env
NODE_ENV=development
PORT=8080
DATABASE_URL=postgresql://...
CORS_ORIGIN=http://localhost:3000
```

## 🐛 Troubleshooting

### Database Connection Issues

If you see "Can't reach database server":

```bash
# Check Heroku database status
heroku pg:info --app devday-aavn

# Reset database connection pool
heroku restart --app devday-aavn
```

### Migration Issues

```bash
# Force push schema (skip migrations)
heroku run npx prisma db push --app devday-aavn

# Check database tables
heroku run npx prisma db pull --app devday-aavn
```

### View Logs

```bash
# View live logs
heroku logs --tail --app devday-aavn

# View specific number of lines
heroku logs -n 200 --app devday-aavn
```

## 📝 Product Data

The API includes 24 regular products and 24 AI-generated versions (48 total products):

- **Regular Products:** IDs 100-123
- **AI Products:** IDs 1100-1123
- **Categories:** xmas, candy, monster, camping, sporty
- **Featured:** Products with "Season Choice" tag

## 🔗 Heroku App Info

- **App Name:** devday-aavn
- **Git URL:** https://git.heroku.com/devday-aavn.git
- **Database:** PostgreSQL Standard-0

## 🎯 Next Steps

1. Deploy to Heroku: `git push heroku main`
2. Run migrations: `heroku run npx prisma db push --app devday-aavn`
3. Seed database: `heroku run npx prisma db seed --app devday-aavn`
4. Test endpoints
5. Integrate with frontend

## 📄 License

ISC
