import { formatLabel, statusTone } from "@/lib/admin/format";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-[4px] border px-2 py-0.5 text-xs font-semibold",
        statusTone(status),
      )}
    >
      {formatLabel(status)}
    </span>
  );
}
