type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
};

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="border border-border bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold tracking-wide text-secondary-text uppercase">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold text-primary-text">{value}</p>
      {hint ? (
        <p className="mt-1 text-xs text-secondary-text">{hint}</p>
      ) : null}
    </div>
  );
}
