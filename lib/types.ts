export const STATUSES = [
  { value: "todo", label: "To do" },
  { value: "in_progress", label: "In progress" },
  { value: "done", label: "Done" },
] as const;

export type Status = (typeof STATUSES)[number]["value"];
export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: Status;
  priority?: Priority;
  assignee?: string;
  dueDate?: string; // ISO date
  createdAt?: string;
}

export type TaskInput = Omit<Task, "id" | "createdAt">;

export const statusLabel = (s: Status) => STATUSES.find((x) => x.value === s)?.label ?? s;
