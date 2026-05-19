export function DeploymentBadge() {
  return (
    <a
      href="https://vercel.com/new"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-md border border-canvas-line bg-white px-2.5 py-1 text-[11px] font-medium text-ink-700 hover:border-ink-400"
      title="Deploy this project to Vercel"
    >
      <svg
        aria-hidden="true"
        width="11"
        height="11"
        viewBox="0 0 76 65"
        fill="currentColor"
      >
        <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
      </svg>
      <span>Deploy on Vercel</span>
    </a>
  );
}
