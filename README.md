# Food Ordering Application (Spring Boot + Angular + PostgreSQL)

Beginner-friendly, production-style demo app:
- Browse foods
- View food details
- Add/remove/update cart items
- See total price live
- Place an order (no payment gateway)

---

## Project Structure

```
Food Project/
  backend/   (Spring Boot)
  frontend/  (Angular)
  db/        (PostgreSQL SQL scripts)
```

---

## Database (PostgreSQL)

1. Create DB:

```sql
CREATE DATABASE food_app;
```

2. Run schema + seed:
- `db/schema.sql`
- `db/seed.sql`

> Note: Backend also seeds sample foods automatically on first run if the `foods` table is empty.

---

## Backend (Spring Boot)

### Prerequisites
- Java 17+
- Maven
- PostgreSQL running on `localhost:5432`

### Configure DB
Edit `backend/src/main/resources/application.yml`:
- `spring.datasource.url`
- `spring.datasource.username`
- `spring.datasource.password`

### Run
From `Food Project/backend`:

```bash
mvn spring-boot:run
```

Backend runs at `http://localhost:8080`.

### CORS
CORS is enabled for Angular dev server:
- `http://localhost:4200`

---

## Frontend (Angular)

### Prerequisites
- Node.js 18+ recommended
- Angular CLI (optional, but recommended)

### Install & Run
From `Food Project/frontend`:

```bash
npm install
npm start
```

Frontend runs at `http://localhost:4200`.

---

## API Documentation (Summary)

Base URL: `http://localhost:8080/api`

### Foods CRUD

#### 1) Get all foods
`GET /foods`

Response (200):
```json
[
  {
    "id": 1,
    "name": "Tomato Pickle",
    "category": "Pickles",
    "description": "Spicy, tangy tomato pickle made with traditional spices.",
    "price": 80.00,
    "availableQuantity": 50,
    "imageUrl": "https://..."
  }
]
```

#### 2) Get food by id
`GET /foods/{id}`

Response (200):
```json
{
  "id": 1,
  "name": "Tomato Pickle",
  "category": "Pickles",
  "description": "Spicy, tangy tomato pickle made with traditional spices.",
  "price": 80.00,
  "availableQuantity": 50,
  "imageUrl": "https://..."
}
```

If not found (404):
```json
{
  "timestamp": "2026-01-27T10:15:30.123+00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Food not found: id=999",
  "path": "/api/foods/999"
}
```

#### 3) Create food
`POST /foods`

Request:
```json
{
  "name": "Mango Pickle",
  "category": "Pickles",
  "description": "Traditional mango pickle.",
  "price": 90.00,
  "availableQuantity": 40,
  "imageUrl": "https://..."
}
```

Response (201):
```json
{
  "id": 4,
  "name": "Mango Pickle",
  "category": "Pickles",
  "description": "Traditional mango pickle.",
  "price": 90.00,
  "availableQuantity": 40,
  "imageUrl": "https://..."
}
```

#### 4) Update food
`PUT /foods/{id}`

Request: same as create

Response (200): updated `FoodResponse`

#### 5) Delete food
`DELETE /foods/{id}`

Response: 204 No Content

### Orders

#### Get order by id
`GET /orders/{id}`

Response (200): same shape as create order response (`OrderResponse`).

#### Create order
`POST /orders`

Request:
```json
{
  "items": [
    { "foodId": 1, "quantity": 2 },
    { "foodId": 3, "quantity": 1 }
  ]
}
```

Response (201):
```json
{
  "id": 10,
  "createdAt": "2026-01-27T10:20:40.000+00:00",
  "totalAmount": 310.00,
  "items": [
    {
      "id": 100,
      "foodId": 1,
      "foodName": "Tomato Pickle",
      "quantity": 2,
      "unitPrice": 80.00,
      "lineTotal": 160.00
    }
  ]
}
```

Notes:
- Stock (`availableQuantity`) is reduced when placing an order.
- If requested quantity exceeds available stock, API returns 400 with a friendly message.

---

## Backend Code Notes (Layered Architecture)

- **Controller**: `com.foodapp.food.controller.FoodController`, `com.foodapp.order.controller.OrderController`
- **Service**: `FoodService/FoodServiceImpl`, `OrderService/OrderServiceImpl`
- **Repository**: `FoodRepository`, `OrderRepository`
- **Entity**: `Food`, `Order`, `OrderItem`
- **DTO**: `FoodCreateUpdateRequest`, `FoodResponse`, `OrderCreateRequest`, `OrderResponse`
- **Exception handling**: `GlobalExceptionHandler` with `ApiErrorResponse`

