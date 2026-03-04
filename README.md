# ORDERING APPLICATION

A REST API for browsing an ingredient catalog and managing sample request projects. Built with NestJS, TypeORM, and PostgreSQL.

---

## Tech Stack

- **Framework**: NestJS
- **ORM**: TypeORM
- **Database**: PostgreSQL (via Docker)
- **Language**: TypeScript

---

## Getting Started

### 1. Start the database
```bash
docker compose up -d
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment

Copy `.env` and update if needed:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=ingredient_catalog
PORT=3000
```

### 4. Start the app
```bash
npm run start:dev
```

### 5. Run the demo
```bash
POST http://localhost:3000/test/demo
```

This single call seeds the database, demonstrates search and filtering, creates a project, adds products, and submits it.

---

## API Endpoints

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/products/seed` | Seed the catalog from built-in data |
| GET | `/products` | List all products |
| GET | `/products?category=Fruits` | Filter by category |
| GET | `/products?cert=USDA Organic` | Filter by certification |
| GET | `/products?supplier=Harvest Valley Co.` | Filter by supplier |
| GET | `/products?q=smoothie` | Full text search |
| GET | `/products/:id` | Get a single product |

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/projects` | Create a draft project |
| GET | `/projects/:id` | Get project with items |
| POST | `/projects/:id/items` | Add a product to project |
| DELETE | `/projects/:id/items/:productId` | Remove a product |
| POST | `/projects/:id/submit` | Submit project (draft → submitted) |

### Test

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/test/demo` | Full end-to-end demo in one call |

---