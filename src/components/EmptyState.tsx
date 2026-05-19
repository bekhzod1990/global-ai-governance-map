interface Props {
  message: string;
}

export function EmptyState({ message }: Props) {
  return (
    <div className="rounded-lg border border-dashed border-canvas-line bg-canvas/60 px-4 py-3 text-xs leading-relaxed text-ink-500">
      {message}
    </div>
  );
}
