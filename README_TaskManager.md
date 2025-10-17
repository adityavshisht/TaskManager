# 🧠 TaskManager Backend

A simple **TypeScript + Node.js + Express + Prisma** API for managing **Users** and **Tasks**.

---

## 🚀 Features

✅ Node.js + Express + TypeScript  
✅ PostgreSQL (Docker) + Prisma ORM  
✅ CRUD routes for Users and Tasks  
✅ Request validation with Zod  
✅ Swagger API documentation at `/docs`  
✅ Error handling + input validation  
✅ Seed script for demo data

---

## ⚙️ Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/TaskManager.git
cd TaskManager
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Create environment file

Create a `.env` file in the project root (see `.env.example`):

```
DATABASE_URL=postgresql://appuser:apppass@localhost:5432/appdb?schema=public
PORT=3000
```

### 4️⃣ Run PostgreSQL (Docker)

```bash
docker compose up -d
```

or use your own local Postgres instance.

### 5️⃣ Run migrations

```bash
npx prisma migrate dev --name init
```

### 6️⃣ Seed demo data

```bash
npm run seed
```

### 7️⃣ Start the API

```bash
npm run dev
```

Now open:  
👉 [http://localhost:3000/docs](http://localhost:3000/docs)

---

## 🧩 API Endpoints

| Method | Endpoint | Description |
|---------|-----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/users` | List all users |
| POST | `/api/users` | Create a new user |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |
| GET | `/api/tasks` | List all tasks |
| POST | `/api/tasks` | Create a new task |
| GET | `/api/tasks/:id` | Get task by ID |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| GET | `/api/users/:id/tasks` | List tasks for a user |

---

## 🧰 Tech Stack

- **Node.js** + **TypeScript**
- **Express.js**
- **Prisma ORM**
- **PostgreSQL**
- **Zod** for validation
- **Swagger UI** for API docs
- **Docker** for DB container

---

## 🧑‍💻 Developers

| Role | Member |
|------|---------|
| Backend Engineer | *You (TaskManager Team)* |
| Frontend Engineer | TBD |
| DevOps / Presentation | TBD |

---

## 🏁 Run Summary

```
npm run dev
```
➡️ Starts local API on **http://localhost:3000**  

```
npm run seed
```
➡️ Seeds example data for demo

---

## 📘 License

This project is for **educational use** (LaSalle College — Information Systems).  
Free to use, modify, and share.

---
