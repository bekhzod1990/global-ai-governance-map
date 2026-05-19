import { useState } from "react";

export function DataQualityNotice() {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50/70 px-4 py-2.5 text-xs leading-relaxed text-amber-900">
      <svg
        aria-hidden="true"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mt-0.5 shrink-0 text-amber-700"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4" />
        <path d="M12 16h.01" />
      </svg>
      <p className="flex-1">
        <span className="font-semibold">Scope:</span> This map tracks AI-specific governance instruments only. It
        excludes general privacy, export-control, chip, semiconductor, and cybersecurity instruments unless they
        are explicitly AI-specific. May 2026 snapshot — verify time-sensitive details against official sources.
      </p>
      <button
        type="button"
        onClick={() => setOpen(false)}
        aria-label="Dismiss data-quality notice"
        className="rounded p-1 text-amber-700 hover:bg-amber-100"
      >
        <svg
          aria-hidden="true"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </div>
  );
}
