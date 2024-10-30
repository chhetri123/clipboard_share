"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (pin !== confirmPin) {
      setError("PINs do not match");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pin }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(`${data.message}. Redireting to login...`);
        // set 2 second redirect time with counter..
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        type="email"
        label="Email address"
        value={email}
        name="email"
        id="email"
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        label="PIN"
        value={pin}
        name="pin"
        id="pin"
        onChange={(e) => setPin(e.target.value)}
        required
      />
      <Input
        type="password"
        label="Confirm PIN"
        name="confirm_pin"
        id="confirm_pin"
        value={confirmPin}
        onChange={(e) => setConfirmPin(e.target.value)}
        required
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-blue500 text-sm">{success}</p>}
      <Button type="submit" fullWidth>
        Register
      </Button>
      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:text-blue-500">
          Sign in
        </Link>
      </p>
    </form>
  );
}
