import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const IconArrowRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const IconDevices = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 7V7" />
  </svg>
);

const IconClipboard = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const IconShield = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export default function Home() {
  const { data, status } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Cross-Device Clipboard Manager
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Securely sync your clipboard across all your devices with
              end-to-end encryption.
            </p>
            <div className="space-y-4">
              <Link
                href={status === "authenticated" ? "/dashboard" : "/login"}
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Get Started Now
                <span className="ml-2">
                  <IconArrowRight />
                </span>
              </Link>
            </div>
          </div>

          {/* Instructions Section */}
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="text-blue-600 w-12 h-12">
                  <IconDevices />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                1. Login/Sign Up
              </h3>
              <p className="text-gray-600">
                Use the same account credentials to sign in on all your devices
                for seamless sync.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="text-blue-600 w-12 h-12">
                  <IconClipboard />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                2. Share Clipboard
              </h3>
              <p className="text-gray-600">
                Copy text on one device and access it instantly on your other
                connected devices.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="text-blue-600 w-12 h-12">
                  <IconShield />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                3. Secure Sync
              </h3>
              <p className="text-gray-600">
                Your data is protected with end-to-end encryption for maximum
                security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
