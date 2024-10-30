export default function Button({ children, fullWidth, ...props }) {
  return (
    <button
      {...props}
      className={`
        px-4 py-2 bg-blue-600 text-white rounded-lg
        hover:bg-blue-700 focus:outline-none focus:ring-2
        focus:ring-blue-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors
        ${fullWidth ? "w-full" : ""}
      `}
    >
      {children}
    </button>
  );
}
