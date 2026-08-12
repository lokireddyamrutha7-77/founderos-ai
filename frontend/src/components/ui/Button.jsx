export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-full";

  const sizes = {
    sm: "px-4 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3 text-base",
  };

  const variants = {
    primary:
      "bg-[var(--text)] text-white hover:opacity-90 shadow-[var(--shadow-sm)]",
    gold:
      "bg-[var(--gold)] text-white hover:bg-[var(--gold-dark)] shadow-[var(--shadow-sm)]",
    outline:
      "bg-white border border-[var(--border)] text-[var(--text)] hover:border-[var(--gold)] hover:text-[var(--gold-dark)]",
    ghost:
      "bg-transparent text-[var(--muted)] hover:bg-[var(--gold-light)]/40 hover:text-[var(--gold-dark)]",
    pillActive: "bg-[var(--text)] text-white",
    pillInactive:
      "bg-white border border-[var(--border)] text-[var(--muted)] hover:border-[var(--gold)]",
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}