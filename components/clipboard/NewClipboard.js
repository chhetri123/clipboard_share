"use client";
import React, { useState } from "react";
import Card from "@/components/ui/Card";
import { Lock } from "lucide-react";
import { encrypt } from "@/lib/secure";

const NewClipboard = () => {
  const [content, setContent] = useState("");
  const [isSecure, setIsSecure] = useState(false);
  const [securePin, setSecurePin] = useState("");

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const encryptedContent = encrypt(content);

      const res = await fetch("api/clipboard/create", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: encryptedContent,
          isSecure,
          securePin,
        }),
      });
      const data = await res.json();

      if (data.success) {
      }

      setContent("");
      setIsSecure(false);
      setSecurePin("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Paste your content here..."
            rows="3"
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="secure"
              checked={isSecure}
              onChange={(e) => setIsSecure(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="secure" className="flex items-center space-x-2">
              <Lock className="w-4 h-4" />
              <span>Make it secure</span>
            </label>
          </div>

          {isSecure && (
            <input
              type="password"
              value={securePin}
              onChange={(e) => setSecurePin(e.target.value)}
              placeholder="Enter secure PIN"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          )}

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save to Clipboard
          </button>
        </div>
      </form>
    </Card>
  );
};

export default NewClipboard;
