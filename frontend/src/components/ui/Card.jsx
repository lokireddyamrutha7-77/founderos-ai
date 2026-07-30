export default function Card({
  children,
  className = "",
}) {
  return (
    <div
      className={`
      rounded-[28px]
      border
      border-[var(--border)]
      bg-white
      shadow-[var(--shadow-md)]
      transition-all
      duration-300
      hover:-translate-y-1
      hover:shadow-[var(--shadow-lg)]
      ${className}
      `}
    >
      {children}
    </div>
  );
}