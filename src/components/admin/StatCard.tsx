import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  onClick?: () => void;
  className?: string;
};

export function StatCard({
  label,
  value,
  hint,
  onClick,
  className,
}: StatCardProps) {
  const content = (
    <>
      <p className="text-xs font-semibold tracking-wide text-secondary-text uppercase">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold text-primary-text">{value}</p>
      {hint ? (
        <p className="mt-1 text-xs text-secondary-text">{hint}</p>
      ) : null}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "cursor-pointer border border-border bg-white p-4 text-left shadow-sm transition hover:border-gold/60 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
          className,
        )}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      className={cn("border border-border bg-white p-4 shadow-sm", className)}
    >
      {content}
    </div>
  );
}
