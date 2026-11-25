"use client";

import { useActionState, useState } from "react";
import { updateLandingSections } from "@/lib/admin/actions";
import {
  LANDING_SECTION_META,
  type LandingSectionKey,
  type LandingSectionsVisibility,
} from "@/lib/content/landing-sections-shared";
import { cn } from "@/lib/utils";

type State = { error?: string; ok?: true } | null;

async function saveAction(
  _prev: State,
  formData: FormData,
): Promise<State> {
  return updateLandingSections(formData);
}

type LandingSectionsFormProps = {
  initial: LandingSectionsVisibility;
};

export function LandingSectionsForm({ initial }: LandingSectionsFormProps) {
  const [sections, setSections] = useState(initial);
  const [state, formAction, pending] = useActionState(saveAction, null);

  function toggle(key: LandingSectionKey) {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <form action={formAction} className="space-y-4">
      {LANDING_SECTION_META.map((section) => (
        <input
          key={section.key}
          type="hidden"
          name={section.key}
          value={sections[section.key] ? "true" : "false"}
        />
      ))}

      <ul className="divide-y divide-border border border-border">
        {LANDING_SECTION_META.map((section) => {
          const enabled = sections[section.key];
          return (
            <li
              key={section.key}
              className="flex items-center justify-between gap-4 px-4 py-3.5"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-primary-text">
                  {section.label}
                </p>
                <p className="mt-0.5 text-xs text-secondary-text">
                  {section.description}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={enabled}
                aria-label={`${enabled ? "Hide" : "Show"} ${section.label}`}
                onClick={() => toggle(section.key)}
                className={cn(
                  "relative h-7 w-12 shrink-0 rounded-full transition-colors",
                  enabled ? "bg-corporate-blue" : "bg-slate-300",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 left-0.5 size-6 rounded-full bg-white shadow transition-transform",
                    enabled && "translate-x-5",
                  )}
                />
              </button>
            </li>
          );
        })}
      </ul>

      {state?.error ? (
        <p className="border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
          {state.error}
        </p>
      ) : null}

      {state?.ok ? (
        <p className="border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          Landing page sections updated.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#15233a] disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save landing sections"}
      </button>
    </form>
  );
}
