"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ApiError } from "@/types/errorTypes";
import { resetPassword } from "@/lib/api";
import Logo from "@/components/logo/logo";
import { MailCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ResetEmailPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReset = async () => {
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword(email);
      toast.success(
        res.data?.message || "Check your email for the reset link."
      );
      router.push("/auth/login"); // Redirect to login after sending reset link
    } catch (error: unknown) {
      const message =
        (error as ApiError)?.response?.data?.message ||
        "Failed to send reset link.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted">
      {/* Top nav / logo */}
      <header className="flex h-16 items-center justify-center border-b px-4 md:justify-start md:px-8">
        <Logo />
      </header>

      {/* Main content */}
      <main className="flex flex-1 items-center justify-center p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-3xl">
          <div className="max-w-md mx-auto mt-10 p-6 border bg-white rounded-lg shadow">
            <div className="flex flex-col items-center mb-6">
              <MailCheck className="h-12 w-12 text-primary mb-2" />
              <h1 className="text-2xl font-bold text-center">
                Reset Your Password
              </h1>
              <p className="text-sm text-gray-500 text-center mt-1">
                Enter your email address and we’ll send you a link to reset your
                password.
              </p>
            </div>

            <div className="mb-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button
              onClick={handleReset}
              disabled={loading}
              className="w-full text-white"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>

            {/* Back to login */}
            <div className="mt-6 text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center text-sm text-secondary hover:underline"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
