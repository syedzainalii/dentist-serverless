export function Badge({ className = "", variant = "default", ...props }) {
  const variants = {
    default:
      "bg-blue-100 text-blue-700",
    success:
      "bg-green-100 text-green-700",
    warning:
      "bg-yellow-100 text-yellow-700",
    danger:
      "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full  px-2.5 py-0.5 text-xs font-semibold ${
        variants[variant] ?? variants.default
      } ${className}`}
      {...props}
    />
  );
}