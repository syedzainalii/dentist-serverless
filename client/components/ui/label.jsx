export function Label({ className = "", ...props }) {
  return (
    <label
      className={`mb-2 block text-sm font-medium text-gray-800  ${className}`}
      {...props}
    />
  );
}