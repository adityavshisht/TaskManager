import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import swaggerUi from "swagger-ui-express";
import { specs } from "./swagger";
import { z } from "zod";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(helmet());
app.use(rateLimit({ windowMs: 60_000, max: 120 }));
app.use(cors());
app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

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

app.get("/health", (_req, res) => res.json({ ok: true }));

app.get("/api/users", async (_req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

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

app.get("/api/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "id must be a number" });

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return res.status(404).json({ error: "not found" });
  res.json(user);
});

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

app.get("/api/tasks", async (_req, res) => {
  const tasks = await prisma.task.findMany({ orderBy: { id: "asc" } });
  res.json(tasks);
});

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

app.get("/api/tasks/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "id must be a number" });

  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) return res.status(404).json({ error: "not found" });
  res.json(task);
});

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

app.get("/api/users/:id/tasks", async (req, res) => {
  const userId = Number(req.params.id);
  if (Number.isNaN(userId)) return res.status(400).json({ error: "id must be a number" });
  const tasks = await prisma.task.findMany({ where: { userId } });
  res.json(tasks);
});

app.use((_req, res) => res.status(404).json({ error: "not found" }));
app.use((err, _req, res, _next) => {
  console.error("[Unhandled Error]", err);
  res.status(500).json({ error: "server error" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API running: http://localhost:${port}`));
