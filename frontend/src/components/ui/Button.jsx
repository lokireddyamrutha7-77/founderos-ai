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
      "bg-linear-to-r from-violet-500 to-blue-500 text-white hover:opacity-90 shadow-lg shadow-violet-500/20",
    secondary:
      "bg-white/5 border border-white/15 text-white hover:bg-white/10",
    outline:
      "border border-white/20 bg-transparent text-white hover:bg-white/10",
    gold:
      "bg-violet-500 text-white hover:brightness-95",
    ghost:
      "bg-transparent text-white hover:bg-white/5",
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
