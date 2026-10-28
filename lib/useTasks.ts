"use client";

import { useCallback, useEffect, useState } from "react";
import { listTasks } from "./tasks";
import type { Task } from "./types";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setError("");
    try {
      setTasks(await listTasks());
    } catch {
      setError("Couldn't load tasks. Check that the backend is running on port 3002.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { tasks, setTasks, loading, error, reload };
}
