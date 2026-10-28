"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import StatusBadge from "@/components/StatusBadge";
import TaskForm from "@/components/TaskForm";
import { deleteTask, getTask, updateTask } from "@/lib/tasks";
import type { Task } from "@/lib/types";

export default function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getTask(id).then(setTask).catch(() => setError("Couldn't load this task."));
  }, [id]);

  async function remove() {
    if (!confirm("Delete this task? This can't be undone.")) return;
    try {
      await deleteTask(id);
      router.push("/tasks");
    } catch {
      setError("Couldn't delete the task.");
    }
  }

  if (error) return <p className="error" role="alert">{error}</p>;
  if (!task) return <p className="muted">Loading task…</p>;

  return (
    <>
      <h1>{task.title} <StatusBadge status={task.status} /></h1>
      <TaskForm
        initial={task}
        submitLabel="Save changes"
        onSubmit={async (input) => {
          await updateTask(id, input);
          router.push("/tasks");
        }}
      />
      <p><button className="danger" onClick={remove}>Delete task</button></p>
    </>
  );
}
