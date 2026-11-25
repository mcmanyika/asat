import { formatLabel } from "@/lib/admin/format";

type BreakdownListProps = {
  title: string;
  items: { label: string; count: number }[];
};

export function BreakdownList({ title, items }: BreakdownListProps) {
  const max = Math.max(...items.map((item) => item.count), 1);

  return (
    <div className="border border-border bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-primary-text">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-secondary-text">No data yet.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li key={item.label}>
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
