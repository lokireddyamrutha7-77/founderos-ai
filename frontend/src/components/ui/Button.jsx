import { Loader2 } from "lucide-react";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled = false,
  icon,
  onClick,
  type = "button",
}) {
  const variants = {
    primary:
      "bg-black text-white hover:opacity-90 shadow-md",
    secondary:
      "bg-white border border-[var(--border)] text-[var(--text)] hover:bg-[var(--section)]",
    outline:
      "border border-black bg-transparent text-black hover:bg-black hover:text-white",
    gold:
      "bg-[var(--gold)] text-white hover:brightness-95",
    ghost:
      "bg-transparent text-[var(--text)] hover:bg-[var(--section)]",
  };

  const sizes = {
    sm: "px-5 py-2.5 text-sm",
    md: "px-6 py-3 text-[15px]",
    lg: "px-8 py-4 text-base",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={[
        "inline-flex items-center justify-center gap-2",
        "rounded-full font-medium leading-none whitespace-nowrap",
        "transition-all duration-300",
        variants[variant],
        sizes[size],
        fullWidth ? "w-full" : "",
        disabled || loading ? "opacity-60 cursor-not-allowed" : "",
      ].join(" ")}
    >
      {loading && <Loader2 size={18} className="animate-spin" />}
      {children}
      {!loading && icon}
    </button>
  );
}
