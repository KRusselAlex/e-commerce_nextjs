"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordConfirm } from "@/lib/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/types/errorTypes";
import Logo from "@/components/logo/logo";
import { Lock, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const passwordSchema = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[A-Z]/, "Must include an uppercase letter")
  .regex(/[0-9]/, "Must include a number")
  .regex(/[!@#$%^&*]/, "Must include a special character");

const schema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const router = useRouter();
  const { token } = useParams();
  if (!token || (Array.isArray(token) && token.length === 0)) {
    router.push("/notfound");
  }

  const stringToken = Array.isArray(token) ? token[0] : token ?? "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirm = () => setShowConfirm(!showConfirm);

  const onSubmit = async (data: FormData) => {
    if (!token) {
      toast.error("Missing token.");
      return;
    }

    try {
        console.log("je suis ici")
        console.log(stringToken,data.password)
      await resetPasswordConfirm(stringToken, data.password);
      toast.success("Password reset successful. You can now log in.");
      router.push("/auth/login");
    } catch (error: unknown) {
      const message =
        (error as ApiError)?.response?.data?.message ||
        "Failed to reset password.";
      toast.error(message);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <header className="flex h-16 items-center justify-center border-b px-4 md:justify-start md:px-8">
        <Logo />
      </header>

      <main className="flex flex-1 items-center justify-center p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-3xl">
          <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md p-6">
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="text-center mb-2">
                    <ShieldCheck className="mx-auto mb-2 h-10 w-10 text-primary" />
                    <h2 className="text-2xl font-bold">Reset Your Password</h2>
                    <p className="text-sm text-muted-foreground">
                      Please choose a strong new password.
                    </p>
                  </div>

                  {/* Password field */}
                  <div className="space-y-2 relative">
                    <Label
                      htmlFor="password"
                      className="flex items-center gap-1"
                    >
                      <Lock className="w-4 h-4" /> New Password
                    </Label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="Enter a strong password"
                      {...register("password")}
                      className="pr-10"
                    />
                    <div
                      className="absolute right-3 top-[26px] cursor-pointer text-muted-foreground"
                      onClick={togglePassword}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-500">
                        {errors.password.message}
                      </p>
                    )}
                    <ul className="text-xs text-gray-500 mt-1 list-disc list-inside">
                      <li>At least 8 characters</li>
                      <li>1 uppercase letter</li>
                      <li>1 number</li>
                      <li>1 special character (!@#$...)</li>
                    </ul>
                  </div>

                  {/* Confirm password field */}
                  <div className="space-y-2 relative">
                    <Label
                      htmlFor="confirmPassword"
                      className="flex items-center gap-1"
                    >
                      <Lock className="w-4 h-4" /> Confirm Password
                    </Label>
                    <Input
                      type={showConfirm ? "text" : "password"}
                      id="confirmPassword"
                      placeholder="Re-enter your password"
                      {...register("confirmPassword")}
                      className="pr-10"
                    />
                    <div
                      className="absolute right-3 top-[26px] cursor-pointer text-muted-foreground"
                      onClick={toggleConfirm}
                    >
                      {showConfirm ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Resetting..." : "Reset Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
