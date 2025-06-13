
import Logo from "@/components/logo/logo";
import { RegisterForm } from "@/components/registerForm/registerForm";

export default function RegisterPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted py-1 px-1 md:p-10">
      <div>
        <Logo />
      </div>
      <div className="w-full h-full  max-w-sm md:max-w-4xl 2xl:max-w-6xl">
        <RegisterForm />
      </div>
    </div>
  );
}
