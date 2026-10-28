"use client";

import { useRouter } from "next/navigation";
import TaskForm from "@/components/TaskForm";
import { createTask } from "@/lib/tasks";

export default function NewTask() {
  const router = useRouter();
  return (
    <>
      <h1>New task</h1>
      <TaskForm
        submitLabel="Create task"
        onSubmit={async (input) => {
          await createTask(input);
          router.push("/tasks");
        }}
      />
    </>
  );
}
