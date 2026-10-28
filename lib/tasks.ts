import { del, get, post, put } from "./api";
import type { Status, Task, TaskInput } from "./types";

/**
 * Backend contract assumed here (edit this file if yours differs):
 *   GET    /tasks        -> Task[]  (or { data: Task[] } / { tasks: Task[] })
 *   GET    /tasks/:id    -> Task
 *   POST   /tasks        -> Task
 *   PUT    /tasks/:id    -> Task
 *   DELETE /tasks/:id
 */
const BASE = "/tasks";

function normalizeStatus(raw: unknown): Status {
  const s = String(raw ?? "").toLowerCase().replace(/[\s-]+/g, "_");
  if (["done", "completed", "complete", "closed"].includes(s)) return "done";
  if (["in_progress", "inprogress", "doing", "started", "active"].includes(s)) return "in_progress";
  return "todo";
}

// Accepts id/_id and tolerates a few common field names.
function normalize(raw: any): Task {
  return {
    id: String(raw.id ?? raw._id),
    title: raw.title ?? raw.name ?? "Untitled task",
    description: raw.description ?? undefined,
    status: normalizeStatus(raw.status),
    priority: raw.priority ?? undefined,
    assignee: raw.assignee ?? raw.assignedTo ?? undefined,
    dueDate: raw.dueDate ?? raw.due_date ?? undefined,
    createdAt: raw.createdAt ?? raw.created_at ?? undefined,
  };
}

const unwrapList = (r: any): any[] => (Array.isArray(r) ? r : r?.data ?? r?.tasks ?? []);
const unwrapOne = (r: any) => r?.data ?? r?.task ?? r;

export const listTasks = async () => unwrapList(await get<any>(BASE)).map(normalize);
export const getTask = async (id: string) => normalize(unwrapOne(await get<any>(`${BASE}/${id}`)));
export const createTask = async (t: TaskInput) => normalize(unwrapOne(await post<any>(BASE, t)));
export const updateTask = async (id: string, t: Partial<TaskInput>) =>
  normalize(unwrapOne(await put<any>(`${BASE}/${id}`, t)));
export const deleteTask = (id: string) => del(`${BASE}/${id}`);
