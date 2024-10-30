import React, { useState } from "react";
import Toast from "../ui/Toast";
import { decrypt } from "@/lib/secure";
import { Copy, Trash2, Lock, ChevronDown, ChevronUp } from "lucide-react";

const ClipboardItem = ({ item }) => {
  const [showContent, setShowContent] = useState(!item.isEncrypted);
  const [pin, setPin] = useState("");
  const [showPinInput, setShowPinInput] = useState(false);
  const [toast, setToast] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const truncateText = (text) => {
    return (
      <div className="relative">
        <div
          className={`whitespace-pre-wrap break-words ${
            !isExpanded ? "max-h-24 overflow-hidden" : ""
          }`}
        >
          {text}
        </div>
        {text.length > 200 && ( // Show expand button only for long content
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-blue-600 hover:text-blue-700 flex items-center text-sm font-medium"
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp className="w-4 h-4 ml-1" />
              </>
            ) : (
              <>
                Show More <ChevronDown className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        )}
      </div>
    );
  };

  const handleCopy = async () => {
    if (item.isEncrypted && !showContent) {
      setShowPinInput(true);
      return;
    }

    try {
      await navigator.clipboard.writeText(decrypt(item.content));
      setToast({
        message: "Copied to clipboard!",
        type: "success",
      });
    } catch (error) {
      setToast({
        message: "Failed to copy content",
        type: "error",
      });
    }
  };

  const handleUnlock = async () => {
    try {
      const response = await fetch("/api/clipboard/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item._id, pin }),
      });

      const data = await response.json();

      if (data.success) {
        setShowContent(true);
        setShowPinInput(false);
        setToast({
          message: "Content unlocked!",
          type: "success",
        });
      } else {
        setToast({ message: "Invalid PIN", type: "error", timeout: 3000 });
      }
    } catch (error) {
      setToast({
        message: "Failed to unlock content",
        type: "error",
      });
    }
    setPin("");
  };

  const handleClipBoardDelete = async () => {
    try {
      const res = await fetch(`/api/clipboard/delete/${item._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (data.success) {
        setToast({
          message: "Deleted Clipboard Item",
          type: "success",
        });
      } else {
        setToast({
          message: "Failed to delete Clipboard Item",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Failed to delete clipboard item:", error);
      setToast({
        message: "Failed to delete clipboard item",
        type: "error",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {new Date(item.createdAt).toLocaleString()}
            </span>
            {item.isEncrypted && <Lock className="w-4 h-4 text-yellow-500" />}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleCopy}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            >
              <Copy className="w-5 h-5" />
            </button>
            <button
              onClick={handleClipBoardDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {showPinInput ? (
          <div className="flex space-x-2">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN to unlock"
              className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleUnlock}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Unlock
            </button>
          </div>
        ) : (
          <div className="text-gray-700">
            {showContent
              ? truncateText(decrypt(item.content))
              : truncateText("•".repeat(20))}
          </div>
        )}
      </div>

      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default ClipboardItem;
