"use client";

import { cn } from "@/lib/utils";

type SpeedometerGaugeProps = {
  label: string;
  value: number;
  max: number;
  hint?: string;
  displayValue?: string | number;
  /** navy | gold | cyan | emerald */
  tone?: "navy" | "gold" | "cyan" | "emerald";
  className?: string;
};

const toneStroke: Record<NonNullable<SpeedometerGaugeProps["tone"]>, string> = {
  navy: "#0B1628",
  gold: "#C4A35A",
  cyan: "#2BB8C8",
  emerald: "#059669",
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function arcPath(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polar(cx, cy, r, endAngle);
  const end = polar(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

export function SpeedometerGauge({
  label,
  value,
  max,
  hint,
  displayValue,
  tone = "navy",
  className,
}: SpeedometerGaugeProps) {
  const safeMax = max > 0 ? max : 1;
  const ratio = clamp(value / safeMax, 0, 1);
  const startAngle = -110;
  const endAngle = 110;
  const sweep = endAngle - startAngle;
  const valueAngle = startAngle + sweep * ratio;
  const cx = 80;
  const cy = 78;
  const radius = 56;
  const needle = polar(cx, cy, radius - 10, valueAngle);
  const shown = displayValue ?? value;

  return (
    <div
      className={cn(
        "flex flex-col items-center border border-border bg-white p-4 shadow-sm",
        className,
      )}
    >
      <p className="self-start text-xs font-semibold tracking-wide text-secondary-text uppercase">
        {label}
      </p>
      <svg
        viewBox="0 0 160 110"
        className="mt-1 h-[120px] w-full max-w-[200px]"
        role="img"
        aria-label={`${label}: ${shown}`}
      >
        <path
          d={arcPath(cx, cy, radius, startAngle, endAngle)}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d={arcPath(cx, cy, radius, startAngle, valueAngle)}
          fill="none"
          stroke={toneStroke[tone]}
          strokeWidth="12"
          strokeLinecap="round"
        />
        <line
          x1={cx}
          y1={cy}
          x2={needle.x}
          y2={needle.y}
          stroke={toneStroke[tone]}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r="4.5" fill={toneStroke[tone]} />
        <text
          x={cx}
          y={cy + 28}
          textAnchor="middle"
          className="fill-primary-text"
          style={{ fontSize: "18px", fontWeight: 700 }}
        >
          {shown}
        </text>
      </svg>
      {hint ? (
        <p className="mt-1 text-center text-xs text-secondary-text">{hint}</p>
      ) : null}
    </div>
  );
}
