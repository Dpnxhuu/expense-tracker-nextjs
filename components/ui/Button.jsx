export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 cursor-default select-none";

  const variants = {
    primary:
      "bg-gradient-to-r from-violet-600 to-violet-500 text-white border border-violet-400/30 hover:from-violet-500 hover:to-violet-400 btn-glow",
    secondary:
      "glass text-zinc-100 hover:bg-white/10 hover:border-white/20",
    ghost:
      "text-zinc-300 hover:text-white hover:bg-white/5",
    outline:
      "border border-white/15 text-zinc-200 hover:bg-white/5 hover:border-violet-400/40",
    danger:
      "glass text-red-300 border-red-500/20 hover:bg-red-500/10 hover:border-red-400/30",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base",
  };

  return (
    <button
      type="button"
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
