"use client";

import { useState } from "react";
import { STATUSES, type Priority, type Status, type Task, type TaskInput } from "@/lib/types";

export default function TaskForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: Partial<Task>;
  submitLabel: string;
  onSubmit: (t: TaskInput) => Promise<void>;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [status, setStatus] = useState<Status>(initial?.status ?? "todo");
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? "medium");
  const [assignee, setAssignee] = useState(initial?.assignee ?? "");
  const [dueDate, setDueDate] = useState(initial?.dueDate?.slice(0, 10) ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return setError("Enter a title for the task.");
    setSaving(true);
    setError("");
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        assignee: assignee.trim() || undefined,
        dueDate: dueDate || undefined,
      });
    } catch {
      setError("Couldn't save the task. Check the backend and try again.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="card form">
      <label>Title
        <input value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
      </label>
      <label>Description
        <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      <div className="grid-2">
        <label>Status
          <select value={status} onChange={(e) => setStatus(e.target.value as Status)}>
            {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </label>
        <label>Priority
          <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
        <label>Assignee
          <input value={assignee} onChange={(e) => setAssignee(e.target.value)} />
        </label>
        <label>Due date
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </label>
      </div>
      {error && <p className="error" role="alert">{error}</p>}
      <div><button type="submit" disabled={saving}>{saving ? "Saving…" : submitLabel}</button></div>
    </form>
  );
}
