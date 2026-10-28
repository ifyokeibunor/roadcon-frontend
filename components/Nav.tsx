"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BackendStatus from "./BackendStatus";

const links = [
  { href: "/", label: "Status board" },
  { href: "/tasks", label: "All tasks" },
  { href: "/api-test", label: "API test" },
];

export default function Nav() {
  const path = usePathname();
  return (
    <nav className="nav">
      <Link href="/" className="brand">Task Tracker</Link>
      <div className="nav-links">
        {links.map((l) => (
          <Link key={l.href} href={l.href} aria-current={path === l.href ? "page" : undefined}>
            {l.label}
          </Link>
        ))}
      </div>
      <Link href="/tasks/new" className="btn">New task</Link>
      <BackendStatus />
    </nav>
  );
}
