import { Status, statusLabel } from "@/lib/types";

export default function StatusBadge({ status }: { status: Status }) {
  return <span className={`badge badge-${status}`}>{statusLabel(status)}</span>;
}
