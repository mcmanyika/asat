"use client";

import { useTransition } from "react";

type StatusSelectProps = {
  id: string;
  status: string;
  options: { value: string; label: string }[];
  action: (formData: FormData) => Promise<{ error?: string; ok?: true }>;
};

export function StatusSelect({
  id,
  status,
  options,
  action,
}: StatusSelectProps) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          await action(formData);
        });
      }}
      className="inline-flex items-center gap-2"
    >
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        defaultValue={status}
        disabled={pending}
        onChange={(event) => {
          event.currentTarget.form?.requestSubmit();
        }}
        className="rounded-[4px] border border-border bg-white px-2 py-1.5 text-sm outline-none focus:border-gold disabled:opacity-60"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </form>
  );
}
