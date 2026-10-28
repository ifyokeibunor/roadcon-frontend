"use client";

import { useState } from "react";
import { api, ApiError } from "@/lib/api";

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;

export default function RequestConsole() {
  const [method, setMethod] = useState<(typeof METHODS)[number]>("GET");
  const [path, setPath] = useState("/");
  const [body, setBody] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");
    try {
      const json = body.trim() ? JSON.parse(body) : undefined;
      const data = await api(path, { method, json });
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        setResult(typeof err.body === "string" ? err.body : JSON.stringify(err.body, null, 2));
      } else if (err instanceof SyntaxError) {
        setError("The request body is not valid JSON.");
      } else {
        setError("Could not reach the backend. Check that it is running on port 3002.");
      }
    } finally {
      setLoading(false);
    }
  }

  const hasBody = method !== "GET" && method !== "DELETE";

  return (
    <form onSubmit={send} className="console">
      <div className="row">
        <label className="sr-only" htmlFor="method">Method</label>
        <select id="method" value={method} onChange={(e) => setMethod(e.target.value as typeof method)}>
          {METHODS.map((m) => <option key={m}>{m}</option>)}
        </select>
        <label className="sr-only" htmlFor="path">Path</label>
        <input id="path" value={path} onChange={(e) => setPath(e.target.value)} placeholder="/users" spellCheck={false} />
        <button type="submit" disabled={loading}>{loading ? "Sending…" : "Send request"}</button>
      </div>

      {hasBody && (
        <>
          <label htmlFor="body">JSON body</label>
          <textarea id="body" rows={5} value={body} onChange={(e) => setBody(e.target.value)} placeholder='{ "name": "Ada" }' spellCheck={false} />
        </>
      )}

      {error && <p className="error">{error}</p>}
      {result && <pre className="output">{result}</pre>}
    </form>
  );
}
