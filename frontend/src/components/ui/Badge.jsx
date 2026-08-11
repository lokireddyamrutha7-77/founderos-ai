export default function Badge({ children, icon }) {
  return (
    <div
      className="
      inline-flex
      items-center
      gap-2
      rounded-full
      border
      border-[var(--border)]
      bg-white
      px-4
      py-2
      text-sm
      font-medium
      text-[var(--muted)]
      shadow-sm
      "
    >
      {icon ?? <div className="h-2 w-2 rounded-full bg-[var(--gold)]" />}
      {children}
    </div>
  );
}
