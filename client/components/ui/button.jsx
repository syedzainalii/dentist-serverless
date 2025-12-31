// components/ui/button.jsx
"use client";

export function Button({ className = "", variant = "default", ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-10 px-6";
  
  const variants = {
    default:
      "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
    outline:
      "border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-700",
    ghost:
      "bg-transparent hover:bg-gray-100 text-gray-700",
    destructive:
      "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
  };

  return (
    <button
      className={`${base} ${variants[variant] ?? variants.default} ${className}`}
      {...props}
    />
  );
}

// components/ui/card.jsx
export function Card({ className = "", ...props }) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm ${className}`}
      {...props}
    />
  );
}

export function CardHeader({ className = "", ...props }) {
  return (
    <div className={`mb-4 flex flex-col space-y-1.5 ${className}`} {...props} />
  );
}

export function CardTitle({ className = "", ...props }) {
  return (
    <h3
      className={`text-lg font-semibold text-gray-900 ${className}`}
      {...props}
    />
  );
}

export function CardDescription({ className = "", ...props }) {
  return (
    <p
      className={`text-sm text-gray-600 ${className}`}
      {...props}
    />
  );
}

// components/ui/input.jsx
export function Input({ className = "", ...props }) {
  return (
    <input
      className={`flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-sm ${className}`}
      style={{ backgroundColor: 'white', color: '#111827' }}
      {...props}
    />
  );
}

// components/ui/label.jsx
export function Label({ className = "", ...props }) {
  return (
    <label
      className={`mb-2 block text-sm font-semibold text-gray-900 ${className}`}
      {...props}
    />
  );
}

// components/ui/textarea.jsx
export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`flex min-h-[100px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-colors shadow-sm ${className}`}
      style={{ backgroundColor: 'white', color: '#111827' }}
      {...props}
    />
  );
}

// components/ui/badge.jsx
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
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        variants[variant] ?? variants.default
      } ${className}`}
      {...props}
    />
  );
}