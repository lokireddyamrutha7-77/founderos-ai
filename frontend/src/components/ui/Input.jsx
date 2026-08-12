export function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--muted)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold-light)] ${className}`}
      {...props}
    />
  );
}

export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--muted)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold-light)] resize-none ${className}`}
      {...props}
    />
  );
}

export function Select({ className = "", children, ...props }) {
  return (
    <select
      className={`w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2.5 text-sm text-[var(--text)] outline-none transition focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold-light)] ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}