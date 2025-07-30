"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // adjust this path
import { toast } from "sonner";
import { login } from "@/lib/api";

const loginSchema = z.object({
  email: z.string().email({ message: "Adresse email invalide" }),
  password: z.string().min(1, { message: "Le mot de passe est requis" }),
});
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // const pathname = usePathname();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      const res = await login(data);

      console.log("res:", res);
      localStorage.setItem("userFeudjoToken", res.data.accessToken);
      localStorage.setItem("userFeudjo", JSON.stringify(res.data.user));

      // ✅ Show success toast
      toast.success("Connexion réussie");

      // ✅ Redirect logic
      const cameFrom = document.referrer;

      const redirectTo =
        cameFrom.includes("/auth/register") ||
        cameFrom.includes("/auth/email-verified") ||
        cameFrom === ""
          ? "/shop"
          : undefined;

      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.back();
      }
    } catch (error: unknown) {
      const message =
        (error as ApiError)?.response?.data?.message ||
        "Login failed. Try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6 first-line h-full ", className)}
      {...props}
    >
      <Card className="overflow-hidden h-full">
        <CardContent className="grid p-0 md:grid-cols-2 h-full">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 md:p-16 h-full"
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Bienvenue</h1>
                <p className="text-balance text-muted-foreground">
                  Connectez-vous à votre compte
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Link
                    href="/auth/reset-password"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full text-white text-lg"
                disabled={loading}
              >
                {loading ? "Connexion..." : "Se connecter"}
              </Button>

              <div className="text-center text-sm">
                Vous n&apos;avez pas de compte ?{" "}
                <Link
                  href="/auth/register"
                  className="underline text-primary underline-offset-4"
                >
                  S&apos;inscrire
                </Link>
              </div>
            </div>
          </form>

          <div className="relative hidden bg-muted md:block">
            <Image
              src="/equipements.jpeg"
              alt="Image"
              fill
              className="absolute inset-0 min-h-4xl h-full  w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-muted-foreground text-balance [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        En cliquant sur continuer, vous acceptez nos
        <a href="#"> Conditions d&apos;utilisation </a> et notre
        <a href="#"> Politique de confidentialité</a>.
      </div>
    </div>
  );
}
