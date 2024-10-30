import { useEffect, useState } from "react";

export default function Toast({ toast, onClose }) {
  const { message, type = "success", timeout = 3000 } = toast || {};
  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

  useEffect(() => {
    if (toast) {
      const timeoutId = setTimeout(() => {
        onClose();
      }, timeout);

      return () => clearTimeout(timeoutId);
    }
  }, [toast, onClose, timeout]);

  return (
    toast && (
      <div
        className={`fixed top-4 right-4 bg-opacity-90 p-4 rounded-lg shadow-lg ${bgColor} text-white`}
      >
        <div className="flex items-center justify-between">
          <span>{message}</span>
          <button
            className="ml-4 text-white hover:text-gray-200"
            onClick={onClose}
          >
            ×
          </button>
        </div>
      </div>
    )
  );
}
