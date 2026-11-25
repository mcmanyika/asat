import { formatLabel } from "@/lib/admin/format";
import { cn } from "@/lib/utils";

type BreakdownListProps = {
  title: string;
  items: { label: string; count: number }[];
  onOpen?: () => void;
  onItemOpen?: (label: string) => void;
  className?: string;
};

export function BreakdownList({
  title,
  items,
  onOpen,
  onItemOpen,
  className,
}: BreakdownListProps) {
  const max = Math.max(...items.map((item) => item.count), 1);
  const interactive = Boolean(onOpen || onItemOpen);

  return (
    <div
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onClick={onOpen}
      onKeyDown={
        onOpen
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onOpen();
              }
            }
          : undefined
      }
      className={cn(
        "border border-border bg-white p-4 shadow-sm",
        interactive &&
          "cursor-pointer transition hover:border-gold/60 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
        className,
      )}
    >
      <h2 className="text-sm font-semibold text-primary-text">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-secondary-text">No data yet.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li key={item.label}>
              <div
                role={onItemOpen ? "button" : undefined}
                tabIndex={onItemOpen ? 0 : undefined}
                onClick={
                  onItemOpen
                    ? (event) => {
                        event.stopPropagation();
                        onItemOpen(item.label);
                      }
                    : undefined
                }
                onKeyDown={
                  onItemOpen
                    ? (event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          event.stopPropagation();
                          onItemOpen(item.label);
                        }
                      }
                    : undefined
                }
                className={cn(
                  onItemOpen &&
                    "cursor-pointer rounded-sm outline-none hover:opacity-80 focus-visible:ring-2 focus-visible:ring-gold/40",
                )}
              >
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-secondary-text">
                    {formatLabel(item.label)}
                  </span>
                  <span className="font-semibold text-primary-text">
                    {item.count}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full bg-gold"
                    style={{ width: `${(item.count / max) * 100}%` }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
