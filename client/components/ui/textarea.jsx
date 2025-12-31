export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`flex min-h-[100px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 
        placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white 
        focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-colors ${className}`}
      {...props}
    />
  );
}