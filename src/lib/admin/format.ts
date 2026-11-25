export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatLabel(value: string) {
  return value
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function statusTone(status: string) {
  switch (status) {
    case "new":
      return "bg-amber-50 text-amber-900 border-amber-200";
    case "in_progress":
    case "reviewed":
      return "bg-sky-50 text-sky-900 border-sky-200";
    case "closed":
      return "bg-emerald-50 text-emerald-900 border-emerald-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}
