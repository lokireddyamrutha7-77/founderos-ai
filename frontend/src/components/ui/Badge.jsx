export default function Badge({ children, icon }) {
  return (
    <div
      className="
      inline-flex
      items-center
      gap-2
      rounded-full
      border
      border-white/10
      bg-white/5
      px-4
      py-2
      text-sm
      font-medium
      text-[var(--muted)]
      "
    >
      {icon ?? <div className="h-2 w-2 rounded-full bg-violet-400" />}
      {children}
    </div>
  );
}
