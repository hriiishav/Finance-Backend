# Finance Data Processing and Access Control Backend

A robust backend service for a finance dashboard system emphasizing clean architecture, Role-Based Access Control (RBAC), and pure data aggregations.

## 🚀 Tech Stack

*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Language:** TypeScript
*   **Database:** SQLite (Embedded, no separate server needed)
*   **Validation:** Zod
*   **Authentication:** JWT (JSON Web Tokens)
*   **API Documentation:** Swagger UI

## ✨ Key Features

1.  **Strict Role-Based Access Control (RBAC)**: Distinct permissions for `VIEWER`, `ANALYST`, and `ADMIN`.
2.  **Financial Records Management**: Full CRUD operations with built-in pagination, type filtering (Income/Expense), and category filtering.
3.  **Aggregated Dashboard API**: Natively calculated totals, net balance, and categorical summaries handled directly by database aggregations.
4.  **Schema Validation**: All input payloads are strictly validated using Zod, ensuring malformed requests are caught at the boundary.
5.  **Interactive Local Documentation**: Fully integrated Swagger UI to test and interact with the endpoints.

## 📦 Setup & Installation

Follow these steps to get the project running locally within minutes. Prerequisites: Node.js (v18+ recommended).

**1. Install Dependencies**
```bash
npm install
```

**2. Seed the Database**
Automatically initializes the SQLite database and populates it with test users and dummy financial records.
```bash
npm run seed
```

**3. Start the Development Server**
```bash
npm run dev
```
The server will start at `http://localhost:3000`.

## 📚 API Documentation (Swagger)

Once the server is running, you can explore and test all APIs interactively by visiting:

👉 **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

### Test Accounts

The seed script automatically provisions the following accounts:
*   **Admin:** `username: admin` | `password: admin123` (Full Access)
*   **Analyst:** `username: analyst` | `password: analyst123` (View Records & Summaries)
*   **Viewer:** `username: viewer` | `password: viewer123` (View Records Only)

## 🏗️ Architecture & Trade-offs

*   **Express + TypeScript over Opinionated Frameworks**: Chosen to explicitly demonstrate the ability to construct a modular, separated architecture (Routes -> Controllers -> Repositories) from scratch without relying on a rigid framework like NestJS.
*   **Raw SQL over ORMs**: Interacting with SQLite natively avoids "black-box" magic and proves a core understanding of relational databases, schema definition, and aggregations. SQLite was chosen to eliminate Docker or separate database installations for ease of reviewing.
*   **Layered Separation of Concerns**: Controllers only handle HTTP logic (requests/responses) and Middlewares handle Auth/Validation. All database logic lives strictly in the `src/repositories/` folder.
*   **Stateless JWTs**: Chosen to optimize performance. Roles are securely embedded into the payload, meaning the backend doesn't need to ping the database on every protected endpoint just to verify if a user has access rights.
