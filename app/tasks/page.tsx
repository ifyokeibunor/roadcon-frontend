"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import StatusBadge from "@/components/StatusBadge";
import { STATUSES, type Status } from "@/lib/types";
import { useTasks } from "@/lib/useTasks";

export default function AllTasks() {
  const { tasks, loading, error } = useTasks();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<Status | "all">("all");

  const shown = useMemo(
    () =>
      tasks.filter(
        (t) =>
          (status === "all" || t.status === status) &&
          `${t.title} ${t.assignee ?? ""}`.toLowerCase().includes(q.toLowerCase())
      ),
    [tasks, q, status]
  );

  return (
    <>
      <h1>All tasks</h1>
      <div className="filters">
        <input type="search" placeholder="Search title or assignee" aria-label="Search tasks" value={q} onChange={(e) => setQ(e.target.value)} />
        <select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value as Status | "all")}>
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>
      {error && <p className="error" role="alert">{error}</p>}
      {loading && <p className="muted">Loading tasks…</p>}
      {!loading && !error && (
        shown.length === 0 ? (
          <p className="muted">No tasks match. <Link href="/tasks/new">Create a task</Link>.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Title</th><th>Status</th><th>Priority</th><th>Assignee</th><th>Due</th></tr>
              </thead>
              <tbody>
                {shown.map((t) => (
                  <tr key={t.id}>
                    <td><Link href={`/tasks/${t.id}`}>{t.title}</Link></td>
                    <td><StatusBadge status={t.status} /></td>
                    <td>{t.priority ?? "–"}</td>
                    <td>{t.assignee ?? "–"}</td>
                    <td>{t.dueDate?.slice(0, 10) ?? "–"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </>
  );
}
