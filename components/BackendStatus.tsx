"use client";

import { useEffect, useState } from "react";

type State = "checking" | "up" | "down";

export default function BackendStatus() {
  const [state, setState] = useState<State>("checking");

  useEffect(() => {
    let alive = true;
    const check = async () => {
      try {
        // Any response (even 404) means the backend is reachable.
        const res = await fetch("/api/backend/", { cache: "no-store" });
        if (alive) setState(res.status >= 500 ? "down" : "up");
      } catch {
        if (alive) setState("down");
      }
    };
    check();
    const id = setInterval(check, 10000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  const label = { checking: "Checking backend…", up: "Backend connected", down: "Backend unreachable" }[state];
  return (
    <span className={`status status-${state}`} role="status">
      <span className="dot" aria-hidden />
      {label}
    </span>
  );
}
