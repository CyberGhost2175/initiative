import type { Status } from "@/lib/types";
import { STATUS_META } from "@/lib/data";

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`badge ${STATUS_META[status].cls}`}>{status}</span>
  );
}
