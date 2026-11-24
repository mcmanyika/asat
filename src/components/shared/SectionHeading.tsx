import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  light?: boolean;
  action?: React.ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  light = false,
  action,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-4 md:mb-12",
        align === "center" && "items-center text-center",
        action && "md:flex-row md:items-end md:justify-between md:gap-8",
        className,
      )}
    >
      <div className={cn(align === "center" && "max-w-3xl")}>
        {eyebrow ? (
          <p
            className={cn(
              "mb-3 text-xs font-semibold tracking-[0.18em] uppercase",
              light ? "text-accent-cyan" : "text-corporate-blue",
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        <div
          className={cn(
            "mb-4 h-0.5 w-10 bg-accent-cyan",
            align === "center" && "mx-auto",
          )}
        />
        <h2
          className={cn(
            "text-3xl font-bold tracking-tight text-balance sm:text-4xl",
            light ? "text-white" : "text-primary-text",
          )}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              "mt-4 max-w-2xl text-base leading-relaxed sm:text-lg",
              light ? "text-slate-300" : "text-secondary-text",
              align === "center" && "mx-auto",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
