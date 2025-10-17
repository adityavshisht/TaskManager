import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import swaggerUi from "swagger-ui-express";
import { specs } from "./swagger";
import { z } from "zod";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

/* ==============================
   ZOD SCHEMAS
============================== */
// Users
const UserCreateSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1, "name is required"),
});
const UserUpdateSchema = z
  .object({
    email: z.string().email().optional(),
    name: z.string().min(1).optional(),
  })
  .refine((d) => d.email || d.name, { message: "send email or name" });

// Tasks
const TaskCreateSchema = z.object({
  title: z.string().min(1, "title is required"),
  description: z.string().optional(),
  userId: z.number().int().positive(),
});
const TaskUpdateSchema = z
  .object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    isDone: z.boolean().optional(),
  })
  .refine((o) => Object.keys(o).length > 0, { message: "send at least one field" });

/* ==============================
   ROUTES
============================== */

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check
 *     responses:
 *       200:
 *         description: OK
 */
app.get("/health", (_req, res) => res.json({ ok: true }));

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: List users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
app.get("/api/users", async (_req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

/**
 * @openapi
 * /api/users:
 *   post:
 *     summary: Create user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreate'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400: { description: Bad request }
 */
app.post("/api/users", async (req, res) => {
  const parsed = UserCreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.format());

  try {
    const user = await prisma.user.create({ data: parsed.data });
    res.status(201).json(user);
  } catch {
    res.status(400).json({ error: "could not create user (maybe email already used)" });
  }
});

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Get user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: OK
 *       400: { description: Bad request }
 *       404: { description: Not found }
 */
app.get("/api/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "id must be a number" });

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return res.status(404).json({ error: "not found" });
  res.json(user);
});

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string, format: email }
 *               name: { type: string }
 *     responses:
 *       200: { description: Updated }
 *       400: { description: Bad request }
 */
app.put("/api/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "id must be a number" });

  const parsed = UserUpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.format());

  try {
    const user = await prisma.user.update({ where: { id }, data: parsed.data });
    res.json(user);
  } catch {
    res.status(400).json({ error: "update failed (maybe duplicate email or wrong id)" });
  }
});

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Deleted }
 *       404: { description: Not found }
 */
app.delete("/api/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "id must be a number" });

  try {
    await prisma.user.delete({ where: { id } });
    res.status(204).end();
  } catch {
    res.status(404).json({ error: "not found" });
  }
});

/* ==============================
   TASK ROUTES
============================== */
/**
 * @openapi
 * /api/tasks:
 *   get:
 *     summary: List tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: OK
 */
app.get("/api/tasks", async (_req, res) => {
  const tasks = await prisma.task.findMany({ orderBy: { id: "asc" } });
  res.json(tasks);
});

/**
 * @openapi
 * /api/tasks:
 *   post:
 *     summary: Create task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskCreate'
 *     responses:
 *       201: { description: Created }
 *       400: { description: Bad request }
 */
app.post("/api/tasks", async (req, res) => {
  const parsed = TaskCreateSchema.safeParse({
    ...req.body,
    userId: Number(req.body?.userId),
  });
  if (!parsed.success) return res.status(400).json(parsed.error.format());

  try {
    const task = await prisma.task.create({ data: parsed.data });
    res.status(201).json(task);
  } catch {
    res.status(400).json({ error: "could not create task (check userId)" });
  }
});

/**
 * @openapi
 * /api/tasks/{id}:
 *   get:
 *     summary: Get task by id
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 *       404: { description: Not found }
 */
app.get("/api/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "id must be a number" });

  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) return res.status(404).json({ error: "not found" });
  res.json(task);
});

/**
 * @openapi
 * /api/tasks/{id}:
 *   put:
 *     summary: Update task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskUpdate'
 *     responses:
 *       200: { description: Updated }
 *       400: { description: Bad request }
 *       404: { description: Not found }
 */
app.put("/api/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "id must be a number" });

  const parsed = TaskUpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.format());

  try {
    const task = await prisma.task.update({ where: { id }, data: parsed.data });
    res.json(task);
  } catch {
    res.status(404).json({ error: "not found" });
  }
});

/**
 * @openapi
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Deleted }
 *       404: { description: Not found }
 */
app.delete("/api/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "id must be a number" });

  try {
    await prisma.task.delete({ where: { id } });
    res.status(204).end();
  } catch {
    res.status(404).json({ error: "not found" });
  }
});

/**
 * @openapi
 * /api/users/{id}/tasks:
 *   get:
 *     summary: List tasks for a user
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: OK }
 */
app.get("/api/users/:id/tasks", async (req, res) => {
  const userId = Number(req.params.id);
  if (Number.isNaN(userId)) return res.status(400).json({ error: "id must be a number" });
  const tasks = await prisma.task.findMany({ where: { userId } });
  res.json(tasks);
});

/* ==============================
   ERROR HANDLERS
============================== */
app.use((_req, res) => res.status(404).json({ error: "not found" }));
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("[Unhandled Error]", err);
  res.status(500).json({ error: "server error" });
});

/* ==============================
   START SERVER
============================== */
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API running: http://localhost:${port}`));
