"use client";

import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import { updateTask } from "@/lib/tasks";
import { STATUSES, type Status } from "@/lib/types";
import { useTasks } from "@/lib/useTasks";

export default function StatusBoard() {
  const { tasks, setTasks, loading, error } = useTasks();

  async function move(id: string, status: Status) {
    const prev = tasks;
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status } : t)));
    try {
      await updateTask(id, { status });
    } catch {
      setTasks(prev); // roll back if the backend rejects it
    }
  }

  return (
    <>
      <h1>Status board</h1>
      {error && <p className="error" role="alert">{error}</p>}
      {loading && <p className="muted">Loading tasks…</p>}
      {!loading && !error && tasks.length === 0 && (
        <p className="muted">No tasks yet. <Link href="/tasks/new">Create your first task</Link>.</p>
      )}
      <div className="board">
        {STATUSES.map((col) => {
          const items = tasks.filter((t) => t.status === col.value);
          return (
            <section key={col.value} className="column" aria-label={col.label}>
              <h2>{col.label} <span className="count">{items.length}</span></h2>
              {items.map((t) => (
                <article key={t.id} className="card task">
                  <Link href={`/tasks/${t.id}`} className="task-title">{t.title}</Link>
                  <div className="meta">
                    {t.assignee && <span>{t.assignee}</span>}
                    {t.dueDate && <span>Due {t.dueDate.slice(0, 10)}</span>}
                    {t.priority === "high" && <span className="prio-high">High priority</span>}
                  </div>
                  <label className="sr-only" htmlFor={`s-${t.id}`}>Change status of {t.title}</label>
                  <select id={`s-${t.id}`} value={t.status} onChange={(e) => move(t.id, e.target.value as Status)}>
                    {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </article>
              ))}
            </section>
          );
        })}
      </div>
    </>
  );
}
