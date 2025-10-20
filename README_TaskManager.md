# 🧠 TaskManager — Full Stack Web Application

A full-stack **Task Management System** built with  
**Node.js (Express + TypeScript)**, **PostgreSQL (Prisma ORM)**, and a modern **Frontend UI** powered by **HTML, CSS, and JavaScript**.

---

## 📋 Overview

The **TaskManager** application allows users to:
- Create, update, and delete **tasks**
- Assign tasks to specific **users**
- Filter between **open** and **completed** tasks
- Interact with a live **REST API** through a responsive web interface

---

## 🚀 Features

✅ **Backend** (Node.js + Express + TypeScript)  
✅ **Database** using PostgreSQL (Docker + Prisma ORM)  
✅ **Frontend UI** with modern Business Theme  
✅ **Validation** using Zod  
✅ **Interactive API Docs** with Swagger at `/docs`  
✅ **Docker Compose** setup for API, Database, and Frontend  
✅ **Seed script** for quick demo data  
✅ **CORS enabled** for smooth frontend-backend integration  

---

## 🧱 Architecture

```
TaskManager/
│
├── src/                  # Backend source (Express + Prisma)
│   ├── server.ts
│   └── swagger.ts
│
├── prisma/               # Database schema & migrations
│   └── schema.prisma
│
├── frontend/             # Frontend UI (HTML, CSS, JS)
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── docker-compose.yml    # Runs DB + API + Frontend together
├── Dockerfile            # Backend Docker image
├── package.json          # Backend dependencies
└── README.md
```

---

## ⚙️ Setup Instructions

### 🧩 1. Clone the Repository

```bash
git clone https://github.com/yourusername/TaskManager.git
cd TaskManager
```

### 🐳 2. Run with Docker (Recommended)

```bash
docker compose up -d --build
```

This starts:
- **db** → PostgreSQL database  
- **api** → Express backend on port `3000`  
- **frontend** → Web UI on port `8080`

Then visit:  
🔹 Frontend → [http://localhost:8080](http://localhost:8080)  
🔹 API Docs → [http://localhost:3000/docs](http://localhost:3000)

---

### 🧠 3. Manual Local Setup (Optional)

If you prefer running without Docker:

```bash
npm install
docker compose up -d db
npx prisma migrate dev --name init
npm run seed
npm run dev
```

Now open [http://localhost:3000](http://localhost:3000)

---

## 🧩 API Endpoints

| Method | Endpoint | Description |
|---------|-----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/users` | List all users |
| POST | `/api/users` | Create a user |
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

## 🎨 Frontend Features

📌 Built with HTML, CSS, and Vanilla JavaScript  
📌 Styled using a **professional Business Theme**  
📌 Communicates with backend using Fetch API  
📌 Filters: *All / Open / Done*  
📌 Real-time updates without page reloads  
📌 Auto-creates a demo user for testing

---

## 🧰 Tech Stack

**Frontend:**  
- HTML5, CSS3 (Business Theme)  
- Vanilla JavaScript (Fetch API, async/await)

**Backend:**  
- Node.js + Express  
- TypeScript  
- Prisma ORM  
- PostgreSQL (Docker)

**Other Tools:**  
- Zod (validation)  
- Swagger (API docs)  
- Docker Compose  
- Nodemon, ts-node for dev

---

## 🧑‍💻 Developers

| Role | Member |
|------|---------|
| Backend Engineer | *You* |
| Frontend Engineer | *Teammate* |
| DevOps / Presentation | *Teammate* |

---

## 📸 Screenshots

| Preview | Description |
|----------|--------------|
| 🖼️ | **Home Interface:** Add and view tasks in a clean layout |
| 🖼️ | **Task Added:** Instantly reflects new tasks using live API calls |
| 🖼️ | **Task Filtering:** Toggle between Open and Done views |
| 🖼️ | **Swagger Docs:** Self-documented API endpoints |

*(These images are also included in the PowerPoint presentation.)*

---

## 🏁 Commands Summary

```bash
npm run dev      # Start local API server
npm run build    # Compile TypeScript
npm run seed     # Seed demo data
docker compose up -d  # Run full stack
```

---

## 🧾 License

This project was developed for **LaSalle College — Information Systems (420-BD2-AS / Web Client Development)**  
© 2025 — All rights reserved for educational use only.
